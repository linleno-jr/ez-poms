import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { jsPDF } from "jspdf";

function download(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function label(pom, index) {
  return pom.title.trim() || `POM ${index + 1}`;
}

export async function exportDocx(poms) {
  const children = [
    new Paragraph({
      heading: HeadingLevel.TITLE,
      children: [new TextRun("POMS")],
    }),
  ];

  poms.forEach((pom, i) => {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 280, after: 80 },
        children: [new TextRun(label(pom, i))],
      }),
      new Paragraph({
        spacing: { after: 160, line: 360 },
        children: [new TextRun(pom.text.trim())],
      })
    );
  });

  const doc = new Document({ sections: [{ children }] });
  const blob = await Packer.toBlob(doc);
  download(blob, "ez-poms.docx");
}

export function exportPdf(poms) {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 64;
  const maxWidth = pageWidth - margin * 2;
  let y = margin;

  const ensureSpace = (needed) => {
    if (y + needed > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  };

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("POMS", margin, y);
  y += 36;

  poms.forEach((pom, i) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    const titleLines = doc.splitTextToSize(label(pom, i), maxWidth);
    ensureSpace(titleLines.length * 18 + 24);
    doc.text(titleLines, margin, y);
    y += titleLines.length * 18;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const bodyLines = doc.splitTextToSize(pom.text.trim(), maxWidth);
    bodyLines.forEach((line) => {
      ensureSpace(18);
      doc.text(line, margin, y);
      y += 18;
    });
    y += 18;
  });

  doc.save("ez-poms.pdf");
}
