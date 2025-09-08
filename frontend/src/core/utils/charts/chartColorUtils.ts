/* eslint-disable @typescript-eslint/no-explicit-any */
import { DEFAULT_CHART_COLORS } from "@adapters/visualizations";
import type { ChartType } from "@type/widgetTypes";


/**
 * Génère une couleur HSL basée sur l'index
 */
export function generateHSLColor(index: number, saturation = 70, lightness = 60, alpha?: number): string {
    const hue = (index * 60) % 360;
    const alphaString = alpha !== undefined ? `, ${alpha}` : '';
    return `hsl(${hue}, ${saturation}%, ${lightness}%${alphaString})`;
}

/**
 * Obtient la couleur d'un dataset selon le type de graphique et l'index
 */
export function getDatasetColor(
    chartType: ChartType,
    index: number,
    style?: any,
    colors?: string[]
): string {
    // Priorité aux couleurs du style
    if (style?.color) return style.color;

    // Pour les graphiques pie, utiliser les couleurs personnalisées ou par défaut
    if (chartType === "pie") {
        const palette = colors || DEFAULT_CHART_COLORS;
        return palette[index % palette.length] || generateHSLColor(index);
    }

    // Couleurs par défaut selon le type de chart
    const defaultColors = {
        bar: generateHSLColor(index),
        line: generateHSLColor(index),
        scatter: generateHSLColor(index),
        bubble: generateHSLColor(index),
        radar: generateHSLColor(index),
    };

    return defaultColors[chartType] || generateHSLColor(index);
}

/**
 * Génère un tableau de couleurs pour les labels (utilisé pour pie charts)
 */
export function generateColorsForLabels(
    labels: string[],
    customColors?: string[],
): string[] {

    const palette = customColors || DEFAULT_CHART_COLORS;
    return labels.map((_, index) =>
        palette[index % palette.length] || generateHSLColor(index, 70, 60)
    );
}

/**
 * Génère des couleurs de bordure basées sur les couleurs de fond
 */
export function generateBorderColors(
    backgroundColors: string[],
    borderColor?: string,
    darkenFactor = 0.2
): string[] {
    if (borderColor) {
        return backgroundColors.map(() => borderColor);
    }

    return backgroundColors.map(color => {
        // Si c'est une couleur HSL, assombrir
        if (color.startsWith('hsl')) {
            return color.replace(/(\d+)%\)$/, (_, lightness) => {
                const newLightness = Math.max(0, parseInt(lightness) - darkenFactor * 100);
                return `${newLightness}%)`;
            });
        }
        // Pour les autres formats, retourner la même couleur
        return color;
    });
}

/**
 * Convertit une couleur en format rgba avec transparence
 */
export function addTransparency(color: string, alpha: number): string {
    if (color.startsWith('#')) {
        // Conversion hex vers rgba
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    if (color.startsWith('hsl')) {
        // Ajouter l'alpha à HSL
        return color.replace('hsl(', 'hsla(').replace(')', `, ${alpha})`);
    }

    if (color.startsWith('rgb(')) {
        // Convertir rgb vers rgba
        return color.replace('rgb(', 'rgba(').replace(')', `, ${alpha})`);
    }

    // Si déjà rgba ou format non reconnu, retourner tel quel
    return color;
}
