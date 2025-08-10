import * as htmlToImage from "html-to-image";
import jsPDF from "jspdf";

/**
 * Exporte la grille entière du dashboard en PDF, en respectant le layout visuel.
 * @param gridSelector Sélecteur CSS du conteneur de la grille (ex: '.dashboard-grid')
 * @param filename Nom du fichier PDF à générer
 */
export async function exportDashboardToPDF({
  gridSelector = ".dashboard-grid",
  filename = "dashboard.pdf",
  orientation = "landscape",
} = {}) {
  const grid = document.querySelector(gridSelector);
  if (!grid) {
    alert("Grille du dashboard introuvable");
    return;
  }
  try {
    // Forcer une police sûre pour éviter les problèmes de polices distantes
    const originalFont = (grid as HTMLElement).style.fontFamily;
    (grid as HTMLElement).style.fontFamily = "Inter, Arial, sans-serif";
    const dataUrl = await htmlToImage.toPng(grid as HTMLElement, {
      backgroundColor: "#fff",
      style: {
        background: "#fff",
        color: "#222",
        borderColor: "#ddd",
        fontFamily: "Inter, Arial, sans-serif",
      },
      filter: (node: HTMLElement) => {
        // Ignore les nœuds injectés par des extensions, liens externes, polices distantes, images distantes
        if (node.nodeType === 1) {
          const el = node as HTMLElement;
          if (
            (el.tagName === "LINK" &&
              el.getAttribute("rel") === "stylesheet" &&
              (/^(http|https|chrome-extension):/.test(
                el.getAttribute("href") || ""
              ) ||
                (el.getAttribute("href") || "").includes(
                  "res-1.cdn.office.net"
                ))) ||
            (el.tagName === "STYLE" &&
              /url\(['"]?(http|https|chrome-extension):/.test(el.innerHTML)) ||
            (el.tagName === "STYLE" &&
              el.innerHTML.includes("chrome-extension://")) ||
            (el.tagName === "STYLE" &&
              el.innerHTML.includes("res-1.cdn.office.net")) ||
            (el.tagName === "IMG" &&
              el.getAttribute("src") &&
              (/^(http|https|chrome-extension):/.test(
                el.getAttribute("src") || ""
              ) ||
                el.getAttribute("src")?.includes("res-1.cdn.office.net")))
          ) {
            return false;
          }
        }
        return true;
      },
    });
    (grid as HTMLElement).style.fontFamily = originalFont;
    const img = new window.Image();
    img.src = dataUrl;
    await new Promise((resolve) => {
      img.onload = resolve;
    });
    // Correction: passer orientation en premier argument (signature jsPDF)
    // Cast explicite pour satisfaire TypeScript
    const pdf = new jsPDF(orientation as "landscape" | "portrait", "pt", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    // Calcul du ratio pour que l'image tienne dans la page
    const ratio = Math.min(
      (pageWidth - 40) / img.width,
      (pageHeight - 40) / img.height,
      1
    );
    const imgWidth = img.width * ratio;
    const imgHeight = img.height * ratio;
    pdf.addImage(dataUrl, "PNG", 20, 20, imgWidth, imgHeight);
    pdf.save(filename);

  } catch (err) {
    alert("Erreur lors de la génération du PDF.");
    console.error("Erreur lors de la sauvegarde du PDF:", err);
  }
}
