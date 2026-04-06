import * as L from 'leaflet';
import { GeoLayer, FeatureInfoResult, FeatureInfoOptions } from '../export/interfaces';

const DEFAULT_OPTIONS: FeatureInfoOptions = {
  timeout: 5000,
  formats: ['application/json', 'application/geojson', 'text/html'],
  buffer: 12,
};

export class FeatureInfo {
  private map: L.Map;
  private options: FeatureInfoOptions;

  constructor(map: L.Map, options?: Partial<FeatureInfoOptions>) {
    this.map = map;
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  async query(latlng: L.LatLng, layer: GeoLayer, wmsUrl?: string): Promise<FeatureInfoResult | null> {
    const url = wmsUrl || layer.url;
    if (!url || !layer.layers) return null;

    const queryLayer = layer.layers.split(',')[0];

    if (this.options.proxyUrl) {
      return this.queryViaProxy(latlng, layer, queryLayer, url);
    }

    return this.queryDirect(latlng, layer, queryLayer, url);
  }

  async queryAll(latlng: L.LatLng, layers: GeoLayer[], getUrl?: (layer: GeoLayer) => string | undefined): Promise<FeatureInfoResult | null> {
    const results = await Promise.allSettled(
      layers.map(layer => {
        const url = getUrl ? getUrl(layer) : layer.url;
        return this.query(latlng, layer, url);
      })
    );

    for (const r of results) {
      if (r.status === 'fulfilled' && r.value && Object.keys(r.value.properties).length > 0) {
        return r.value;
      }
    }
    return null;
  }

  private async queryViaProxy(latlng: L.LatLng, layer: GeoLayer, queryLayer: string, wmsUrl: string): Promise<FeatureInfoResult | null> {
    const size = this.map.getSize();
    const bounds = this.map.getBounds();
    const point = this.map.latLngToContainerPoint(latlng);

    const params = new URLSearchParams({
      wmsUrl,
      layers: queryLayer,
      x: Math.round(point.x).toString(),
      y: Math.round(point.y).toString(),
      width: size.x.toString(),
      height: size.y.toString(),
      srs: 'EPSG:4326',
      bbox: `${bounds.getWest()},${bounds.getSouth()},${bounds.getEast()},${bounds.getNorth()}`,
      buffer: (this.options.buffer ?? 12).toString(),
    });

    try {
      const resp = await fetch(`${this.options.proxyUrl}?${params}`, {
        signal: AbortSignal.timeout(this.options.timeout ?? 5000),
      });
      if (!resp.ok) return null;
      const text = await resp.text();
      if (!text || text.length < 10) return null;

      const props = this.parseResponse(text);
      if (!props) return null;

      return {
        layerName: layer.name,
        attribution: layer.attribution || '',
        properties: props,
        latlng: { lat: latlng.lat, lng: latlng.lng },
      };
    } catch {
      return null;
    }
  }

  private async queryDirect(latlng: L.LatLng, layer: GeoLayer, queryLayer: string, wmsUrl: string): Promise<FeatureInfoResult | null> {
    const size = this.map.getSize();
    const bounds = this.map.getBounds();
    const point = this.map.latLngToContainerPoint(latlng);

    const base: Record<string, string> = {
      service: 'WMS',
      version: '1.1.1',
      request: 'GetFeatureInfo',
      layers: queryLayer,
      query_layers: queryLayer,
      feature_count: '3',
      x: Math.round(point.x).toString(),
      y: Math.round(point.y).toString(),
      width: size.x.toString(),
      height: size.y.toString(),
      srs: 'EPSG:4326',
      bbox: `${bounds.getWest()},${bounds.getSouth()},${bounds.getEast()},${bounds.getNorth()}`,
    };

    const formats = this.options.formats ?? ['application/json'];
    for (const fmt of formats) {
      try {
        const params = new URLSearchParams({ ...base, info_format: fmt });
        const resp = await fetch(`${wmsUrl}?${params}`, {
          signal: AbortSignal.timeout(this.options.timeout ?? 5000),
        });
        if (!resp.ok) continue;
        const text = await resp.text();
        if (!text || text.length < 10) continue;

        const props = this.parseResponse(text);
        if (props && Object.keys(props).length > 0) {
          return {
            layerName: layer.name,
            attribution: layer.attribution || '',
            properties: props,
            latlng: { lat: latlng.lat, lng: latlng.lng },
          };
        }
      } catch { continue; }
    }
    return null;
  }

  private parseResponse(text: string): Record<string, string> | null {
    const trimmed = text.trim();
    if (trimmed.includes('ServiceException') || trimmed.includes('ExceptionReport')) return null;

    if (trimmed.startsWith('{')) {
      try {
        const data = JSON.parse(trimmed);
        const features = data.features || [];
        if (features.length > 0) return this.cleanProps(features[0].properties || {});
      } catch { /* not JSON */ }
    }

    if (trimmed.startsWith('<') && trimmed.includes('<th>') && trimmed.includes('<td>')) {
      return this.parseHtmlTable(trimmed);
    }

    if (trimmed.startsWith('<') && !trimmed.includes('ServiceException')) {
      return this.parseXml(trimmed);
    }

    return null;
  }

  private parseHtmlTable(html: string): Record<string, string> | null {
    const props: Record<string, string> = {};
    const rows = html.split('<tr>');
    for (const row of rows) {
      if (!row.includes('<th>') || !row.includes('<td>')) continue;
      const key = this.extractTag(row, 'th');
      const value = this.extractTag(row, 'td');
      if (key && value && !value.includes('null')) {
        props[key] = value;
      }
    }
    return Object.keys(props).length > 0 ? this.cleanProps(props) : null;
  }

  private parseXml(xml: string): Record<string, string> | null {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(xml, 'text/xml');
      const members = doc.querySelectorAll('featureMember > *, featureMembers > *');
      if (members.length === 0) return null;

      const feature = members[0];
      const props: Record<string, string> = {};
      for (let i = 0; i < feature.children.length; i++) {
        const child = feature.children[i];
        const tag = child.localName || child.tagName.split(':').pop() || '';
        const value = (child.textContent || '').trim();
        if (!value || tag === 'boundedBy' || tag === 'the_geom' || tag === 'geom') continue;
        props[tag] = value;
      }
      return Object.keys(props).length > 0 ? this.cleanProps(props) : null;
    } catch {
      return null;
    }
  }

  private extractTag(html: string, tag: string): string | null {
    const start = html.indexOf(`<${tag}>`);
    if (start < 0) return null;
    const contentStart = start + tag.length + 2;
    const end = html.indexOf(`</${tag}>`, contentStart);
    if (end < 0) return null;
    return html.substring(contentStart, end).replace(/<[^>]*>/g, '').trim();
  }

  private cleanProps(raw: Record<string, unknown>): Record<string, string> {
    const skip = new Set(['shape', 'shape.area', 'shape.len', 'shape_area', 'shape_length', 'shape_leng', 'objectid', 'fid', 'gid', 'globalid', 'the_geom', 'geom', 'boundedby']);
    const clean: Record<string, string> = {};
    for (const [key, value] of Object.entries(raw)) {
      if (value == null || value === '' || value === 'Null' || value === 'null') continue;
      if (skip.has(key.toLowerCase())) continue;
      const label = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      clean[label] = String(value);
    }
    return clean;
  }
}
