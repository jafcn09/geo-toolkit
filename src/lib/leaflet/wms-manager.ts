import * as L from 'leaflet';
import { GeoLayer, WmsOptions } from '../export/interfaces';

const DEFAULT_WMS_OPTIONS: WmsOptions = {
  tileSize: 512,
  updateWhenZooming: false,
  updateWhenIdle: true,
  keepBuffer: 1,
  maxRetries: 3,
  errorThreshold: 10,
};

export class WmsManager {
  private map: L.Map;
  private paneName: string;
  private layers = new Map<string, L.TileLayer.WMS>();
  private layerMeta = new Map<string, GeoLayer>();
  private urlsInUse = new Map<string, string>();
  private retryIndex = new Map<string, number>();
  private tileStats = new Map<string, { errors: number; loaded: number }>();
  private options: WmsOptions;

  constructor(map: L.Map, paneName: string, options?: Partial<WmsOptions>) {
    this.map = map;
    this.paneName = paneName;
    this.options = { ...DEFAULT_WMS_OPTIONS, ...options };
  }

  add(layer: GeoLayer, customOpacity?: number): void {
    this.addToPane(layer, this.paneName, customOpacity);
  }

  addToPane(layer: GeoLayer, paneName: string, customOpacity?: number): void {
    if (!layer.url || !layer.layers || this.layers.has(layer.id)) return;

    const wmsUrl = this.getCurrentUrl(layer);
    if (!wmsUrl) return;

    const opacity = customOpacity ?? layer.opacity;
    const wmsOptions: L.WMSOptions & Record<string, unknown> = {
      layers: layer.layers,
      format: 'image/png',
      transparent: true,
      opacity,
      attribution: layer.attribution || '',
      minZoom: layer.minZoom,
      maxZoom: layer.maxZoom,
      pane: paneName,
      tileSize: this.options.tileSize,
      updateWhenZooming: this.options.updateWhenZooming,
      updateWhenIdle: this.options.updateWhenIdle,
      keepBuffer: this.options.keepBuffer,
    };

    if (layer.bounds) {
      (wmsOptions as Record<string, unknown>)['bounds'] = L.latLngBounds(layer.bounds);
    }

    const wmsLayer = L.tileLayer.wms(wmsUrl, wmsOptions);

    this.tileStats.set(layer.id, { errors: 0, loaded: 0 });
    this.urlsInUse.set(layer.id, wmsUrl);

    wmsLayer.on('tileload', () => this.onTileLoad(layer));
    wmsLayer.on('tileerror', () => this.onTileError(layer));
    wmsLayer.addTo(this.map);
    wmsLayer.bringToFront();
    this.layers.set(layer.id, wmsLayer);
    this.layerMeta.set(layer.id, layer);
  }

  remove(layerId: string): void {
    const wmsLayer = this.layers.get(layerId);
    if (wmsLayer) {
      this.map.removeLayer(wmsLayer);
      this.layers.delete(layerId);
    }
    this.urlsInUse.delete(layerId);
    this.layerMeta.delete(layerId);
    this.tileStats.delete(layerId);
  }

  setOpacity(layerId: string, opacity: number): void {
    const wmsLayer = this.layers.get(layerId);
    if (wmsLayer) wmsLayer.setOpacity(opacity);
  }

  has(layerId: string): boolean {
    return this.layers.has(layerId);
  }

  getVisibleLayers(): GeoLayer[] {
    return [...this.layerMeta.values()].filter(l => this.layers.has(l.id));
  }

  getUrl(layerId: string): string | undefined {
    return this.urlsInUse.get(layerId);
  }

  getMeta(layerId: string): GeoLayer | undefined {
    return this.layerMeta.get(layerId);
  }

  removeAll(): void {
    for (const [id] of this.layers) {
      this.remove(id);
    }
  }

  destroy(): void {
    this.removeAll();
    this.retryIndex.clear();
  }

  private getCurrentUrl(layer: GeoLayer): string | null {
    const candidates = this.getUrlCandidates(layer);
    if (candidates.length === 0) return null;
    const index = this.retryIndex.get(layer.id) ?? 0;
    return candidates[Math.min(index, candidates.length - 1)];
  }

  private getUrlCandidates(layer: GeoLayer): string[] {
    return [...new Set(
      [layer.url, ...(layer.fallbackUrls || [])].filter((u): u is string => Boolean(u))
    )];
  }

  private tryNextUrl(layer: GeoLayer): boolean {
    const candidates = this.getUrlCandidates(layer);
    const nextIndex = (this.retryIndex.get(layer.id) ?? 0) + 1;
    if (nextIndex >= candidates.length) return false;
    this.retryIndex.set(layer.id, nextIndex);
    this.remove(layer.id);
    this.add(layer);
    return true;
  }

  private onTileError(layer: GeoLayer): void {
    const stats = this.tileStats.get(layer.id) ?? { errors: 0, loaded: 0 };
    stats.errors += 1;
    this.tileStats.set(layer.id, stats);

    const retries = this.options.maxRetries ?? 3;
    if (stats.loaded === 0 && stats.errors >= retries) {
      this.tryNextUrl(layer);
    }
  }

  private onTileLoad(layer: GeoLayer): void {
    const stats = this.tileStats.get(layer.id) ?? { errors: 0, loaded: 0 };
    stats.loaded += 1;
    this.tileStats.set(layer.id, stats);
  }
}
