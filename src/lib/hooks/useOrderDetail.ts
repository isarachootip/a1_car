"use client";

import { useEffect, useState } from "react";
import { CustomerVehicleFields } from "@/components/handover/CustomerVehicleSection";
import { InventoryFields } from "@/components/handover/InventoryChecklist";
import { BranchWithStaffDTO } from "@/lib/repositories/branchRepository";
import {
  DamageMarkRecord,
  FuelLevel,
  HandoverOrderDTO,
  HandoverPhase,
  PhotoCategory,
} from "@/lib/types/handover";

const INITIAL_CV_FIELDS: CustomerVehicleFields = {
  customerName: "",
  customerPhone: "",
  vehicleBrandModel: "",
  licensePlate: "",
  vehicleColor: "",
  pickupMileage: 0,
  pickupFuelLevel: "1/2",
  serviceStandard: false,
  serviceOilFluid: false,
  serviceTireAlignment: false,
  serviceBrakeSuspension: false,
  serviceAdditionalNote: "",
};

const INITIAL_INV_FIELDS: InventoryFields = {
  invRegistrationBook: true,
  invSpareKeyRemote: false,
  invSpareTireJack: true,
  invDashcamTollCard: true,
  invOtherValuables: "",
};

export function useOrderDetail(id: string) {
  const [order, setOrder] = useState<HandoverOrderDTO | null>(null);
  const [branches, setBranches] = useState<BranchWithStaffDTO[]>([]);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string>("");
  const [branchId, setBranchId] = useState("");
  const [staffId, setStaffId] = useState("");
  const [cvFields, setCvFields] = useState<CustomerVehicleFields>(INITIAL_CV_FIELDS);
  const [invFields, setInvFields] = useState<InventoryFields>(INITIAL_INV_FIELDS);
  const [damageMarks, setDamageMarks] = useState<DamageMarkRecord[]>([]);
  const [deliveryMileage, setDeliveryMileage] = useState<number>(0);
  const [deliveryFuel, setDeliveryFuel] = useState<FuelLevel>("1/2");

  const syncStateFromOrder = (o: HandoverOrderDTO) => {
    setOrder(o);
    setBranchId(o.branchId);
    setStaffId(o.staffId);
    setCvFields({
      customerName: o.customerName,
      customerPhone: o.customerPhone,
      vehicleBrandModel: o.vehicleBrandModel,
      licensePlate: o.licensePlate,
      vehicleColor: o.vehicleColor,
      pickupMileage: o.pickupMileage,
      pickupFuelLevel: o.pickupFuelLevel,
      serviceStandard: o.serviceStandard,
      serviceOilFluid: o.serviceOilFluid,
      serviceTireAlignment: o.serviceTireAlignment,
      serviceBrakeSuspension: o.serviceBrakeSuspension,
      serviceAdditionalNote: o.serviceAdditionalNote,
    });
    setInvFields({
      invRegistrationBook: o.invRegistrationBook,
      invSpareKeyRemote: o.invSpareKeyRemote,
      invSpareTireJack: o.invSpareTireJack,
      invDashcamTollCard: o.invDashcamTollCard,
      invOtherValuables: o.invOtherValuables,
    });
    setDamageMarks(o.damageMarks);
    setDeliveryMileage(o.deliveryMileage ?? o.pickupMileage);
    setDeliveryFuel(o.deliveryFuelLevel ?? o.pickupFuelLevel);
  };

  useEffect(() => {
    Promise.all([fetch(`/api/orders/${id}`), fetch("/api/branches")]).then(
      async ([oRes, bRes]) => {
        const oJson = (await oRes.json()) as { order?: HandoverOrderDTO };
        const bJson = (await bRes.json()) as { branches?: BranchWithStaffDTO[] };
        if (oJson.order) syncStateFromOrder(oJson.order);
        if (bJson.branches) setBranches(bJson.branches);
      }
    );
  }, [id]);

  const showNotice = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  };

  const handleSavePickup = async () => {
    if (!order) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "PICKUP",
          data: {
            branchId,
            staffId,
            ...cvFields,
            ...invFields,
            damageMarks: damageMarks.filter((m) => m.phase === "PICKUP"),
          },
        }),
      });
      const json = (await res.json()) as { order?: HandoverOrderDTO; error?: string };
      if (!res.ok || !json.order) throw new Error(json.error ?? "บันทึกไม่สำเร็จ");
      syncStateFromOrder(json.order);
      showNotice("✅ บันทึกข้อมูลขารับรถและจุดรอยตัวถังเรียบร้อยแล้ว");
    } catch (e) {
      showNotice(`❌ ${e instanceof Error ? e.message : "เกิดข้อผิดพลาด"}`);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDelivery = async () => {
    if (!order) return;
    const res = await fetch(`/api/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "DELIVERY",
        data: {
          deliveryMileage,
          deliveryFuelLevel: deliveryFuel,
          damageMarks: damageMarks.filter((m) => m.phase === "DELIVERY"),
        },
      }),
    });
    const json = (await res.json()) as { order?: HandoverOrderDTO; error?: string };
    if (!res.ok || !json.order) return showNotice(`❌ ${json.error ?? "บันทึกไม่สำเร็จ"}`);
    syncStateFromOrder(json.order);
    showNotice("✅ บันทึกเลขไมล์และน้ำมันขาส่งคืนเรียบร้อยแล้ว");
  };

  const handleUploadPhoto = async (payload: {
    phase: HandoverPhase;
    category: PhotoCategory;
    dataUrl: string;
    caption: string;
  }) => {
    if (!order) return;
    const res = await fetch(`/api/orders/${order.id}/photos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = (await res.json()) as { order?: HandoverOrderDTO; error?: string };
    if (!res.ok || !json.order) throw new Error(json.error ?? "อัปโหลดรูปไม่สำเร็จ");
    syncStateFromOrder(json.order);
    showNotice("📸 บันทึกรูปถ่ายพร้อมฝังลายน้ำสำเร็จ");
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (!order) return;
    const res = await fetch(`/api/orders/${order.id}/photos?photoId=${photoId}`, { method: "DELETE" });
    const json = (await res.json()) as { order?: HandoverOrderDTO };
    if (json.order) syncStateFromOrder(json.order);
  };

  const handleSign = async (
    pickupEditable: boolean,
    payload: { phase: HandoverPhase; role: "CUSTOMER" | "STAFF"; signerName: string; signatureDataUrl: string }
  ) => {
    if (!order) return;
    if (pickupEditable) await handleSavePickup();
    const res = await fetch(`/api/orders/${order.id}/sign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = (await res.json()) as { order?: HandoverOrderDTO; error?: string };
    if (!res.ok || !json.order) throw new Error(json.error ?? "ลงนามไม่สำเร็จ");
    syncStateFromOrder(json.order);
    showNotice("✍️ บันทึกลายมือชื่อเรียบร้อยแล้ว");
  };

  return {
    order, branches, saving, toast, branchId, setBranchId, staffId, setStaffId,
    cvFields, setCvFields, invFields, setInvFields, damageMarks, setDamageMarks,
    deliveryMileage, setDeliveryMileage, deliveryFuel, setDeliveryFuel,
    handleSavePickup, handleSaveDelivery, handleUploadPhoto, handleDeletePhoto, handleSign,
  };
}
