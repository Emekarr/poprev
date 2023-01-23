import { Model, ClientSession, Document, Query } from "mongoose";

import { PaginateOptions, Repository } from "./types";

export default abstract class MongoDbRepository<
  T extends Document<any, any, any>
> implements Repository
{
  constructor(private model: Model<any>) {}

  // used to ensure that filter options works properly
  private __cleanFilterOptions(filter: object): object {
    Object.keys(filter).forEach((item) => {
      !(filter as any)[item] && delete (filter as any)[item];
      if (item === "id") {
        (filter as any)._id = (filter as any).id;
        delete (filter as any)["id"];
      }
    });
    return filter;
  }

  // used to populate a mongoose query
  private async __populateQuery(
    query: Query<any, any>,
    populateKeys: string[] = []
  ): Promise<T> {
    if (populateKeys.length <= 0) return await query;
    let populated!: T;
    for (let i = 0; i < populateKeys.length; i++) {
      const key = populateKeys[i];
      populated = (await query.populate(key)) as T;
    }
    return populated;
  }

  // used to populate a mongoose documents
  private async __populateDocument(
    doc: Document,
    populateKeys: string[]
  ): Promise<T> {
    populateKeys.forEach(async (key) => await doc.populate(key));
    return doc as T;
  }

  // NOT USED BECASUE OF MONGOOSE PAGINATE V2 LIBRARY
  // used to paginate databse requests
  private async __paginate(
    query: Query<any, any>,
    paginate: PaginateOptions = { limit: 10, page: 1 },
    populateKeys: string[] = []
  ): Promise<Document[]> {
    const limit = paginate.limit === 0 ? 5 : paginate.limit;
    const page = paginate.page === 0 ? 5 : paginate.page;
    const docs: Document[] = await query.limit(limit).skip((page - 1) * limit);
    return await Promise.all(
      docs.map(async (doc) => {
        const test = await this.__populateDocument(doc, populateKeys);
        return test;
      })
    );
  }

  async startSession() {
    return await this.model.startSession();
  }

  async startTransaction(session: ClientSession, job: () => Promise<any>) {
    let result: any;
    try {
      session.startTransaction();
      result = await job();
      await session.commitTransaction();
      session.endSession();
    } catch (err: any) {
      await session.abortTransaction();
      session.endSession();
      result = err.message;
    }
    return result;
  }

  async findLast(filter: object): Promise<T> {
    return (
      (await this.model
        .find(this.__cleanFilterOptions(filter))
        .sort({ _id: -1 })
        .limit(1)) as T[]
    )[0];
  }

  async createEntry(payload: any): Promise<T> {
    return await new this.model(payload).save();
  }

  async findById(id: string, populateKeys?: string[]): Promise<T> {
    return await this.__populateQuery(this.model.findById(id), populateKeys);
  }

  async findManyByFields(
    filter: object,
    paginate: PaginateOptions = { limit: 10, page: 1 },
    populateKeys: string[] = [],
    sort?: number
  ): Promise<T[]> {
    (paginate as any).populate = populateKeys;
    return await (this.model as any).paginate(
      this.__cleanFilterOptions(filter),
      {
        page: paginate.page,
        limit: paginate.limit,
        sort: { createdAt: sort },
      }
    );
  }

  async findOneByFields(filter: object, populateKeys?: string[]): Promise<T> {
    return await this.__populateQuery(
      this.model.findOne(this.__cleanFilterOptions(filter)),
      populateKeys
    );
  }

  async findAll(
    paginate: PaginateOptions = { limit: 30, page: 1 },
    populateKeys?: string[]
  ): Promise<T[]> {
    paginate.populate = populateKeys;
    return await (this.model as any).paginate(paginate);
  }

  async updateById(id: string, payload: object): Promise<boolean> {
    let success!: boolean;
    try {
      const updatedDoc = await this.model.findByIdAndUpdate(id, payload);
      if (!updatedDoc) throw new Error("Doc could not be updated");
      success = true;
    } catch (err) {
      success = false;
    }
    return success;
  }

  async updateByIdAndReturn(id: string, payload: object): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, payload, { new: true });
  }

  async updateByFields(
    filter: object,
    payload: object
  ): Promise<boolean | string> {
    let success!: boolean | string;
    try {
      await this.model
        .findOneAndUpdate(filter, payload, {}, (err, doc, res) => {
          if (!doc) throw new Error("Document not found");
          success = true;
        })
        .clone();
    } catch (err: any) {
      success = err.message;
    }
    return success;
  }

  async updateByFieldsAndReturn(
    filter: object,
    payload: object
  ): Promise<T | null> {
    return await this.model.findOneAndUpdate(filter, payload, {});
  }

  async deleteMany(filter: object): Promise<string | boolean> {
    let message: string | boolean;
    try {
      await this.model.deleteMany(filter, {});
      message = true;
    } catch (err: any) {
      message = err.message;
    }
    return message;
  }

  async deleteById(id: string): Promise<string | boolean> {
    let success!: string | boolean;
    try {
      const deletedDoc = await this.model.findByIdAndDelete(id);
      if (!deletedDoc) throw new Error("Document not found");
      success = true;
    } catch (err: any) {
      success = err.message;
    }
    return success;
  }

  async countDocs(filter: any): Promise<number> {
    return await this.model.count(filter);
  }

  async saveData(payload: Document): Promise<T> {
    return (await payload.save()) as T;
  }

  __truncate(condition: object) {
    if (process.env.NODE_ENV === "DEV") {
      this.model.deleteMany(condition);
    }
  }
}
