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
        // Create a temporary container
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = content;
        tempDiv.style.padding = "20px";
        tempDiv.style.backgroundColor = "white";
        document.body.appendChild(tempDiv);
        canvas = await html2canvas(tempDiv);
        document.body.removeChild(tempDiv);
      } else {
        canvas = await html2canvas(content);
      }

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= 297; // A4 height in mm

      while (heightLeft >= 0) {
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
      await this.downloadPDF(
        `
        <h1>${title}</h1>
        <p>Date: ${new Date().toLocaleString()}</p>
        <h2>Services</h2>
        <ul>${services.map((s) => `<li>${s}</li>`).join("")}</ul>
        <h2>Connections</h2>
        <pre>${connections.map((c) => `${c.from} -> ${c.to} (${c.type})`).join("\n")}</pre>
        <h2>Recommendations</h2>
        <p>${recommendations}</p>
        `,
        `${filename}.pdf`
      );
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
