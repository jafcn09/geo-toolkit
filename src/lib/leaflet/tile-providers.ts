import { TileProviderConfig } from '../export/interfaces';

export const TILE_PROVIDERS: Record<string, TileProviderConfig> = {
  'cartodb-positron': {
    id: 'cartodb-positron',
    name: 'Vector',
    url: 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png',
    attribution: 'OpenStreetMap contributors, CARTO',
    maxNativeZoom: 19,
  },
  'cartodb-dark': {
    id: 'cartodb-dark',
    name: 'Dark',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: 'OpenStreetMap contributors, CARTO',
    maxNativeZoom: 19,
    dark: true,
  },
  'cartodb-voyager': {
    id: 'cartodb-voyager',
    name: 'Voyager',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: 'OpenStreetMap contributors, CARTO',
    maxNativeZoom: 19,
  },
  'osm': {
    id: 'osm',
    name: 'OpenStreetMap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: 'OpenStreetMap contributors',
    maxNativeZoom: 19,
  },
  'google-satellite': {
    id: 'google-satellite',
    name: 'Satellite',
    url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
    attribution: 'Google',
    maxNativeZoom: 20,
  },
  'esri-satellite': {
    id: 'esri-satellite',
    name: 'ESRI Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Esri, Maxar, Earthstar Geographics',
    maxNativeZoom: 18,
  },
  'opentopomap': {
    id: 'opentopomap',
    name: 'Topographic',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: 'OpenTopoMap',
    maxNativeZoom: 17,
  },
  'cartodb-labels-light': {
    id: 'cartodb-labels-light',
    name: 'Labels (Light)',
    url: 'https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png',
    attribution: 'CARTO',
    maxNativeZoom: 19,
  },
  'cartodb-labels-dark': {
    id: 'cartodb-labels-dark',
    name: 'Labels (Dark)',
    url: 'https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png',
    attribution: 'CARTO',
    maxNativeZoom: 19,
    dark: true,
  },
};

export function getTileProvider(id: string): TileProviderConfig | undefined {
  return TILE_PROVIDERS[id];
}

export function getAllTileProviders(): TileProviderConfig[] {
  return Object.values(TILE_PROVIDERS);
}
