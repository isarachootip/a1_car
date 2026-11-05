"use client";

import React from "react";
import { PenTool } from "lucide-react";
import { formatThaiDate, formatThaiTime } from "@/lib/domain/docNumber";

interface SignatureBoxProps {
  label: string;
  sigUrl: string | null;
  signerName: string | null;
  signedAt: string | null;
  canSign: boolean;
  onClickSign: () => void;
}

export function SignatureBox({
  label,
  sigUrl,
  signerName,
  signedAt,
  canSign,
  onClickSign,
}: SignatureBoxProps) {
  return (
    <div className="bg-white border border-slate-300 rounded-lg p-3 text-center flex flex-col justify-between">
      <div>
        <div className="h-20 border-b border-dotted border-slate-400 flex items-center justify-center mb-1.5">
          {sigUrl ? (
            <img
              src={sigUrl}
              alt={label}
              className="max-h-16 object-contain"
            />
          ) : (
            <span className="text-[11px] text-slate-400">ยังไม่ได้ลงนาม</span>
          )}
        </div>
        <p className="text-xs font-bold text-slate-800">{label}</p>
        <p className="text-[11px] text-slate-600 mt-0.5">
          ({signerName || "............................................"})
        </p>
        <p className="text-[10px] text-slate-500 mt-0.5">
          วันที่ {formatThaiDate(signedAt)} เวลา {formatThaiTime(signedAt)} น.
        </p>
      </div>

      {canSign && (
        <button
          type="button"
          onClick={onClickSign}
          className="mt-2 w-full py-1.5 px-2 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold inline-flex items-center justify-center gap-1"
        >
          <PenTool className="w-3 h-3" />
          {sigUrl ? "เซ็นใหม่" : "กดเพื่อเซ็นชื่อ"}
        </button>
      )}
    </div>
  );
}
