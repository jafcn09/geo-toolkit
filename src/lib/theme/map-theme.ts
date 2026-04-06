import { MapThemeConfig, ThemeMode } from '@geo-toolkit/leaflet';
import * as L from 'leaflet';


const DEFAULT_CONFIG: MapThemeConfig = {
  lightTileUrl: 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png',
  darkTileUrl: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  lightLabelsUrl: 'https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png',
  darkLabelsUrl: 'https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png',
  autoSwitchHour: { darkStart: 19, darkEnd: 7 },
};

export class MapTheme {
  private map: L.Map;
  private config: MapThemeConfig;
  private currentMode: ThemeMode = 'light';
  private baseLayer: L.TileLayer | null = null;
  private labelsLayer: L.TileLayer | null = null;
  private basePaneName: string;
  private labelsPaneName: string;

  constructor(map: L.Map, basePaneName: string, labelsPaneName: string, config?: Partial<MapThemeConfig>) {
    this.map = map;
    this.basePaneName = basePaneName;
    this.labelsPaneName = labelsPaneName;
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  isDark(): boolean {
    if (this.currentMode === 'auto') {
      const hour = new Date().getHours();
      const { darkStart, darkEnd } = this.config.autoSwitchHour!;
      return hour >= darkStart || hour < darkEnd;
    }
    return this.currentMode === 'dark';
  }

  setMode(mode: ThemeMode): void {
    this.currentMode = mode;
    this.applyTheme();
  }

  getMode(): ThemeMode {
    return this.currentMode;
  }

  applyTheme(): void {
    const dark = this.isDark();

    if (this.baseLayer) this.map.removeLayer(this.baseLayer);
    if (this.labelsLayer) this.map.removeLayer(this.labelsLayer);

    const tileUrl = dark ? this.config.darkTileUrl : this.config.lightTileUrl;
    this.baseLayer = L.tileLayer(tileUrl, {
      attribution: 'OpenStreetMap contributors, CARTO',
      maxNativeZoom: 19,
      maxZoom: 24,
      pane: this.basePaneName,
    }).addTo(this.map);

    const labelsUrl = dark ? this.config.darkLabelsUrl : this.config.lightLabelsUrl;
    if (labelsUrl) {
      this.labelsLayer = L.tileLayer(labelsUrl, {
        opacity: 0.92,
        maxNativeZoom: 19,
        maxZoom: 24,
        pane: this.labelsPaneName,
      }).addTo(this.map);
    }
  }

  destroy(): void {
    if (this.baseLayer) this.map.removeLayer(this.baseLayer);
    if (this.labelsLayer) this.map.removeLayer(this.labelsLayer);
  }
}
