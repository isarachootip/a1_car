import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AUTO1 — ระบบใบรับ-ส่งมอบรถยนต์นอกสถานที่ (Pick-up & Delivery)",
  description:
    "ระบบบันทึกข้อมูล ตรวจสอบสภาพตัวถัง ถ่ายรูปรถยนต์ และลงนามออนไลน์สำหรับบริการรับ-ส่งมอบรถยนต์นอกสถานที่ AUTO1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Sarabun:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-slate-100 text-slate-900 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
