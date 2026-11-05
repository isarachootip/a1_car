export function formatDocumentNumber(year: number, sequenceNumber: number): string {
  const paddedSeq = String(sequenceNumber).padStart(4, "0");
  return `PU-${year}-${paddedSeq}`;
}

export function formatThaiDate(isoOrDate: string | Date | null | undefined): string {
  if (!isoOrDate) return "..... / ..... / .........";
  const d = typeof isoOrDate === "string" ? new Date(isoOrDate) : isoOrDate;
  if (Number.isNaN(d.getTime())) return "..... / ..... / .........";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const buddhistYear = d.getFullYear() + 543;
  return `${day} / ${month} / ${buddhistYear}`;
}

export function formatThaiTime(isoOrDate: string | Date | null | undefined): string {
  if (!isoOrDate) return ".......";
  const d = typeof isoOrDate === "string" ? new Date(isoOrDate) : isoOrDate;
  if (Number.isNaN(d.getTime())) return ".......";
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}
