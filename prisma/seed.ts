import { prisma } from "../src/lib/db";
import { AUTO1_BRANCH_CATALOG } from "../src/lib/data/auto1BranchCatalog";
import { ensureSysAdminAndStaffCredentials } from "../src/lib/repositories/userRepository";

async function main(): Promise<void> {
  await ensureSysAdminAndStaffCredentials();
  console.log(
    `Seeded ${AUTO1_BRANCH_CATALOG.length} AUTO1 branches, sysadmin, and staff credentials successfully.`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
