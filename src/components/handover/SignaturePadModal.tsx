"use client";

import React, { useEffect, useRef, useState } from "react";
import { Eraser, Check, X } from "lucide-react";

interface SignaturePadModalProps {
  open: boolean;
  title: string;
  defaultSignerName: string;
  onClose: () => void;
  onConfirm: (signerName: string, signatureDataUrl: string) => Promise<void>;
}

export function SignaturePadModal({
  open,
  title,
  defaultSignerName,
  onClose,
  onConfirm,
}: SignaturePadModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [signerName, setSignerName] = useState(defaultSignerName);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setSignerName(defaultSignerName);
      setHasDrawn(false);
      setError("");
      setTimeout(() => clearCanvas(), 50);
    }
  }, [open, defaultSignerName]);

  if (!open) return null;

  const getPoint = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ("touches" in e) {
      const touch = e.touches[0] ?? e.changedTouches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDraw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const pt = getPoint(e);
    ctx.beginPath();
    ctx.moveTo(pt.x, pt.y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const moveDraw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const pt = getPoint(e);
    ctx.lineWidth = 3.2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#0f172a";
    ctx.lineTo(pt.x, pt.y);
    ctx.stroke();
  };

  const endDraw = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleSave = async () => {
    if (!signerName.trim()) {
      setError("กรุณาระบุชื่อ-นามสกุลตัวบรรจง");
      return;
    }
    if (!hasDrawn || !canvasRef.current) {
      setError("กรุณาลงลายมือชื่อในกรอบด้านบน");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const dataUrl = canvasRef.current.toDataURL("image/png");
      await onConfirm(signerName.trim(), dataUrl);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการบันทึก");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-xl w-full p-5 shadow-2xl border border-slate-200 max-h-[95vh] flex flex-col justify-between">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-3">
          <h3 className="font-extrabold text-slate-900 text-base">{title}</h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-3">
          <label className="block text-xs font-bold text-slate-700 mb-1">
            ชื่อ-นามสกุล ตัวบรรจง (แสดงในวงเล็บใต้ลายเซ็น) *
          </label>
          <input
            type="text"
            value={signerName}
            onChange={(e) => setSignerName(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-medium"
          />
        </div>

        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5">
            <span className="font-bold">ใช้นิ้วหรือปากกาเซ็นชื่อในกรอบด้านล่าง *</span>
            <button
              type="button"
              onClick={clearCanvas}
              className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:text-slate-900 inline-flex items-center gap-1 font-bold"
            >
              <Eraser className="w-3.5 h-3.5" /> ล้างลายเซ็น
            </button>
          </div>
          <canvas
            ref={canvasRef}
            width={640}
            height={280}
            onMouseDown={startDraw}
            onMouseMove={moveDraw}
            onMouseUp={endDraw}
            onMouseLeave={endDraw}
            onTouchStart={startDraw}
            onTouchMove={moveDraw}
            onTouchEnd={endDraw}
            className="w-full h-56 sm:h-52 border-2 border-dashed border-slate-400 rounded-2xl bg-slate-50 touch-none cursor-crosshair"
          />
        </div>

        {error && <p className="text-xs text-red-600 font-semibold mb-3">{error}</p>}

        <div className="grid grid-cols-2 sm:flex sm:justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="py-3 px-4 rounded-xl border border-slate-300 text-xs font-bold text-slate-700"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={handleSave}
            className="py-3 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 text-xs font-extrabold inline-flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            {submitting ? "กำลังบันทึก..." : "ยืนยันการลงนาม"}
          </button>
        </div>
      </div>
    </div>
  );
}
