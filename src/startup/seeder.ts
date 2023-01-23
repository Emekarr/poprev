import adminRepo from "../app/admin/repository/adminRepo";
import CreateAdminUseCase from "../app/admin/usecases/CreateAdminUseCase";

const seedSuperAdmin = async () => {
  const admin = await adminRepo.findAll();
  if ((admin as any).docs.length === 0) {
    await CreateAdminUseCase.execute({
      name: "superadmin",
      email: process.env.POPREV_SUPER_EMAIL as string,
      password: process.env.POPREV_SUPER_PASSWORD as string,
    });
  }
};

export default async () => {
  await seedSuperAdmin();
};
