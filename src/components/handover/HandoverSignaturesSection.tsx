"use client";

import React, { useState } from "react";
import { QrCode, Lock } from "lucide-react";
import {
  canEditDeliverySection,
  canEditPickupSection,
} from "@/lib/domain/handoverRules";
import {
  FuelLevel,
  HandoverOrderDTO,
  HandoverPhase,
} from "@/lib/types/handover";
import { DeliveryStepCard } from "./DeliveryStepCard";
import { SignatureBox } from "./SignatureBox";
import { SignaturePadModal } from "./SignaturePadModal";

interface HandoverSignaturesSectionProps {
  order: HandoverOrderDTO;
  deliveryMileage: number;
  deliveryFuelLevel: FuelLevel;
  onDeliveryFieldChange: (mileage: number, fuel: FuelLevel) => void;
  onSaveDeliveryInfo: () => Promise<void>;
  onSign: (payload: {
    phase: HandoverPhase;
    role: "CUSTOMER" | "STAFF";
    signerName: string;
    signatureDataUrl: string;
  }) => Promise<void>;
  onOpenQrModal: () => void;
}

export function HandoverSignaturesSection({
  order,
  deliveryMileage,
  deliveryFuelLevel,
  onDeliveryFieldChange,
  onSaveDeliveryInfo,
  onSign,
  onOpenQrModal,
}: HandoverSignaturesSectionProps) {
  const [activeSignTarget, setActiveSignTarget] = useState<{
    phase: HandoverPhase;
    role: "CUSTOMER" | "STAFF";
    title: string;
    defaultName: string;
  } | null>(null);

  const pickupEditable = canEditPickupSection(order.status);
  const deliveryEditable = canEditDeliverySection(order.status);

  return (
    <section className="bg-white border border-slate-300 rounded-xl p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-l-4 border-slate-900 pl-3 py-1 bg-slate-100 rounded-r mb-4 pr-3">
        <h2 className="text-base font-bold text-slate-900">
          5. การลงนามยืนยันและรับมอบรถ (CONFIRMATION & HANDOVER SIGNATURES)
        </h2>
        {order.status !== "COMPLETED" && (
          <button
            type="button"
            onClick={onOpenQrModal}
            className="bg-amber-400 hover:bg-amber-500 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 shadow-sm"
          >
            <QrCode className="w-4 h-4" />
            ส่งลิงก์ / QR ให้ลูกค้าเซ็นออนไลน์
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Step 1: Pick-up */}
        <div className="border border-slate-300 rounded-xl p-4 bg-slate-50/50 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
              <h3 className="font-bold text-slate-900 text-sm">
                ขั้นตอนที่ 1: การรับรถจากลูกค้า (Pick-up)
              </h3>
              {!pickupEditable && (
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-flex items-center gap-1">
                  <Lock className="w-3 h-3" /> ล็อกแล้ว
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mb-4">
              เมื่อลูกค้าลงนามส่งมอบรถแล้ว ข้อมูลส่วนที่ 1–3 และรูปขารับจะถูกล็อกทันที
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <SignatureBox
              label="ลงชื่อ (ลูกค้าผู้ส่งมอบ)"
              sigUrl={order.pickupCustomerSig}
              signerName={order.pickupCustomerSignerName}
              signedAt={order.pickupCustomerSignedAt}
              canSign={pickupEditable}
              onClickSign={() =>
                setActiveSignTarget({
                  phase: "PICKUP",
                  role: "CUSTOMER",
                  title: "ลงชื่อลูกค้าผู้ส่งมอบรถ (Pick-up)",
                  defaultName: order.customerName,
                })
              }
            />
            <SignatureBox
              label="ลงชื่อ (พนักงานผู้รับรถ)"
              sigUrl={order.pickupStaffSig}
              signerName={order.pickupStaffSignerName}
              signedAt={order.pickupStaffSignedAt}
              canSign={pickupEditable}
              onClickSign={() =>
                setActiveSignTarget({
                  phase: "PICKUP",
                  role: "STAFF",
                  title: "ลงชื่อพนักงานผู้รับรถ (Pick-up)",
                  defaultName: order.staff.name,
                })
              }
            />
          </div>
        </div>

        {/* Step 2: Delivery */}
        <DeliveryStepCard
          order={order}
          deliveryEditable={deliveryEditable}
          deliveryMileage={deliveryMileage}
          deliveryFuelLevel={deliveryFuelLevel}
          onDeliveryFieldChange={onDeliveryFieldChange}
          onSaveDeliveryInfo={onSaveDeliveryInfo}
          onSignCustomer={() =>
            setActiveSignTarget({
              phase: "DELIVERY",
              role: "CUSTOMER",
              title: "ลงชื่อลูกค้าผู้รับมอบรถคืน (Delivery)",
              defaultName: order.customerName,
            })
          }
          onSignStaff={() =>
            setActiveSignTarget({
              phase: "DELIVERY",
              role: "STAFF",
              title: "ลงชื่อพนักงานผู้ส่งมอบรถคืน (Delivery)",
              defaultName: order.staff.name,
            })
          }
        />
      </div>

      <SignaturePadModal
        open={activeSignTarget !== null}
        title={activeSignTarget?.title ?? ""}
        defaultSignerName={activeSignTarget?.defaultName ?? ""}
        onClose={() => setActiveSignTarget(null)}
        onConfirm={async (signerName, signatureDataUrl) => {
          if (!activeSignTarget) return;
          await onSign({
            phase: activeSignTarget.phase,
            role: activeSignTarget.role,
            signerName,
            signatureDataUrl,
          });
        }}
      />
    </section>
  );
}
