"use client";

import { FileDown } from "lucide-react";
import { generatePdfReport } from "@/lib/pdf";

export default function ExportDashboardPdfButton() {
  const handleExport = () => {
    generatePdfReport({
      title: "Restaurant Analytics",
      subtitle: "Revenue, orders and sales performance overview.",
      fileName: "foodspot-owner-analytics.pdf",
      sections: [
        {
          type: "stats",
          items: [
            { label: "Total Revenue", value: "$1,284,530" },
            { label: "Total Orders", value: "45,102" },
            { label: "Sales Goal (Month)", value: "75%" },
          ],
        },
        {
          type: "table",
          title: "Product Highlights",
          head: ["Item", "Highlight", "Orders"],
          body: [
            ["Signature Hummus Platter", "Best Seller", "12,450"],
            ["Saffron Rice Sphere", "Low Volume", "142"],
          ],
        },
      ],
    });
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      className="inline-flex items-center gap-2 rounded-lg bg-[#d97a3a] px-6 py-3 font-[family-name:var(--font-inter)] text-[15px] font-bold text-white transition-colors hover:bg-[#cc6d2f]"
    >
      <FileDown className="h-4 w-4" /> Export to PDF
    </button>
  );
}