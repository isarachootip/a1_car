"use client";

import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Copy, Check, QrCode, X, ExternalLink } from "lucide-react";

interface QrShareModalProps {
  open: boolean;
  docNumber: string;
  publicToken: string;
  customerPhone: string;
  onClose: () => void;
}

export function QrShareModal({
  open,
  docNumber,
  publicToken,
  customerPhone,
  onClose,
}: QrShareModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/sign/${publicToken}`
      : `/sign/${publicToken}`;

  const last4 = customerPhone.replace(/\D/g, "").slice(-4) || "----";

  useEffect(() => {
    if (open && shareUrl) {
      QRCode.toDataURL(shareUrl, { width: 260, margin: 2 })
        .then(setQrDataUrl)
        .catch(() => setQrDataUrl(""));
    }
  }, [open, shareUrl]);

  if (!open) return null;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-xl border border-slate-200 text-center">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
            <QrCode className="w-4 h-4" />
            <span>ลิงก์และ QR Code สำหรับลูกค้าเซ็นออนไลน์</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-600 mb-3">
          ให้ลูกค้าสแกน QR Code หรือส่งลิงก์ผ่าน LINE / SMS สำหรับเอกสาร{" "}
          <b className="text-slate-900">{docNumber}</b>
        </p>

        {qrDataUrl && (
          <div className="inline-block p-3 bg-white border border-slate-200 rounded-xl shadow-sm mb-3">
            <img src={qrDataUrl} alt="QR Code" className="w-48 h-48 mx-auto" />
          </div>
        )}

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-xs text-amber-900 mb-4">
          🔐 รหัสยืนยันตัวตนของลูกค้า (เลขท้ายเบอร์โทร 4 หลัก):{" "}
          <span className="font-mono font-bold text-sm">{last4}</span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="flex-1 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-700 font-mono"
          />
          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-2 rounded-lg bg-slate-900 text-white text-xs font-bold inline-flex items-center gap-1"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "คัดลอกแล้ว" : "คัดลอก"}
          </button>
        </div>

        <a
          href={shareUrl}
          target="_blank"
          rel="noreferrer"
          className="w-full py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700 inline-flex items-center justify-center gap-1.5"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          เปิดหน้าจอลูกค้าในแท็บใหม่ (สำหรับทดสอบ)
        </a>
      </div>
    </div>
  );
}
