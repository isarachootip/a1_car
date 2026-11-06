import {
  AUTO1_BRANCHES_BKK_METRO,
  Auto1BranchDefinition,
  Auto1StaffSeedItem,
} from "./auto1BranchesBkkMetro";
import { AUTO1_BRANCHES_METRO_AND_CENTRAL } from "./auto1BranchesMetroAndCentral";
import { AUTO1_BRANCHES_REGIONAL } from "./auto1BranchesRegional";

export interface Auto1BranchCatalogEntry extends Auto1BranchDefinition {
  staff: Auto1StaffSeedItem[];
}

const THAI_FIRST_NAMES = [
  "ณัฐพล", "กิตติศักดิ์", "ธนกร", "ศุภชัย", "พงศกร",
  "วรเมธ", "จักรกฤษณ์", "อภิสิทธิ์", "เจษฎา", "พีรพัฒน์",
  "ชานนท์", "ธีรพงศ์", "ภัทรพล", "นพดล", "เอกชัย",
  "สุรเดช", "ภาณุวัฒน์", "เกียรติศักดิ์", "ชัยวัฒน์", "ศักดิ์ดา",
  "ปิยะพงศ์", "ธวัชชัย", "อนุวัฒน์", "อานนท์", "วีรยุทธ",
];

const THAI_MANAGER_NAMES = [
  "กมลชนก", "พิชญา", "สุภาพร", "ณัฐณิชา", "ปาริชาติ",
  "วรรณภา", "อัญชลี", "สิริพร", "กัญญาณัฐ", "พรทิพย์",
  "ธนัญญา", "มนัสนันท์", "ชนิกานต์", "รัตนาภรณ์", "ศิริลักษณ์",
  "วรัญญา", "จิราภรณ์", "ชุติมา", "ดารณี", "เบญจมาศ",
];

const THAI_LAST_NAMES = [
  "เจริญสุข", "วงศ์สวัสดิ์", "ศรีสุวรรณ", "เกียรติพิริยะ", "รัตนโชติ",
  "พิทักษ์ไทย", "ธนกิจเจริญ", "สุขสวัสดิ์", "บุญญฤทธิ์", "อัศวเมธี",
  "มงคลชัย", "โชติช่วง", "เลิศวิไล", "วัฒนากูล", "พงษ์พานิช",
  "ศิริกุล", "สมบูรณ์ผล", "อินทร์จันทร์", "ทองดี", "ชัยมงคล",
];

function buildDemoStaffForBranch(index: number): Auto1StaffSeedItem[] {
  const driverFirst = THAI_FIRST_NAMES[index % THAI_FIRST_NAMES.length];
  const driverLast = THAI_LAST_NAMES[(index * 3 + 1) % THAI_LAST_NAMES.length];

  const techFirst = THAI_FIRST_NAMES[(index + 7) % THAI_FIRST_NAMES.length];
  const techLast = THAI_LAST_NAMES[(index * 5 + 2) % THAI_LAST_NAMES.length];

  const mgrFirst = THAI_MANAGER_NAMES[index % THAI_MANAGER_NAMES.length];
  const mgrLast = THAI_LAST_NAMES[(index * 7 + 3) % THAI_LAST_NAMES.length];

  return [
    {
      name: `${driverFirst} ${driverLast} (เจ้าหน้าที่รับ-ส่งรถ)`,
      role: "STAFF",
    },
    {
      name: `${techFirst} ${techLast} (ช่างเทคนิคอาวุโส)`,
      role: "STAFF",
    },
    {
      name: `${mgrFirst} ${mgrLast} (ผู้จัดการสาขา)`,
      role: "ADMIN",
    },
  ];
}

const RAW_BRANCH_LIST: Auto1BranchDefinition[] = [
  ...AUTO1_BRANCHES_BKK_METRO,
  ...AUTO1_BRANCHES_METRO_AND_CENTRAL,
  ...AUTO1_BRANCHES_REGIONAL,
];

export const AUTO1_BRANCH_CATALOG: Auto1BranchCatalogEntry[] = RAW_BRANCH_LIST.map(
  (branch, idx) => ({
    ...branch,
    staff: branch.customStaff ?? buildDemoStaffForBranch(idx),
  })
);

export const BRANCH_COORDINATES: Record<string, { lat: number; lng: number }> =
  Object.fromEntries(
    AUTO1_BRANCH_CATALOG.map((b) => [b.code, { lat: b.lat, lng: b.lng }])
  );
