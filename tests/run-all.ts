import { runHandoverDomainTests } from "./handoverRules.test";
import { runGeoCalculatorTests } from "./geoCalculator.test";
import { runRepositoryIntegrationTests } from "./repository.test";
import { runAuthAndUsersTests } from "./authAndUsers.test";

async function main(): Promise<void> {
  try {
    runHandoverDomainTests();
    runGeoCalculatorTests();
    await runRepositoryIntegrationTests();
    await runAuthAndUsersTests();
    console.log("🎉 ALL TESTS PASSED!");
  } catch (error) {
    console.error("❌ TEST SUITE FAILED:", error);
    process.exit(1);
  }
}

main();
