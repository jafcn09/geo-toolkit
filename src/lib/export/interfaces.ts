export interface GeoLayer {
  id: string;
  name: string;
  type: 'wms' | 'tile' | 'geojson';
  url?: string;
  layers?: string;
  fallbackUrls?: string[];
  visible: boolean;
  opacity: number;
  attribution?: string;
  bounds?: [[number, number], [number, number]];
  minZoom?: number;
  maxZoom?: number;
  queryable?: boolean;
  metadata?: Record<string, unknown>;
}

export interface GeoLayerGroup {
  id: string;
  name: string;
  entity?: string;
  layers: GeoLayer[];
  expanded?: boolean;
}

export interface TileProviderConfig {
  id: string;
  name: string;
  url: string;
  attribution: string;
  maxNativeZoom?: number;
  dark?: boolean;
}

export interface FeatureInfoResult {
  layerName: string;
  attribution: string;
  properties: Record<string, string>;
  latlng?: { lat: number; lng: number };
}

export interface FeatureInfoOptions {
  proxyUrl?: string;
  timeout?: number;
  formats?: string[];
  buffer?: number;
}

export interface WmsOptions {
  tileSize?: number;
  updateWhenZooming?: boolean;
  updateWhenIdle?: boolean;
  keepBuffer?: number;
  maxRetries?: number;
  errorThreshold?: number;
}

export interface ExportOptions {
  format: 'png' | 'jpeg' | 'pdf';
  scale?: number;
  quality?: number;
  title?: string;
  subtitle?: string;
  author?: string;
  includeControls?: boolean;
  includeLegend?: boolean;
}

export type ThemeMode = 'light' | 'dark' | 'auto';

export interface MapThemeConfig {
  lightTileUrl: string;
  darkTileUrl: string;
  lightLabelsUrl?: string;
  darkLabelsUrl?: string;
  autoSwitchHour?: { darkStart: number; darkEnd: number };
}


export interface GeoJsonStyle {
  color?: string;
  weight?: number;
  opacity?: number;
  fillColor?: string;
  fillOpacity?: number;
}

export interface GeoJsonLoaderOptions {
  paneName?: string;
  defaultStyle?: GeoJsonStyle;
  pointRadius?: number;
  onFeatureClick?: (feature: GeoJSON.Feature, latlng: L.LatLng) => void;
}

export interface GeocodeResult {
  name: string;
  lat: number;
  lng: number;
  type: string;
  displayName: string;
  boundingBox?: [[number, number], [number, number]];
}

export interface GeocodeOptions {
  limit?: number;
  countryCode?: string;
  viewbox?: string;
  bounded?: boolean;
}

export interface PopupTheme {
  bg: string;
  text: string;
  textSecondary: string;
  border: string;
  accent: string;
}
export interface Ubigeo {
  code: string;
  department: string;
  province?: string;
  district?: string;
}