"use client";

import React from "react";
import {
  QrCode,
  Share2,
  ShieldCheck,
  Printer,
  CheckCircle2,
  Smartphone,
} from "lucide-react";

export function GuideSectionsPart2() {
  return (
    <div className="space-y-6">
      {/* Section 3: Remote Customer Signing via QR / LINE */}
      <section className="bg-white border border-slate-300 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2.5 border-b border-slate-200 pb-3 mb-4">
          <span className="bg-amber-400 text-slate-900 font-black px-3 py-1 rounded-lg text-sm">
            บทที่ 3
          </span>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
            การส่งลิงก์ / QR Code ให้ลูกค้าเซ็นออนไลน์ (ยืนยันเลขท้ายเบอร์โทร 4 หลัก)
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-center">
          <div className="bg-slate-900 text-white rounded-xl p-4 text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-700 pb-2">
              <span className="font-bold text-amber-400">
                📲 ภาพจำลอง: หน้าจอส่งลิงก์และหน้าจอมือถือลูกค้า
              </span>
              <QrCode className="w-4 h-4 text-amber-400" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-slate-800 rounded-lg p-3 border border-slate-700 space-y-2">
                <p className="font-bold text-amber-300">ฝั่งพนักงาน:</p>
                <div className="bg-amber-500/20 border border-amber-400/40 rounded p-2 text-amber-200 text-[11px]">
                  🔐 รหัสยืนยัน 4 ตัวท้ายเบอร์โทร: <b>5678</b>
                </div>
                <div className="bg-emerald-600 text-white font-bold py-2 px-2.5 rounded-lg text-center flex items-center justify-center gap-1">
                  <Share2 className="w-3.5 h-3.5" /> แชร์ลิงก์ผ่าน LINE ทันที
                </div>
              </div>

              <div className="bg-white text-slate-900 rounded-lg p-3 border border-slate-300 space-y-2">
                <p className="font-bold text-slate-900">ฝั่งมือถือลูกค้า:</p>
                <p className="text-[11px] text-slate-600">
                  กรอกเลขท้ายเบอร์โทร 4 หลักเพื่อเปิดดูเอกสาร:
                </p>
                <div className="border border-slate-300 rounded py-1 text-center font-mono font-bold text-base tracking-widest">
                  5 6 7 8
                </div>
                <div className="bg-slate-900 text-white font-bold py-1.5 rounded text-center flex items-center justify-center gap-1 text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> ยืนยันตัวตนและดูเอกสาร
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 text-sm text-slate-700">
            <p>
              <b>1. กดปุ่ม &ldquo;แชร์/QR&rdquo; หรือ &ldquo;ส่งลิงก์ / QR ให้ลูกค้าเซ็นออนไลน์&rdquo;:</b>{" "}
              ระบบจะสร้างลิงก์เฉพาะของใบงานนั้น พร้อมแสดง QR Code และรหัสยืนยันตัวตน (เลขท้ายเบอร์โทรศัพท์ 4 หลักของลูกค้า)
            </p>
            <p>
              <b>2. กดปุ่มสีเขียว &ldquo;แชร์ลิงก์ผ่าน LINE / แอปในมือถือทันที&rdquo;:</b>{" "}
              บนสมาร์ทโฟนจะเด้งหน้าต่างเลือกแชร์เข้าห้องแชต LINE ของลูกค้าพร้อมข้อความแจ้งรหัส 4 หลักโดยอัตโนมัติ
            </p>
            <p>
              <b>3. ลูกค้าตรวจสอบและเซ็นออนไลน์:</b>{" "}
              เมื่อลูกค้าเปิดลิงก์และกรอกเลขท้ายเบอร์โทร 4 หลักถูกต้อง จะเห็นแบบฟอร์มใบรับ-ส่งมอบรถยนต์ AUTO1 พร้อมผังรอยแผลและรูปถ่ายรถครบทุกมุม จากนั้นกดปุ่ม <b>กดเซ็นชื่อส่งมอบรถ</b> และบันทึกไฟล์ PDF เก็บไว้ได้ทันที
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: Delivery & PDF Print + PWA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white border border-slate-300 rounded-2xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-center gap-2.5 border-b border-slate-200 pb-3 mb-4">
            <span className="bg-amber-400 text-slate-900 font-black px-3 py-1 rounded-lg text-sm">
              บทที่ 4
            </span>
            <h2 className="text-base font-extrabold text-slate-900">
              ขั้นตอนส่งมอบรถคืนลูกค้า (Delivery) & ออกเอกสาร PDF
            </h2>
          </div>

          <div className="space-y-2.5 text-sm text-slate-700">
            <p className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-1" />
              <span>
                เมื่อซ่อม/บริการเสร็จสิ้นและนำรถไปส่งคืนลูกค้า ให้เปิดใบงานเดิม (สถานะ <b>รับรถแล้ว / รอส่งคืน</b>)
              </span>
            </p>
            <p className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-1" />
              <span>
                ไปที่ <b>ขั้นตอนที่ 2: การส่งมอบรถคืนลูกค้า (Delivery)</b> กรอก <b>ไมล์หลังส่งคืน (กม.)</b> และเลือก <b>ระดับน้ำมันหลังส่งคืน</b> แล้วกดปุ่มสีน้ำเงิน <b>บันทึกเลขไมล์และระดับน้ำมันขาส่งคืน</b> (สามารถถ่ายรูปขาส่งคืนเพิ่มเติมได้ในหมวดรูปถ่าย)
              </span>
            </p>
            <p className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-1" />
              <span>
                ให้พนักงานผู้ส่งมอบและลูกค้ารับมอบคืนลงลายมือชื่อ (หรือส่งลิงก์เดิมให้ลูกค้ากดเซ็นรับรถคืนออนไลน์) เมื่อลูกค้าเซ็นแล้ว สถานะจะเปลี่ยนเป็น <b>ส่งมอบรถคืนสำเร็จ (ล็อกเอกสาร 100%)</b>
              </span>
            </p>
            <p className="flex items-start gap-2">
              <Printer className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
              <span>
                กดปุ่ม <b>พิมพ์ PDF</b> บนแถบด้านบนเพื่อสั่งพิมพ์หรือเลือก <b>Save as PDF (บันทึกเป็น PDF)</b> โดย <b>หน้าที่ 1</b> จะเป็นฟอร์มใบรับ-ส่งมอบรถ AUTO1 ต้นฉบับ และ <b>หน้าที่ 2</b> จะเป็นตารางประมวลผลรูปถ่ายรถยนต์พร้อมลายน้ำวันเวลา
              </span>
            </p>
          </div>
        </section>

        <section className="bg-white border border-slate-300 rounded-2xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-center gap-2.5 border-b border-slate-200 pb-3 mb-4">
            <span className="bg-amber-400 text-slate-900 font-black px-3 py-1 rounded-lg text-sm">
              บทที่ 5
            </span>
            <h2 className="text-base font-extrabold text-slate-900">
              วิธีติดตั้งไอคอนแอปลงบนหน้าจอมือถือ (PWA)
            </h2>
          </div>

          <div className="space-y-3 text-sm text-slate-700">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
              <p className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                <Smartphone className="w-4 h-4 text-slate-800" />
                สำหรับ iPhone / iPad (Safari):
              </p>
              <p className="text-xs text-slate-600">
                1. เปิดลิงก์ระบบผ่านเบราว์เซอร์ <b>Safari</b>
                <br />
                2. แตะปุ่ม <b>แชร์ (Share)</b> ตรงแถบด้านล่างหน้าจอ
                <br />
                3. เลื่อนลงมาเลือกเมนู <b>&ldquo;เพิ่มไปยังหน้าจอโฮม&rdquo; (Add to Home Screen)</b> แล้วกด <b>เพิ่ม (Add)</b>
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
              <p className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                <Smartphone className="w-4 h-4 text-slate-800" />
                สำหรับ Android (Google Chrome):
              </p>
              <p className="text-xs text-slate-600">
                1. เปิดลิงก์ระบบผ่านเบราว์เซอร์ <b>Chrome</b>
                <br />
                2. แตะปุ่มเมนู <b>จุดสามจุด (⋮)</b> มุมขวาบนของจอ
                <br />
                3. เลือกเมนู <b>&ldquo;ติดตั้งแอป&rdquo; (Install App)</b> หรือ <b>&ldquo;เพิ่มลงในหน้าจอหลัก&rdquo;</b>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
