import * as L from 'leaflet';
import { GeoJsonLoaderOptions, GeoJsonStyle, GeoLayer } from '../export/interfaces';


const DEFAULT_STYLE: GeoJsonStyle = {
  color: '#2563eb',
  weight: 2,
  opacity: 0.8,
  fillColor: '#2563eb',
  fillOpacity: 0.05,
};

export class GeoJsonLoader {
  private map: L.Map;
  private layers = new Map<string, L.GeoJSON>();
  private options: GeoJsonLoaderOptions;

  constructor(map: L.Map, options?: GeoJsonLoaderOptions) {
    this.map = map;
    this.options = options || {};
  }

  async load(layer: GeoLayer, url: string, style?: GeoJsonStyle): Promise<L.GeoJSON | null> {
    if (this.layers.has(layer.id)) return this.layers.get(layer.id)!;

    try {
      const resp = await fetch(url);
      if (!resp.ok) return null;
      const geojson = await resp.json();
      if (!geojson.features?.length) return null;

      const mergedStyle = { ...DEFAULT_STYLE, ...this.options.defaultStyle, ...style };
      const gjOptions: L.GeoJSONOptions = {
        style: () => ({
          color: mergedStyle.color,
          weight: mergedStyle.weight,
          opacity: layer.opacity ?? mergedStyle.opacity,
          fillColor: mergedStyle.fillColor,
          fillOpacity: mergedStyle.fillOpacity,
        }),
      };

      if (this.options.paneName) {
        (gjOptions as Record<string, unknown>)['pane'] = this.options.paneName;
      }

      if (this.options.onFeatureClick) {
        const handler = this.options.onFeatureClick;
        gjOptions.onEachFeature = (feature, featureLayer) => {
          featureLayer.on('click', (e: L.LeafletMouseEvent) => {
            handler(feature, e.latlng);
          });
        };
      }

      const gjLayer = L.geoJSON(geojson, gjOptions);
      gjLayer.addTo(this.map);
      this.layers.set(layer.id, gjLayer);
      return gjLayer;
    } catch {
      return null;
    }
  }

  remove(layerId: string): void {
    const gj = this.layers.get(layerId);
    if (gj) {
      this.map.removeLayer(gj);
      this.layers.delete(layerId);
    }
  }

  setOpacity(layerId: string, opacity: number): void {
    const gj = this.layers.get(layerId);
    if (gj) {
      gj.setStyle({ opacity, fillOpacity: opacity * 0.1 });
    }
  }

  has(layerId: string): boolean {
    return this.layers.has(layerId);
  }

  getBounds(layerId: string): L.LatLngBounds | null {
    const gj = this.layers.get(layerId);
    if (!gj) return null;
    const bounds = gj.getBounds();
    return bounds.isValid() ? bounds : null;
  }

  removeAll(): void {
    for (const [id] of this.layers) {
      this.remove(id);
    }
  }

  destroy(): void {
    this.removeAll();
  }
}
