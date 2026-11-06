"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Camera, RefreshCw, X, Sparkles, Smartphone } from "lucide-react";
import { HandoverPhase, PHOTO_CATEGORY_LABELS, PhotoCategory } from "@/lib/types/handover";

interface LiveCameraModalProps {
  open: boolean;
  docNumber: string;
  phase: HandoverPhase;
  category: PhotoCategory | null;
  onClose: () => void;
  onCaptureFile: (category: PhotoCategory, file: File) => Promise<void>;
  onFallbackDemo: (category: PhotoCategory) => Promise<void>;
}

export function LiveCameraModal({
  open,
  docNumber,
  phase,
  category,
  onClose,
  onCaptureFile,
  onFallbackDemo,
}: LiveCameraModalProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [capturing, setCapturing] = useState(false);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraReady(false);
  }, []);

  const startCamera = useCallback(async (mode: "environment" | "user") => {
    stopStream();
    setCameraError("");
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setCameraError("เบราว์เซอร์จำกัดการสตรีมกล้องสดบน HTTP (ไม่ใช่ HTTPS) สามารถกดปุ่มชัตเตอร์ด้านล่างหรือเปิดกล้องมือถือแทนได้ทันที");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: mode }, width: { ideal: 1600 }, height: { ideal: 1200 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraReady(true);
    } catch {
      setCameraError("ยังไม่ได้อนุญาตสิทธิ์กล้อง หรือเปิดผ่าน HTTP สามารถกดชัตเตอร์จำลองหรือเปิดแอปกล้องมือถือด้านล่างได้");
    }
  }, [stopStream]);

  useEffect(() => {
    if (open && category) startCamera(facingMode);
    else stopStream();
    return () => stopStream();
  }, [open, category, facingMode, startCamera, stopStream]);

  if (!open || !category) return null;

  const handleSnapShutter = async () => {
    const video = videoRef.current;
    if (!video || !cameraReady) {
      setCapturing(true);
      try {
        await onFallbackDemo(category);
        onClose();
      } finally {
        setCapturing(false);
      }
      return;
    }
    setCapturing(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 960;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise<Blob | null>((r) => canvas.toBlob((b) => r(b), "image/jpeg", 0.9));
      if (!blob) return;
      const file = new File([blob], `camera-${category}-${Date.now()}.jpg`, { type: "image/jpeg" });
      stopStream();
      await onCaptureFile(category, file);
      onClose();
    } finally {
      setCapturing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-3 sm:p-5 text-white">
      <div className="flex items-center justify-between bg-slate-900/90 border border-slate-700 rounded-2xl px-4 py-3">
        <div>
          <span className="text-[11px] font-bold text-amber-400 uppercase">
            📷 โหมดกล้องถ่ายรูปสด (Live Camera Viewfinder)
          </span>
          <h3 className="text-sm sm:text-base font-extrabold">
            มุมที่กำลังถ่าย: {PHOTO_CATEGORY_LABELS[category]}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setFacingMode((m) => (m === "environment" ? "user" : "environment"))} className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold inline-flex items-center gap-1.5 border border-slate-600">
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" /> สลับกล้อง
          </button>
          <button type="button" onClick={onClose} className="p-2 rounded-xl bg-slate-800 hover:bg-red-900/60 text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="relative flex-1 my-3 rounded-2xl overflow-hidden border-2 border-amber-400/70 bg-slate-950 flex items-center justify-center">
        <video ref={videoRef} autoPlay playsInline muted className={`w-full h-full object-cover ${cameraReady ? "block" : "hidden"}`} />
        <div className="pointer-events-none absolute inset-6 border-2 border-dashed border-white/50 rounded-2xl flex flex-col justify-between p-3">
          <div className="text-[11px] font-bold text-amber-300 bg-black/50 px-2.5 py-1 rounded-lg self-start">
            จัดตำแหน่งรถยนต์ให้อยู่ในกรอบเส้นประ
          </div>
          <div className="bg-slate-900/85 border border-slate-700 rounded-lg px-3 py-1.5 text-[11px] font-mono text-amber-300 flex justify-between">
            <span>AUTO1 | {docNumber} | {phase}</span>
            <span>{PHOTO_CATEGORY_LABELS[category]}</span>
          </div>
        </div>
        {!cameraReady && (
          <div className="max-w-md text-center p-6 space-y-3">
            <Camera className="w-12 h-12 text-amber-400 mx-auto animate-pulse" />
            <p className="text-sm font-bold text-white">{cameraError || "กำลังเชื่อมต่อกล้องถ่ายรูปสด..."}</p>
            {cameraError && (
              <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold inline-flex items-center gap-1.5">
                <Smartphone className="w-4 h-4" /> เปิดแอปกล้องมือถือโดยตรง
                <input type="file" accept="image/*" capture="environment" onChange={async (e) => { const f = e.target.files?.[0]; if (f) { await onCaptureFile(category, f); onClose(); } }} className="hidden" />
              </label>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-center pb-2">
        <button type="button" disabled={capturing} onClick={handleSnapShutter} className="px-8 py-3.5 rounded-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-extrabold text-sm sm:text-base inline-flex items-center gap-2 shadow-lg ring-4 ring-white/30 transition transform active:scale-95">
          {cameraReady ? <Camera className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
          {capturing ? "กำลังประทับลายน้ำ..." : cameraReady ? "กดชัตเตอร์ถ่ายภาพสด" : "กดชัตเตอร์ถ่ายภาพ (โหมดจำลองกล้องสด)"}
        </button>
      </div>
    </div>
  );
}
