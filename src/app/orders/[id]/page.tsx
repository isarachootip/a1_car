"use client";

import React, { use, useState } from "react";
import { Save } from "lucide-react";
import { BodyDiagramEditor } from "@/components/handover/BodyDiagramEditor";
import { CustomerVehicleSection } from "@/components/handover/CustomerVehicleSection";
import { HandoverSignaturesSection } from "@/components/handover/HandoverSignaturesSection";
import { HeaderSelector } from "@/components/handover/HeaderSelector";
import { InventoryChecklist } from "@/components/handover/InventoryChecklist";
import { OrderDetailToolbar } from "@/components/handover/OrderDetailToolbar";
import { PhotoCaptureGrid } from "@/components/handover/PhotoCaptureGrid";
import { QrShareModal } from "@/components/handover/QrShareModal";
import { TermsSection } from "@/components/handover/TermsSection";
import { Auto1PdfDocument } from "@/components/pdf/Auto1PdfDocument";
import { Auto1PdfPhotoPage } from "@/components/pdf/Auto1PdfPhotoPage";
import { canEditPickupSection } from "@/lib/domain/handoverRules";
import { useOrderDetail } from "@/lib/hooks/useOrderDetail";

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [viewMode, setViewMode] = useState<"FORM" | "PDF">("FORM");
  const [qrOpen, setQrOpen] = useState(false);

  const {
    order,
    branches,
    saving,
    toast,
    branchId,
    setBranchId,
    staffId,
    setStaffId,
    cvFields,
    setCvFields,
    invFields,
    setInvFields,
    damageMarks,
    setDamageMarks,
    deliveryMileage,
    setDeliveryMileage,
    deliveryFuel,
    setDeliveryFuel,
    handleSavePickup,
    handleSaveDelivery,
    handleUploadPhoto,
    handleDeletePhoto,
    handleSign,
  } = useOrderDetail(id);

  if (!order) {
    return (
      <div className="p-12 text-center text-sm text-slate-600">
        กำลังโหลดข้อมูลใบรับ-ส่งมอบรถยนต์...
      </div>
    );
  }

  const pickupEditable = canEditPickupSection(order.status);

  return (
    <main className="max-w-5xl mx-auto px-4 py-5">
      <OrderDetailToolbar
        docNumber={order.docNumber}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        onOpenQr={() => setQrOpen(true)}
        onPrintPdf={() => {
          setViewMode("PDF");
          setTimeout(() => window.print(), 150);
        }}
      />

      {toast && (
        <div className="no-print mb-4 bg-slate-900 text-amber-300 border border-amber-400/40 px-4 py-2.5 rounded-xl text-xs font-bold shadow">
          {toast}
        </div>
      )}

      {viewMode === "PDF" ? (
        <div>
          <Auto1PdfDocument order={order} />
          <Auto1PdfPhotoPage order={order} />
        </div>
      ) : (
        <div className="space-y-5">
          <HeaderSelector
            docNumber={order.docNumber}
            createdAt={order.createdAt}
            status={order.status}
            branchId={branchId}
            staffId={staffId}
            branches={branches}
            disabled={!pickupEditable}
            onBranchChange={(bId, sId) => {
              setBranchId(bId);
              setStaffId(sId);
            }}
            onStaffChange={setStaffId}
          />

          <CustomerVehicleSection
            values={cvFields}
            disabled={!pickupEditable}
            onChange={(k, v) => setCvFields((prev) => ({ ...prev, [k]: v }))}
          />

          <section className="bg-white border border-slate-300 rounded-xl p-5 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 border-l-4 border-slate-900 pl-3 py-1 bg-slate-100 rounded-r mb-4">
              3. ตรวจสอบสภาพตัวถังและทรัพย์สินภายในรถ (BODY CONDITION & INVENTORY CHECK)
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <BodyDiagramEditor
                marks={damageMarks}
                activePhase={pickupEditable ? "PICKUP" : "DELIVERY"}
                disabled={order.status === "COMPLETED"}
                onAddMark={(m) => setDamageMarks((prev) => [...prev, m])}
                onRemoveMark={(idx) =>
                  setDamageMarks((prev) => prev.filter((_, i) => i !== idx))
                }
              />
              <InventoryChecklist
                values={invFields}
                disabled={!pickupEditable}
                onChange={(k, v) =>
                  setInvFields((prev) => ({ ...prev, [k]: v }))
                }
              />
            </div>

            {pickupEditable && (
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  disabled={saving}
                  onClick={handleSavePickup}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl inline-flex items-center gap-2 shadow"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "กำลังบันทึก..." : "บันทึกการแก้ไขข้อมูลขารับรถและรอยตัวถัง"}
                </button>
              </div>
            )}
          </section>

          <PhotoCaptureGrid
            docNumber={order.docNumber}
            phase={pickupEditable ? "PICKUP" : "DELIVERY"}
            photos={order.photos}
            disabled={order.status === "COMPLETED"}
            onUploadPhoto={handleUploadPhoto}
            onDeletePhoto={handleDeletePhoto}
          />

          <TermsSection />

          <HandoverSignaturesSection
            order={order}
            deliveryMileage={deliveryMileage}
            deliveryFuelLevel={deliveryFuel}
            onDeliveryFieldChange={(m, f) => {
              setDeliveryMileage(m);
              setDeliveryFuel(f);
            }}
            onSaveDeliveryInfo={handleSaveDelivery}
            onSign={(payload) => handleSign(pickupEditable, payload)}
            onOpenQrModal={() => setQrOpen(true)}
          />
        </div>
      )}

      <QrShareModal
        open={qrOpen}
        docNumber={order.docNumber}
        publicToken={order.publicToken}
        customerPhone={order.customerPhone}
        onClose={() => setQrOpen(false)}
      />
    </main>
  );
}
