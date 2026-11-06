import assert from "node:assert/strict";
import {
  generateStaffUsername,
  hashPassword,
  STAFF_DEFAULT_PASSWORD,
  SYSADMIN_DEFAULT_PASSWORD,
  SYSADMIN_USERNAME,
  verifyPassword,
  createSessionToken,
  verifySessionToken,
} from "../src/lib/domain/authPassword";
import {
  authenticateUser,
  createStaffUserAccount,
  ensureSysAdminAndStaffCredentials,
  listAllUsers,
  updateStaffUserAccount,
} from "../src/lib/repositories/userRepository";

export async function runAuthAndUsersTests(): Promise<void> {
  console.log("Running Authentication & User Management Tests...");

  // 1. Password hashing & verification
  const sysHash = hashPassword(SYSADMIN_DEFAULT_PASSWORD);
  assert.equal(verifyPassword("oil10041969*", sysHash), true);
  assert.equal(verifyPassword("wrong-pass", sysHash), false);

  const staffHash = hashPassword(STAFF_DEFAULT_PASSWORD);
  assert.equal(verifyPassword("1234", staffHash), true);

  // 2. Username generator
  assert.equal(generateStaffUsername("BKK-RAMA3", 0), "bkk-rama3-01");
  assert.equal(generateStaffUsername("KKN-CEN-KHONKAEN", 2), "kkn-cen-khonkaen-03");

  // 3. Session token sign & verify
  const token = createSessionToken({
    id: "u1",
    username: "sysadmin",
    name: "System Admin",
    role: "SYSADMIN",
    branchId: "b1",
    branchName: "สำนักงานใหญ่",
  });
  const verified = verifySessionToken(token);
  assert.ok(verified);
  assert.equal(verified.username, "sysadmin");
  assert.equal(verified.role, "SYSADMIN");

  // 4. Sync sysadmin & all branch staff credentials
  await ensureSysAdminAndStaffCredentials();
  const allUsers = await listAllUsers();
  assert.ok(allUsers.length >= 240, `Expected >= 240 users, got ${allUsers.length}`);

  // 5. Authenticate sysadmin with "oil10041969*"
  const sysUser = await authenticateUser(SYSADMIN_USERNAME, "oil10041969*");
  assert.ok(sysUser, "sysadmin should authenticate with oil10041969*");
  assert.equal(sysUser.role, "SYSADMIN");

  const badSys = await authenticateUser(SYSADMIN_USERNAME, "1234");
  assert.equal(badSys, null, "sysadmin must reject wrong password");

  // 6. Authenticate branch staff with username or Thai name and password "1234"
  const rama3Staff = allUsers.find((u) => u.branchCode === "BKK-RAMA3" && u.role !== "SYSADMIN");
  assert.ok(rama3Staff, "Should find a BKK-RAMA3 staff user");

  const byUsername = await authenticateUser(rama3Staff.username, "1234");
  assert.ok(byUsername, "Branch staff should authenticate by username + 1234");

  const shortName = rama3Staff.name.split("(")[0].trim();
  const byThaiName = await authenticateUser(shortName, "1234");
  assert.ok(byThaiName, "Branch staff should authenticate by Thai name + 1234");

  // 7. Create & Update user via User Management repository
  const uniqueUsername = `test-staff-${Date.now()}`;
  const created = await createStaffUserAccount({
    username: uniqueUsername,
    name: "พนักงานทดสอบ ระบบใหม่ (เจ้าหน้าที่รับ-ส่งรถ)",
    role: "STAFF",
    branchId: rama3Staff.branchId,
    password: "1234",
  });
  assert.equal(created.username, uniqueUsername);

  const updated = await updateStaffUserAccount(created.id, {
    role: "ADMIN",
    password: "9999",
  });
  assert.equal(updated.role, "ADMIN");
  const authUpdated = await authenticateUser(uniqueUsername, "9999");
  assert.ok(authUpdated);

  console.log("✅ All Authentication & User Management Tests Passed!");
}
