"use client";

import React, { use, useEffect, useState } from "react";
import { PenTool, Printer, Lock } from "lucide-react";
import {
  PhoneVerificationCard,
  PublicOrderSummary,
} from "@/components/handover/PhoneVerificationCard";
import { SignaturePadModal } from "@/components/handover/SignaturePadModal";
import { Auto1PdfDocument } from "@/components/pdf/Auto1PdfDocument";
import { Auto1PdfPhotoPage } from "@/components/pdf/Auto1PdfPhotoPage";
import { HandoverOrderDTO } from "@/lib/types/handover";

export default function CustomerRemoteSignPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const [summary, setSummary] = useState<PublicOrderSummary | null>(null);
  const [order, setOrder] = useState<HandoverOrderDTO | null>(null);
  const [phoneLast4, setPhoneLast4] = useState("");
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [signModalOpen, setSignModalOpen] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    fetch(`/api/public/${token}`)
      .then(async (res) => {
        const json = (await res.json()) as {
          summary?: PublicOrderSummary;
          error?: string;
        };
        if (!res.ok || !json.summary) {
          setError(json.error ?? "ไม่พบลิงก์เอกสารนี้");
          return;
        }
        setSummary(json.summary);
      })
      .catch(() => setError("ไม่สามารถเชื่อมต่อระบบได้"));
  }, [token]);

  const handleVerifyPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifying(true);
    setError("");
    try {
      const res = await fetch(`/api/public/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "VERIFY_PHONE",
          phoneLast4: phoneLast4.trim(),
        }),
      });
      const json = (await res.json()) as {
        order?: HandoverOrderDTO;
        error?: string;
      };
      if (!res.ok || !json.order) {
        throw new Error(json.error ?? "รหัสยืนยันไม่ถูกต้อง");
      }
      setOrder(json.order);
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setVerifying(false);
    }
  };

  if (!summary && error) {
    return (
      <main className="max-w-md mx-auto mt-16 p-6 bg-white rounded-2xl border border-slate-200 text-center">
        <p className="font-bold text-red-600">{error}</p>
      </main>
    );
  }

  if (!summary) {
    return (
      <main className="max-w-md mx-auto mt-16 p-6 text-center text-sm text-slate-600">
        กำลังโหลดข้อมูลเอกสาร AUTO1...
      </main>
    );
  }

  if (!order) {
    return (
      <PhoneVerificationCard
        summary={summary}
        phoneLast4={phoneLast4}
        verifying={verifying}
        error={error}
        onPhoneChange={setPhoneLast4}
        onSubmit={handleVerifyPhone}
      />
    );
  }

  const canCustomerSignPickup = order.status === "DRAFT_PICKUP";
  const canCustomerSignDelivery = order.status === "PICKED_UP_LOCKED";
  const targetPhase = canCustomerSignPickup ? "PICKUP" : "DELIVERY";

  return (
    <main className="max-w-5xl mx-auto px-4 py-5">
      <div className="no-print bg-slate-900 text-white rounded-2xl p-4 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow">
        <div>
          <p className="text-xs text-amber-300 font-bold">
            เอกสารเลขที่ {order.docNumber} — ยืนยันตัวตนสำเร็จ
          </p>
          <h1 className="text-base font-extrabold">
            กรุณาตรวจสอบข้อมูล สภาพตัวถัง และรูปถ่ายรถยนต์ด้านล่าง
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {canCustomerSignPickup || canCustomerSignDelivery ? (
            <button
              type="button"
              onClick={() => setSignModalOpen(true)}
              className="bg-amber-400 hover:bg-amber-500 text-slate-900 text-xs font-extrabold px-4 py-2.5 rounded-xl inline-flex items-center gap-1.5 shadow"
            >
              <PenTool className="w-4 h-4" />
              {canCustomerSignPickup
                ? "กดเพื่อเซ็นชื่อส่งมอบรถ (ขั้นตอนที่ 1: Pick-up)"
                : "กดเพื่อเซ็นชื่อรับมอบรถคืน (ขั้นตอนที่ 2: Delivery)"}
            </button>
          ) : (
            <span className="bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-xl inline-flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> เอกสารลงนามครบสมบูรณ์แล้ว
            </span>
          )}

          <button
            type="button"
            onClick={() => window.print()}
            className="bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl inline-flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" /> พิมพ์ / บันทึก PDF
          </button>
        </div>
      </div>

      {notice && (
        <div className="no-print mb-4 bg-emerald-900 text-emerald-100 px-4 py-3 rounded-xl text-xs font-bold">
          {notice}
        </div>
      )}

      <Auto1PdfDocument order={order} />
      <Auto1PdfPhotoPage order={order} />

      <SignaturePadModal
        open={signModalOpen}
        title={
          canCustomerSignPickup
            ? "ลงชื่อลูกค้าผู้ส่งมอบรถ (Pick-up)"
            : "ลงชื่อลูกค้าผู้รับมอบรถคืน (Delivery)"
        }
        defaultSignerName={order.customerName}
        onClose={() => setSignModalOpen(false)}
        onConfirm={async (signerName, signatureDataUrl) => {
          const res = await fetch(`/api/public/${token}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "SIGN_CUSTOMER",
              phoneLast4,
              signData: {
                phase: targetPhase,
                role: "CUSTOMER",
                signerName,
                signatureDataUrl,
              },
            }),
          });
          const json = (await res.json()) as {
            order?: HandoverOrderDTO;
            error?: string;
          };
          if (!res.ok || !json.order) {
            throw new Error(json.error ?? "ไม่สามารถลงนามได้");
          }
          setOrder(json.order);
          setNotice(
            "✅ ลงนามออนไลน์สำเร็จ! ระบบได้บันทึกและล็อกข้อมูลเอกสารเรียบร้อยแล้ว คุณสามารถกดพิมพ์หรือบันทึกเป็น PDF ได้ทันที"
          );
        }}
      />
    </main>
  );
}
