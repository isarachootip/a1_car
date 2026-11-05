import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const branches = [
    {
      code: "BKK-RAMA3",
      name: "ออโต้วัน สาขาโลตัส พระราม 3",
      phone: "02-123-4567",
      staff: [
        { name: "สมชาย ใจดี (ช่างเทคนิคอาวุโส)", role: "STAFF" },
        { name: "วิชัย บริการดี (เจ้าหน้าที่รับ-ส่งรถ)", role: "STAFF" },
      ],
    },
    {
      code: "BKK-BANGNA",
      name: "ออโต้วัน สาขาเมกา บางนา",
      phone: "02-234-5678",
      staff: [
        { name: "กิตติพงศ์ รวดเร็ว (เจ้าหน้าที่รับ-ส่งรถ)", role: "STAFF" },
        { name: "นภัสสร ดูแลดี (ผู้จัดการสาขา)", role: "ADMIN" },
      ],
    },
    {
      code: "NON-CHAENG",
      name: "ออโต้วัน สาขาโรบินสัน แจ้งวัฒนะ",
      phone: "02-345-6789",
      staff: [
        { name: "ธีรภัทร มั่นคง (เจ้าหน้าที่รับ-ส่งรถ)", role: "STAFF" },
      ],
    },
  ];

  for (const b of branches) {
    const existing = await prisma.branch.findUnique({ where: { code: b.code } });
    if (!existing) {
      await prisma.branch.create({
        data: {
          code: b.code,
          name: b.name,
          phone: b.phone,
          staff: {
            create: b.staff,
          },
        },
      });
    }
  }
  console.log("Seeded AUTO1 branches and staff successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
