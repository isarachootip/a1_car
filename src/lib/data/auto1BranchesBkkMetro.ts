export interface Auto1StaffSeedItem {
  name: string;
  role: "STAFF" | "ADMIN";
}

export interface Auto1BranchDefinition {
  code: string;
  name: string;
  phone: string;
  region: string;
  lat: number;
  lng: number;
  customStaff?: Auto1StaffSeedItem[];
}

export const AUTO1_BRANCHES_BKK_METRO: Auto1BranchDefinition[] = [
  // กรุงเทพมหานคร (16 สาขา)
  { code: "BKK-CHIDLOM", name: "ออโต้วัน สาขาเซ็นทรัล ชิดลม", phone: "02-103-5261", region: "กรุงเทพมหานคร", lat: 13.7442, lng: 100.5446 },
  { code: "BKK-SATHON", name: "ออโต้วัน สาขาสาทร (นราธิวาส 16)", phone: "02-550-9319", region: "กรุงเทพมหานคร", lat: 13.7086, lng: 100.5364 },
  {
    code: "BKK-RAMA3",
    name: "ออโต้วัน สาขาโลตัส พระราม 3",
    phone: "02-123-4567",
    region: "กรุงเทพมหานคร",
    lat: 13.6969,
    lng: 100.5389,
    customStaff: [
      { name: "สมชาย ใจดี (ช่างเทคนิคอาวุโส)", role: "STAFF" },
      { name: "วิชัย บริการดี (เจ้าหน้าที่รับ-ส่งรถ)", role: "STAFF" },
      { name: "เกรียงไกร ศรีสวัสดิ์ (ผู้จัดการสาขา)", role: "ADMIN" },
    ],
  },
  { code: "BKK-CHARAN35", name: "ออโต้วัน สาขาจรัญสนิทวงศ์ 35", phone: "02-550-8106", region: "กรุงเทพมหานคร", lat: 13.7604, lng: 100.4697 },
  { code: "BKK-SAPHANMAI", name: "ออโต้วัน สาขาสะพานใหม่ (พหลโยธิน)", phone: "02-103-5269", region: "กรุงเทพมหานคร", lat: 13.8943, lng: 100.6085 },
  { code: "BKK-THEPHARAK-MP", name: "ออโต้วัน สาขามาร์เก็ตเพลส เทพรักษ์", phone: "02-103-5270", region: "กรุงเทพมหานคร", lat: 13.8865, lng: 100.6312 },
  { code: "BKK-SAFARI", name: "ออโต้วัน สาขาแยกซาฟารี (เลียบคลองสอง)", phone: "02-407-9124", region: "กรุงเทพมหานคร", lat: 13.8612, lng: 100.6987 },
  { code: "BKK-RATPHAT", name: "ออโต้วัน สาขาราษฎร์พัฒนา (รามคำแหง)", phone: "02-101-8975", region: "กรุงเทพมหานคร", lat: 13.7782, lng: 100.6924 },
  { code: "BKK-SUKHAPHIBAN3", name: "ออโต้วัน สาขาไทวัสดุ สุขาภิบาล 3", phone: "02-550-7610", region: "กรุงเทพมหานคร", lat: 13.7972, lng: 100.7138 },
  { code: "BKK-LADKRABANG", name: "ออโต้วัน สาขาโรบินสัน ลาดกระบัง", phone: "02-550-6923", region: "กรุงเทพมหานคร", lat: 13.7224, lng: 100.7318 },
  { code: "BKK-BANGKHAE", name: "ออโต้วัน สาขาบางแค (เพชรเกษม)", phone: "02-407-9125", region: "กรุงเทพมหานคร", lat: 13.7118, lng: 100.4152 },
  { code: "BKK-CEN-RAMA2", name: "ออโต้วัน สาขาเซ็นทรัล พระราม 2", phone: "02-103-5265", region: "กรุงเทพมหานคร", lat: 13.6634, lng: 100.4388 },
  { code: "BKK-TW-RAMA2", name: "ออโต้วัน สาขาไทวัสดุ พระราม 2", phone: "02-550-8115", region: "กรุงเทพมหานคร", lat: 13.6194, lng: 100.3865 },
  { code: "BKK-BANGBON", name: "ออโต้วัน สาขาไทวัสดุ บางบอน", phone: "02-101-8980", region: "กรุงเทพมหานคร", lat: 13.6584, lng: 100.3802 },
  { code: "BKK-SUKSAWAD", name: "ออโต้วัน สาขาไทวัสดุ สุขสวัสดิ์", phone: "02-101-8982", region: "กรุงเทพมหานคร", lat: 13.6521, lng: 100.5204 },
  { code: "BKK-NAWAMIN", name: "ออโต้วัน สาขาไทวัสดุ นวมินทร์", phone: "02-101-8985", region: "กรุงเทพมหานคร", lat: 13.8168, lng: 100.6422 },

  // นนทบุรี (7 สาขา)
  {
    code: "NON-CHAENG",
    name: "ออโต้วัน สาขาโรบินสัน แจ้งวัฒนะ",
    phone: "02-345-6789",
    region: "ปริมณฑล (นนทบุรี)",
    lat: 13.9039,
    lng: 100.5257,
    customStaff: [
      { name: "ธีรภัทร มั่นคง (เจ้าหน้าที่รับ-ส่งรถ)", role: "STAFF" },
      { name: "อนุชา ชำนาญกิจ (ช่างเทคนิคอาวุโส)", role: "STAFF" },
      { name: "ปิยะนุช วงศ์สุวรรณ (ผู้จัดการสาขา)", role: "ADMIN" },
    ],
  },
  { code: "NON-RATTANA", name: "ออโต้วัน สาขาไทวัสดุ รัตนาธิเบศร์", phone: "02-101-8971", region: "ปริมณฑล (นนทบุรี)", lat: 13.8685, lng: 100.4782 },
  { code: "NON-WESTGATE", name: "ออโต้วัน สาขาเซ็นทรัล เวสต์เกต", phone: "02-102-8715", region: "ปริมณฑล (นนทบุรี)", lat: 13.8768, lng: 100.4114 },
  { code: "NON-BANGYAI", name: "ออโต้วัน สาขาไทวัสดุ บางใหญ่", phone: "02-102-8718", region: "ปริมณฑล (นนทบุรี)", lat: 13.8412, lng: 100.4125 },
  { code: "NON-BANGBUATHONG", name: "ออโต้วัน สาขาไทวัสดุ บางบัวทอง", phone: "02-102-8720", region: "ปริมณฑล (นนทบุรี)", lat: 13.9352, lng: 100.4188 },
  { code: "NON-CHAIPHHRUEK", name: "ออโต้วัน สาขาไทวัสดุ ชัยพฤกษ์ (บางคูวัต)", phone: "02-101-0471", region: "ปริมณฑล (นนทบุรี)", lat: 13.9384, lng: 100.4912 },
  { code: "NON-RATCHAPHRUEK", name: "ออโต้วัน สาขาโรบินสัน ราชพฤกษ์", phone: "02-102-8725", region: "ปริมณฑล (นนทบุรี)", lat: 13.9195, lng: 100.4518 },
];
