import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface DataRecord {
  [key: string]: string | number | boolean | null;
}

interface Connection {
  from: string;
  to: string;
  type: string;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function renderMarkdownToHtml(markdown: string) {
  if (!markdown) return "";

  const codeBlocks: string[] = [];
  const content = escapeHtml(markdown).replace(/```([\s\S]*?)```/g, (_, code) => {
    codeBlocks.push(code.trim());
    return `@@CODEBLOCK[${codeBlocks.length - 1}]@@`;
  });

  const lines = content.split("\n");
  const htmlLines: string[] = [];
  let inUl = false;
  let inOl = false;

  const flushLists = () => {
    if (inUl) {
      htmlLines.push("</ul>");
      inUl = false;
    }
    if (inOl) {
      htmlLines.push("</ol>");
      inOl = false;
    }
  };

  const formatInlineCode = (text: string) =>
    text.replace(/`([^`]+)`/g, (_, code) =>
      `<code style="background:#e2e8f0;color:#0f172a;padding:2px 6px;border-radius:6px;font-family:ui-monospace,monospace;">${code}</code>`
    );

  lines.forEach((line) => {
    const codeMatch = line.match(/^@@CODEBLOCK\[(\d+)\]@@$/);
    if (codeMatch) {
      flushLists();
      const code = codeBlocks[Number(codeMatch[1])] ?? "";
      htmlLines.push(
        `<pre style="background:#0f172a;color:#f8fafc;padding:16px;border-radius:12px;overflow-x:auto;margin:16px 0;"><code>${escapeHtml(code)}</code></pre>`
      );
      return;
    }

    if (line.trim() === "") {
      flushLists();
      htmlLines.push("<p style=\"margin:0 0 12px;line-height:1.6;color:#334155;\">&nbsp;</p>");
      return;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      flushLists();
      const level = Math.min(6, headingMatch[1].length);
      htmlLines.push(
        `<h${level} style="margin:24px 0 12px;color:#0f172a;font-weight:700;">${escapeHtml(headingMatch[2])}</h${level}>`
      );
      return;
    }

    const ulMatch = line.match(/^\s*[-*+]\s+(.*)$/);
    if (ulMatch) {
      if (!inUl) {
        flushLists();
        inUl = true;
        htmlLines.push('<ul style="margin:0 0 16px 18px;padding:0;">');
      }
      htmlLines.push(
        `<li style="margin-bottom:8px;line-height:1.6;color:#334155;">${formatInlineCode(escapeHtml(ulMatch[1]))}</li>`
      );
      return;
    }

    const olMatch = line.match(/^\s*\d+\.\s+(.*)$/);
    if (olMatch) {
      if (!inOl) {
        flushLists();
        inOl = true;
        htmlLines.push('<ol style="margin:0 0 16px 18px;padding:0;">');
      }
      htmlLines.push(
        `<li style="margin-bottom:8px;line-height:1.6;color:#334155;">${formatInlineCode(escapeHtml(olMatch[1]))}</li>`
      );
      return;
    }

    htmlLines.push(
      `<p style="margin:0 0 12px;line-height:1.6;color:#334155;">${formatInlineCode(escapeHtml(line))}</p>`
    );
  });

  flushLists();
  return htmlLines.join("");
}

export const downloadService = {
  // Download as JSON
  downloadJSON(data: Record<string, unknown>, filename: string) {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    this.triggerDownload(blob, filename);
  },

  // Download as YAML
  downloadYAML(data: string, filename: string) {
    const blob = new Blob([data], { type: "text/yaml" });
    this.triggerDownload(blob, filename);
  },

  // Download as Text
  downloadText(data: string, filename: string) {
    const blob = new Blob([data], { type: "text/plain" });
    this.triggerDownload(blob, filename);
  },

  // Download as PDF
  async downloadPDF(content: string | HTMLElement, filename: string) {
    try {
      let canvas: HTMLCanvasElement;

      if (typeof content === "string") {
        const tempDiv = document.createElement("div");
        tempDiv.style.position = "fixed";
        tempDiv.style.top = "0";
        tempDiv.style.left = "0";
        tempDiv.style.width = "800px";
        tempDiv.style.padding = "32px";
        tempDiv.style.backgroundColor = "#ffffff";
        tempDiv.style.color = "#0f172a";
        tempDiv.style.fontFamily = "Inter, ui-sans-serif, system-ui, sans-serif";
        tempDiv.style.lineHeight = "1.6";
        tempDiv.style.boxSizing = "border-box";
        tempDiv.style.zIndex = "999999";
        tempDiv.innerHTML = content;
        document.body.appendChild(tempDiv);
        canvas = await html2canvas(tempDiv, { scale: 2, backgroundColor: "#ffffff" });
        document.body.removeChild(tempDiv);
      } else {
        canvas = await html2canvas(content, { scale: 2, backgroundColor: "#ffffff" });
      }

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= 297;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= 297;
      }

      pdf.save(filename);
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw error;
    }
  },

  // Download as CSV
  downloadCSV(data: DataRecord[], filename: string) {
    if (!data.length) return;

    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(","),
      ...data.map((row) =>
        headers.map((header) => {
          const value = row[header];
          return typeof value === "string" ? `"${value}"` : value;
        }).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    this.triggerDownload(blob, filename);
  },

  // Download Docker Compose
  downloadDockerCompose(yaml: string, projectName: string = "infra-pilot") {
    this.downloadYAML(yaml, `${projectName}-docker-compose.yml`);
  },

  // Download Architecture Plan (Multi-format)
  async downloadArchitecturePlan(
    title: string,
    services: string[],
    connections: Connection[],
    recommendations: string,
    format: "json" | "pdf" | "text" = "json"
  ) {
    const plan = {
      title,
      timestamp: new Date().toISOString(),
      services,
      connections,
      recommendations,
    };

    const filename = `${title.replace(/\s+/g, "-").toLowerCase()}-plan`;

    if (format === "json") {
      this.downloadJSON(plan, `${filename}.json`);
    } else if (format === "text") {
      const textContent = `
=== Architecture Plan ===
Title: ${title}
Date: ${new Date().toLocaleString()}

Services:
${services.join("\n- ")}

Connections:
${connections.map((c) => `${c.from} -> ${c.to} (${c.type})`).join("\n")}

Recommendations:
${recommendations}
      `;
      this.downloadText(textContent, `${filename}.txt`);
    } else if (format === "pdf") {
      const htmlBody = `
        <div style="max-width:760px;padding:0;margin:0;font-family:Inter,ui-sans-serif,system-ui,sans-serif;color:#0f172a;">
          <h1 style="font-size:32px;margin-bottom:8px;color:#111;font-weight:800;">${escapeHtml(title)}</h1>
          <p style="margin:0 0 24px;color:#475569;font-size:14px;">Generated on ${escapeHtml(new Date().toLocaleString())}</p>

          <section style="margin-bottom:24px;">
            <h2 style="font-size:18px;margin:0 0 12px;color:#0f172a;">Services</h2>
            <ul style="margin:0 0 0 18px;padding:0;color:#334155;">
              ${services.map((s) => `<li style="margin-bottom:8px;">${escapeHtml(s)}</li>`).join("")}
            </ul>
          </section>

          <section style="margin-bottom:24px;">
            <h2 style="font-size:18px;margin:0 0 12px;color:#0f172a;">Connections</h2>
            <pre style="background:#f8fafc;color:#0f172a;padding:16px;border-radius:14px;overflow-x:auto;line-height:1.6;white-space:pre-wrap;word-break:break-word;margin:0;">${escapeHtml(
              connections.map((c) => `${c.from} -> ${c.to} (${c.type})`).join("\n")
            )}</pre>
          </section>

          <section style="margin-bottom:24px;">
            <h2 style="font-size:18px;margin:0 0 12px;color:#0f172a;">Recommendations</h2>
            <div style="font-size:14px;line-height:1.75;color:#334155;">
              ${renderMarkdownToHtml(recommendations)}
            </div>
          </section>
        </div>
      `;

      await this.downloadPDF(htmlBody, `${filename}.pdf`);
    }
  },

  // Helper function
  triggerDownload(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },
};
