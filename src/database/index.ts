import mongodb from "./mongo";

export default async () => {
  // connect to mongodb
  mongodb.connect();
};
