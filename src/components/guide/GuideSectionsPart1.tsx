"use client";

import React from "react";
import {
  PlusCircle,
  MapPin,
  Search,
  LocateFixed,
  Smartphone,
  PhoneCall,
  Navigation,
  ZoomIn,
  Lock,
  Camera,
} from "lucide-react";

export function GuideSectionsPart1() {
  return (
    <div className="space-y-6">
      <section className="bg-white border border-slate-300 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2.5 border-b border-slate-200 pb-3 mb-4">
          <span className="bg-amber-400 text-slate-900 font-black px-3 py-1 rounded-lg text-sm">บทที่ 1</span>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
            การรับแจ้งเปิดใบงานที่สาขา & ค้นหาปักหมุดแผนที่รับรถ
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-6 bg-slate-900 text-white rounded-xl p-4 border border-slate-700 text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-700 pb-2">
              <span className="font-bold text-amber-400">🖥️ ภาพจำลองหน้าจอ: เปิดใบงานใหม่</span>
              <span className="bg-amber-400 text-slate-900 font-bold px-2 py-0.5 rounded text-[10px]">+ สร้างใบรับ-ส่งมอบรถใหม่</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-amber-400 text-slate-900 font-bold p-2 rounded-lg text-center">① 📍 ไปรับรถที่ Site ลูกค้า</div>
              <div className="bg-slate-800 text-slate-300 p-2 rounded-lg text-center border border-slate-700">🏢 รับรถที่สาขา</div>
            </div>

            <div className="bg-slate-800 border border-amber-400/50 rounded-lg p-3 space-y-2">
              <p className="font-bold text-amber-300">② ช่องค้นหาสถานที่จากแผนที่ (Autocomplete)</p>
              <div className="flex gap-1.5">
                <div className="flex-1 bg-white text-slate-800 px-2.5 py-1.5 rounded flex items-center gap-1">
                  <Search className="w-3.5 h-3.5 text-slate-400" />
                  <span>หมู่บ้านลัดดารมย์ พระราม 3...</span>
                </div>
                <span className="bg-amber-400 text-slate-900 font-bold px-2.5 py-1.5 rounded">ค้นหาแผนที่</span>
                <span className="bg-blue-600 text-white font-bold px-2 py-1.5 rounded inline-flex items-center gap-1">
                  <LocateFixed className="w-3 h-3" /> GPS
                </span>
              </div>
              <div className="bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 px-2.5 py-1.5 rounded text-[11px]">
                ③ ✅ ระยะทางจากสาขาโดยประมาณ: <b>6.4 กม.</b> (อยู่ในเกณฑ์ไม่เกิน 20 กม. — 400 บาท)
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg p-2.5 text-[11px] text-slate-300">
              ④ กรอกชื่อลูกค้า, เบอร์โทร, รุ่นรถ, ทะเบียนรถ (เลขไมล์ใส่ <b>0</b> ได้หากรับแจ้งล่วงหน้า) แล้วกด <b className="text-amber-400">บันทึกและเปิดใบงาน</b>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-3 text-sm text-slate-700">
            <div className="flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-amber-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
              <p>กดปุ่ม <b className="text-slate-900 inline-flex items-center gap-1"><PlusCircle className="w-3.5 h-3.5" /> สร้างใบรับ-ส่งมอบรถใหม่</b> ที่มุมขวาบนของหน้าหลัก แล้วเลือกประเภทงานระหว่าง <b>ไปรับรถที่ Site ลูกค้า</b> หรือ <b>รับรถที่สาขา</b></p>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-amber-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
              <p><b>วิธีค้นหาแผนที่จุดรับรถ:</b> พิมพ์ชื่อหมู่บ้าน/คอนโด/อาคาร/ถนน แล้วกดปุ่ม <b>ค้นหาแผนที่</b> จากนั้นคลิกเลือกสถานที่จากรายการ ระบบจะดึงชื่อสถานที่และสร้างลิงก์พิกัด Google Maps ให้อัตโนมัติ (หรือกดปุ่ม <b>พิกัด GPS ปัจจุบัน</b> หากยืนอยู่หน้างาน)</p>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-amber-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
              <p><b>ตรวจสอบระยะทาง 20 กม. อัตโนมัติ:</b> ระบบจะแสดงแผนที่พรีวิวพร้อมคำนวณระยะทางจากสาขา AUTO1 ที่เลือก หากเกิน 20 กม. จะแสดงแถบเตือนสีส้มทันที และสามารถกดปุ่ม <code>⬆️ ⬇️ ⬅️ ➡️</code> เพื่อขยับหมุดพิกัดละเอียดได้</p>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-amber-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">4</span>
              <p><b>กรณีรับแจ้งล่วงหน้าที่สาขา:</b> สามารถใส่เลขไมล์ก่อนรับรถเป็น <code>0</code> ไว้ก่อนได้ แล้วให้พนักงานที่วิ่งไปรับรถที่ Site ลูกค้าเป็นผู้กรอกเลขไมล์และระดับน้ำมันจริงหน้างาน</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border border-slate-300 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2.5 border-b border-slate-200 pb-3 mb-4">
          <span className="bg-amber-400 text-slate-900 font-black px-3 py-1 rounded-lg text-sm">บทที่ 2</span>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
            การใช้งานบนมือถือที่ Site ลูกค้า (โหมดมือถือทีละขั้น 4 Steps)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex flex-col justify-between">
            <div>
              <div className="bg-slate-900 text-amber-400 font-extrabold px-3 py-1.5 rounded-lg mb-3 inline-flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5" /> Step 1: ข้อมูล/นัดหมาย
              </div>
              <div className="space-y-2 text-slate-700">
                <p>• กดปุ่มสีเขียว <span className="bg-emerald-600 text-white px-1.5 py-0.5 rounded font-bold inline-flex items-center gap-0.5"><PhoneCall className="w-3 h-3" /> โทรหาลูกค้า</span> เพื่อโทรออกทันที</p>
                <p>• กดปุ่มสีน้ำเงิน <span className="bg-blue-600 text-white px-1.5 py-0.5 rounded font-bold inline-flex items-center gap-0.5"><Navigation className="w-3 h-3" /> นำทาง Maps</span> เพื่อเปิดแอป Google Maps</p>
                <p>• เมื่อถึงตัวรถ ให้อัปเดต <b>เลขไมล์ก่อนรับรถ</b>, <b>ระดับน้ำมัน</b> และ <b>รายการแจ้งซ่อม</b></p>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200 text-[11px] text-slate-500">กดปุ่ม <b>บันทึกข้อมูล</b> หรือ <b>ถัดไป →</b> ที่ขอบล่างจอมือถือ</div>
          </div>

          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex flex-col justify-between">
            <div>
              <div className="bg-slate-900 text-amber-400 font-extrabold px-3 py-1.5 rounded-lg mb-3 inline-flex items-center gap-1.5">
                <ZoomIn className="w-3.5 h-3.5" /> Step 2: ผังรอย/ทรัพย์สิน
              </div>
              <div className="space-y-2 text-slate-700">
                <p>• เลือกชนิดแผล: <b className="text-amber-600">R ขีดข่วน</b>, <b className="text-red-600">D บุบ</b>, <b className="text-purple-600">C แตกร้าว</b>, <b className="text-teal-700">S คราบ/สนิม</b></p>
                <p>• กดปุ่ม <b>ซูมโซนสำหรับมือถือ</b> เพื่อขยายเต็มจอให้ใช้นิ้วจิ้มปักหมุดได้แม่นยำ</p>
                <p>• มีสวิตช์ <span className="bg-slate-200 px-1.5 py-0.5 rounded font-bold inline-flex items-center gap-0.5"><Lock className="w-3 h-3" /> ล็อกกันนิ้วลั่น</span> และตรวจทรัพย์สิน 4 รายการ</p>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200 text-[11px] text-slate-500">แตะซ้ำที่จุดหมุดหรือกด <b>ลบจุดล่าสุด</b> เพื่อแก้ไขได้</div>
          </div>

          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex flex-col justify-between">
            <div>
              <div className="bg-slate-900 text-amber-400 font-extrabold px-3 py-1.5 rounded-lg mb-3 inline-flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5" /> Step 3: ถ่ายรูปรถ 5 มุม
              </div>
              <div className="space-y-2 text-slate-700">
                <p>• กดแถบสีเหลือง <b>🚀 โหมดถ่ายต่อเนื่องอัตโนมัติ</b> ด้านบนเพื่อเดินถ่ายครบ 5 มุมบังคับ (หน้า, หลัง, ซ้าย, ขวา, หน้าปัดไมล์)</p>
                <p>• แยกปุ่ม <b>📷 กล้องสด</b> กับ <b>🖼️ คลังภาพ</b></p>
                <p>• ระบบย่อขนาดภาพและ <b>ฝังลายน้ำวันเวลา + เลขเอกสาร</b> ให้อัตโนมัติ</p>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200 text-[11px] text-emerald-700 font-bold">* ต้องถ่ายครบ 5 มุมบังคับก่อนลูกค้าเซ็นชื่อรับรถ</div>
          </div>

          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex flex-col justify-between">
            <div>
              <div className="bg-slate-900 text-amber-400 font-extrabold px-3 py-1.5 rounded-lg mb-3 inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> Step 4: เซ็นชื่อ/แชร์
              </div>
              <div className="space-y-2 text-slate-700">
                <p>• พนักงานกดปุ่ม <b>กดเพื่อเซ็นชื่อ</b> ในช่อง <b>พนักงานผู้รับรถ</b> (กระดานเซ็นขยายเต็มจอมือถือ)</p>
                <p>• <b>ลูกค้าอยู่หน้างาน:</b> ยื่นมือถือให้ลูกค้ากดเซ็นในช่อง <b>ลูกค้าผู้ส่งมอบ</b> ได้เลย</p>
                <p>• <b>ลูกค้าไม่ได้อยู่หน้างาน:</b> กดปุ่ม <b>ส่งลิงก์ / QR ให้ลูกค้าเซ็นออนไลน์</b></p>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200 text-[11px] text-slate-500">เมื่อลูกค้าเซ็นแล้ว ข้อมูลขารับรถจะถูกล็อกทันที</div>
          </div>
        </div>
      </section>
    </div>
  );
}
