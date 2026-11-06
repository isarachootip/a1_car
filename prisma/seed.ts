import { prisma } from "../src/lib/db";
import { AUTO1_BRANCH_CATALOG } from "../src/lib/data/auto1BranchCatalog";
import { syncAuto1BranchesCatalog } from "../src/lib/repositories/branchRepository";

async function main(): Promise<void> {
  await syncAuto1BranchesCatalog();
  console.log(
    `Seeded ${AUTO1_BRANCH_CATALOG.length} AUTO1 branches and demo staff successfully.`
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
