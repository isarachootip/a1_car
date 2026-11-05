"use client";

import React, { useEffect, useRef, useState } from "react";
import { ZoomIn, ZoomOut } from "lucide-react";

export function ResponsivePdfWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  const [fitToScreen, setFitToScreen] = useState(true);

  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current || !fitToScreen) {
        setScale(1);
        return;
      }
      const availableWidth = containerRef.current.clientWidth;
      const a4PixelWidth = 794; // 210mm at 96dpi
      if (availableWidth < a4PixelWidth) {
        setScale(Math.max(0.42, Number((availableWidth / a4PixelWidth).toFixed(3))));
      } else {
        setScale(1);
      }
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [fitToScreen]);

  return (
    <div ref={containerRef} className="w-full overflow-x-auto print:overflow-visible">
      <div className="no-print flex items-center justify-between mb-2 px-1 sm:hidden">
        <span className="text-[11px] font-semibold text-slate-600">
          มุมมองเอกสาร A4 บนมือถือ ({Math.round(scale * 100)}%)
        </span>
        <button
          type="button"
          onClick={() => setFitToScreen((v) => !v)}
          className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-xs font-bold text-slate-800 inline-flex items-center gap-1 shadow-sm"
        >
          {fitToScreen ? (
            <>
              <ZoomIn className="w-3.5 h-3.5" /> ซูมขนาดจริง 100%
            </>
          ) : (
            <>
              <ZoomOut className="w-3.5 h-3.5" /> ย่อพอดีจอมือถือ
            </>
          )}
        </button>
      </div>

      <div
        style={
          scale < 1
            ? {
                transform: `scale(${scale})`,
                transformOrigin: "top left",
                width: "794px",
              }
            : undefined
        }
        className="print:!transform-none print:!w-auto"
      >
        {children}
      </div>
    </div>
  );
}
