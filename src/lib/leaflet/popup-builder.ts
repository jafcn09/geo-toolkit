import * as L from 'leaflet';
import { FeatureInfoResult, PopupTheme } from '../export/interfaces';


export const POPUP_THEME_LIGHT: PopupTheme = {
  bg: '#ffffff',
  text: '#1e293b',
  textSecondary: '#64748b',
  border: '#e2e8f0',
  accent: '#1e40af',
};

export const POPUP_THEME_DARK: PopupTheme = {
  bg: '#1e293b',
  text: '#f1f5f9',
  textSecondary: '#94a3b8',
  border: '#334155',
  accent: '#60a5fa',
};

export class PopupBuilder {
  private theme: PopupTheme;

  constructor(theme?: PopupTheme) {
    this.theme = theme || POPUP_THEME_LIGHT;
  }

  setTheme(theme: PopupTheme): void {
    this.theme = theme;
  }

  build(result: FeatureInfoResult, maxRows?: number): string {
    const titleKeys = ['nombre', 'name', 'nomdep', 'nombdist', 'nombprov', 'titulo', 'denominacion'];
    let featureTitle = '';
    for (const tk of titleKeys) {
      const match = Object.entries(result.properties).find(([k]) => k.toLowerCase().replace(/ /g, '') === tk);
      if (match?.[1]) { featureTitle = match[1]; break; }
    }

    const displayTitle = featureTitle || result.layerName;
    const subtitle = featureTitle ? result.layerName : (result.attribution || 'WMS');

    const rows = Object.entries(result.properties)
      .slice(0, maxRows ?? 15)
      .map(([k, v]) => `<div style="display:flex;justify-content:space-between;gap:10px;padding:4px 0;border-bottom:1px solid ${this.theme.border}"><span style="font-size:11px;font-weight:600;color:${this.theme.textSecondary};white-space:nowrap">${k}</span><span style="font-size:11px;color:${this.theme.text};text-align:right;word-break:break-word">${v}</span></div>`)
      .join('');

    return `<div style="max-width:320px;font-family:system-ui,-apple-system,sans-serif;background:${this.theme.bg};color:${this.theme.text}"><div style="padding:12px 14px 8px;border-bottom:1px solid ${this.theme.border}"><div style="font-weight:700;font-size:13px;color:${this.theme.text};line-height:1.3">${displayTitle}</div><div style="font-size:10px;font-weight:500;color:${this.theme.accent};margin-top:2px;text-transform:uppercase;letter-spacing:0.02em">${subtitle}</div></div><div style="padding:8px 14px 12px;max-height:220px;overflow-y:auto">${rows}</div></div>`;
  }

  showOnMap(map: L.Map, latlng: L.LatLng, result: FeatureInfoResult): L.Popup {
    const html = this.build(result);
    return L.popup({ maxWidth: 350, maxHeight: 300 })
      .setLatLng(latlng)
      .setContent(html)
      .openOn(map);
  }
}
