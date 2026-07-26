import {jsPDF} from "jspdf";
import autoTable from "jspdf-autotable";

type StatsSection = {
  type: "stats";
  items: { label: string; value: string }[];
};

type TableSection = {
  type: "table";
  title?: string;
  head: string[];
  body: (string | number)[][];
};

export type PdfSection = StatsSection | TableSection;

const BRAND = { r: 217, g: 122, b: 58 };
const INK = { r: 26, g: 28, b: 28 };
const MUTED = { r: 138, g: 138, b: 138 };
const RULE = { r: 238, g: 240, b: 243 };

export function generatePdfReport({
  title,
  subtitle,
  sections,
  fileName,
}: {
  title: string;
  subtitle?: string;
  sections: PdfSection[];
  fileName: string;
}) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;
  let y = 46;

  doc.setFillColor(BRAND.r, BRAND.g, BRAND.b);
  doc.rect(0, 0, pageWidth, 6, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(INK.r, INK.g, INK.b);
  doc.text("FoodSpot", margin, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
  doc.text(
    new Date().toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }),
    pageWidth - margin,
    y,
    { align: "right" },
  );

  y += 28;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(INK.r, INK.g, INK.b);
  doc.text(title, margin, y);

  if (subtitle) {
    y += 18;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(90, 90, 90);
    doc.text(subtitle, margin, y);
  }

  y += 16;
  doc.setDrawColor(RULE.r, RULE.g, RULE.b);
  doc.line(margin, y, pageWidth - margin, y);
  y += 28;

  for (const section of sections) {
    if (section.type === "stats") {
      const colWidth = (pageWidth - margin * 2) / section.items.length;
      section.items.forEach((item, i) => {
        const x = margin + i * colWidth;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
        doc.text(item.label, x, y);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(17);
        doc.setTextColor(INK.r, INK.g, INK.b);
        doc.text(item.value, x, y + 22);
      });
      y += 52;
    } else {
      if (section.title) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.setTextColor(INK.r, INK.g, INK.b);
        doc.text(section.title, margin, y);
        y += 12;
      }

      autoTable(doc, {
        startY: y,
        head: [section.head],
        body: section.body,
        margin: { left: margin, right: margin },
        styles: { fontSize: 9, cellPadding: 7, textColor: [50, 50, 50] },
        headStyles: {
          fillColor: [BRAND.r, BRAND.g, BRAND.b],
          textColor: 255,
          fontStyle: "bold",
        },
        alternateRowStyles: { fillColor: [250, 250, 251] },
      });

      const finalY = (doc as unknown as { lastAutoTable: { finalY: number } })
        .lastAutoTable.finalY;
      y = finalY + 30;
    }
  }

  const pageCount = doc.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    const h = doc.internal.pageSize.getHeight();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
    doc.text(
      `${new Date().getFullYear()} Food Spot — Restaurant Admin Panel`,
      margin,
      h - 20,
    );
    doc.text(`Page ${p} of ${pageCount}`, pageWidth - margin, h - 20, {
      align: "right",
    });
  }

  doc.save(fileName);
}