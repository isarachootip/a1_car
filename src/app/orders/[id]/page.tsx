"use client";

import React, { use, useEffect, useState } from "react";
import { Save } from "lucide-react";
import { BodyDiagramEditor } from "@/components/handover/BodyDiagramEditor";
import { CustomerVehicleSection } from "@/components/handover/CustomerVehicleSection";
import { FieldLocationBanner } from "@/components/handover/FieldLocationBanner";
import { HandoverSignaturesSection } from "@/components/handover/HandoverSignaturesSection";
import { HeaderSelector } from "@/components/handover/HeaderSelector";
import { InventoryChecklist } from "@/components/handover/InventoryChecklist";
import { MobileStepTopTabs, MobileStickyBottomBar, MobileWizardStep } from "@/components/handover/MobileStepWizardBar";
import { LayoutMode, OrderDetailToolbar } from "@/components/handover/OrderDetailToolbar";
import { PhotoCaptureGrid } from "@/components/handover/PhotoCaptureGrid";
import { QrShareModal } from "@/components/handover/QrShareModal";
import { TermsSection } from "@/components/handover/TermsSection";
import { Auto1PdfDocument } from "@/components/pdf/Auto1PdfDocument";
import { Auto1PdfPhotoPage } from "@/components/pdf/Auto1PdfPhotoPage";
import { ResponsivePdfWrapper } from "@/components/pdf/ResponsivePdfWrapper";
import { canEditPickupSection } from "@/lib/domain/handoverRules";
import { useOrderDetail } from "@/lib/hooks/useOrderDetail";

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("FULL");
  const [wizardStep, setWizardStep] = useState<MobileWizardStep>(1);
  const [qrOpen, setQrOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setLayoutMode("WIZARD");
    }
  }, []);

  const {
    order, branches, saving, toast, branchId, setBranchId, staffId, setStaffId,
    locFields, setLocFields, cvFields, setCvFields, invFields, setInvFields,
    damageMarks, setDamageMarks, deliveryMileage, setDeliveryMileage, deliveryFuel, setDeliveryFuel,
    handleSavePickup, handleSaveDelivery, handleUploadPhoto, handleDeletePhoto, handleSign,
  } = useOrderDetail(id);

  if (!order) {
    return <div className="p-12 text-center text-sm text-slate-600">กำลังโหลดข้อมูลใบรับ-ส่งมอบรถยนต์...</div>;
  }

  const pickupEditable = canEditPickupSection(order.status);
  const isWizard = layoutMode === "WIZARD";

  return (
    <main className={`max-w-5xl mx-auto px-3 sm:px-4 py-4 ${isWizard ? "pb-24" : "pb-8"}`}>
      <OrderDetailToolbar
        docNumber={order.docNumber}
        layoutMode={layoutMode}
        onChangeLayoutMode={setLayoutMode}
        onOpenQr={() => setQrOpen(true)}
        onPrintPdf={() => {
          setLayoutMode("PDF");
          setTimeout(() => window.print(), 200);
        }}
      />

      {toast && (
        <div className="no-print mb-4 bg-slate-900 text-amber-300 border border-amber-400/40 px-4 py-2.5 rounded-xl text-xs font-bold shadow">
          {toast}
        </div>
      )}

      {layoutMode === "PDF" ? (
        <ResponsivePdfWrapper>
          <Auto1PdfDocument order={order} />
          <Auto1PdfPhotoPage order={order} />
        </ResponsivePdfWrapper>
      ) : (
        <div className="space-y-4 sm:space-y-5">
          {isWizard && (
            <MobileStepTopTabs
              activeStep={wizardStep}
              photoCount={order.photos.length}
              damageCount={damageMarks.length}
              onSelectStep={setWizardStep}
            />
          )}

          {(!isWizard || wizardStep === 1) && (
            <>
              <HeaderSelector
                docNumber={order.docNumber}
                createdAt={order.createdAt}
                status={order.status}
                branchId={branchId}
                staffId={staffId}
                branches={branches}
                disabled={!pickupEditable}
                onBranchChange={(bId, sId) => { setBranchId(bId); setStaffId(sId); }}
                onStaffChange={setStaffId}
              />
              <FieldLocationBanner
                branchCode={branches.find((b) => b.id === branchId)?.code ?? order.branch.code}
                customerName={cvFields.customerName}
                customerPhone={cvFields.customerPhone}
                values={locFields}
                disabled={!pickupEditable}
                onChange={(k, v) => setLocFields((prev) => ({ ...prev, [k]: v }))}
              />
              <CustomerVehicleSection
                values={cvFields}
                disabled={!pickupEditable}
                onChange={(k, v) => setCvFields((prev) => ({ ...prev, [k]: v }))}
              />
            </>
          )}

          {(!isWizard || wizardStep === 2) && (
            <section className="bg-white border border-slate-300 rounded-xl p-4 sm:p-5 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 border-l-4 border-slate-900 pl-3 py-1 bg-slate-100 rounded-r mb-4">
                3. ตรวจสอบสภาพตัวถังและทรัพย์สินภายในรถ (BODY CONDITION & INVENTORY CHECK)
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <BodyDiagramEditor
                  marks={damageMarks}
                  activePhase={pickupEditable ? "PICKUP" : "DELIVERY"}
                  disabled={order.status === "COMPLETED"}
                  onAddMark={(m) => setDamageMarks((prev) => [...prev, m])}
                  onRemoveMark={(idx) => setDamageMarks((prev) => prev.filter((_, i) => i !== idx))}
                />
                <InventoryChecklist
                  values={invFields}
                  disabled={!pickupEditable}
                  onChange={(k, v) => setInvFields((prev) => ({ ...prev, [k]: v }))}
                />
              </div>

              {pickupEditable && !isWizard && (
                <div className="mt-4 flex justify-end">
                  <button type="button" disabled={saving} onClick={handleSavePickup} className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl inline-flex items-center gap-2 shadow">
                    <Save className="w-4 h-4" />
                    {saving ? "กำลังบันทึก..." : "บันทึกการแก้ไขข้อมูลขารับรถและรอยตัวถัง"}
                  </button>
                </div>
              )}
            </section>
          )}

          {(!isWizard || wizardStep === 3) && (
            <PhotoCaptureGrid
              docNumber={order.docNumber}
              phase={pickupEditable ? "PICKUP" : "DELIVERY"}
              photos={order.photos}
              disabled={order.status === "COMPLETED"}
              onUploadPhoto={handleUploadPhoto}
              onDeletePhoto={handleDeletePhoto}
            />
          )}

          {(!isWizard || wizardStep === 4) && (
            <>
              <TermsSection />
              <HandoverSignaturesSection
                order={order}
                deliveryMileage={deliveryMileage}
                deliveryFuelLevel={deliveryFuel}
                onDeliveryFieldChange={(m, f) => { setDeliveryMileage(m); setDeliveryFuel(f); }}
                onSaveDeliveryInfo={handleSaveDelivery}
                onSign={(payload) => handleSign(pickupEditable, payload)}
                onOpenQrModal={() => setQrOpen(true)}
              />
            </>
          )}
        </div>
      )}

      {isWizard && (
        <MobileStickyBottomBar
          activeStep={wizardStep}
          canSavePickup={pickupEditable}
          saving={saving}
          onSelectStep={setWizardStep}
          onSavePickup={handleSavePickup}
        />
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
