# Geo Toolkit

Lightweight TypeScript library for geospatial maps. WMS layer management, GetFeatureInfo, GeoJSON loading, Peruvian national services (SERNANP, SERFOR, INGEMMET, MIDAGRI, IGN, MINCETUR), geocoding, map themes, and export utilities. Built on Leaflet, compatible with Angular 7+.

Libreria TypeScript ligera para mapas geoespaciales. Gestion de capas WMS, GetFeatureInfo, carga de GeoJSON, servicios nacionales peruanos (SERNANP, SERFOR, INGEMMET, MIDAGRI, IGN, MINCETUR), geocodificacion, temas de mapa y utilidades de exportacion. Construida sobre Leaflet, compatible con Angular 7+.

---

## Installation / Instalacion

```bash
npm install @coderesolutions/geo-toolkit
npm install -D @types/leaflet
```

## Modules / Modulos

| Module | Description / Descripcion |
|--------|--------------------------|
| `leaflet` | WMS manager, GetFeatureInfo, GeoJSON loader, popup builder, tile providers |
| `peru` | Preconfigured layers from 6 Peruvian national agencies / Capas preconfiguradas de 6 entidades nacionales |
| `search` | Geocoding (Nominatim), reverse geocoding, distance calculation |
| `theme` | Light/dark map themes with auto-switching |
| `export` | Map capture to PNG/JPEG, canvas utilities |

---

## Quick Start / Inicio Rapido

### WMS Layer Management / Gestion de Capas WMS

```typescript
import { WmsManager, GeoLayer } from '@coderesolutions/geo-toolkit';

const map = L.map('map').setView([-3.55, -80.44], 10);
const wms = new WmsManager(map, 'overlayPane', {
  tileSize: 512,
  updateWhenIdle: true,
});

const layer: GeoLayer = {
  id: 'limites',
  name: 'Department Boundaries',
  type: 'wms',
  url: 'https://your-geoserver.com/wms',
  layers: 'workspace:layer_name',
  visible: true,
  opacity: 0.8,
  attribution: 'GeoServer',
  bounds: [[-4.35, -81.15], [-3.30, -79.90]],
};

wms.add(layer);
wms.setOpacity('limites', 0.5);
wms.remove('limites');
```

### GetFeatureInfo (Click on Features) / Consulta de Atributos

```typescript
import { FeatureInfo } from '@coderesolutions/geo-toolkit';

const fi = new FeatureInfo(map, {
  proxyUrl: '/api/geoserver/featureinfo',
  timeout: 5000,
  buffer: 12,
});

map.on('click', async (e) => {
  const result = await fi.query(e.latlng, layer);
  if (result) {
    console.log(result.properties);
    // { "Nombre": "TUMBES", "Area": "4675.36", ... }
  }
});

// Query all visible layers at once
const result = await fi.queryAll(e.latlng, wms.getVisibleLayers());
```

### GeoJSON Loader / Carga de GeoJSON

```typescript
import { GeoJsonLoader } from '@coderesolutions/geo-toolkit';

const loader = new GeoJsonLoader(map, {
  paneName: 'overlayPane',
  defaultStyle: { color: '#1e293b', weight: 2.5 },
  onFeatureClick: (feature, latlng) => {
    console.log('Clicked:', feature.properties);
  },
});

await loader.load(layer, '/api/geoserver/geojson/workspace/layer');
loader.setOpacity('layer-id', 0.6);
loader.remove('layer-id');
```

### Popup Builder / Constructor de Popups

```typescript
import { PopupBuilder, POPUP_THEME_DARK } from '@coderesolutions/geo-toolkit';

const popup = new PopupBuilder(POPUP_THEME_DARK);

map.on('click', async (e) => {
  const result = await fi.query(e.latlng, layer);
  if (result) {
    popup.showOnMap(map, e.latlng, result);
  }
});
```

### Peruvian National Services / Servicios Nacionales Peruanos

```typescript
import { createNationalLayers } from '@coderesolutions/geo-toolkit';

// Get all layers filtered to Tumbes department
const groups = createNationalLayers('TUMBES');

// groups contains 6 agencies with ~20 preconfigured WMS layers:
// SERNANP: ANP, Buffer Zones, Regional Conservation
// SERFOR: Forests, Concessions, Fragile Ecosystems, Fires
// INGEMMET: Mining Cadastre
// MIDAGRI: Rural Properties, Native Communities
// IGN/IDEP: Boundaries, Hydrography, Population Centers
// MINCETUR: Hotels, Restaurants, Travel Agencies, Tourism Resources

// Add all layers from one group
for (const layer of groups[0].layers) {
  wms.add(layer);
}

// Works with any department
const piuraLayers = createNationalLayers('PIURA');
const cuscoLayers = createNationalLayers('CUSCO');

// Without department filter (full Peru coverage)
const allPeru = createNationalLayers();
```

### Available Departments / Departamentos Disponibles

```
AMAZONAS, ANCASH, APURIMAC, AREQUIPA, AYACUCHO,
CAJAMARCA, CALLAO, CUSCO, HUANCAVELICA, HUANUCO,
ICA, JUNIN, LA_LIBERTAD, LAMBAYEQUE, LIMA,
LORETO, MADRE_DE_DIOS, MOQUEGUA, PASCO, PIURA,
PUNO, SAN_MARTIN, TACNA, TUMBES, UCAYALI
```

### Ubigeo Utilities / Utilidades de Ubigeo

```typescript
import { getDepartmentName, getDepartmentCode, parseUbigeo } from '@coderesolutions/geo-toolkit';

getDepartmentName('24');           // 'TUMBES'
getDepartmentCode('TUMBES');       // '24'
parseUbigeo('240101');
// { code: '240101', department: 'TUMBES', province: '2401', district: '240101' }
```

### Geocoding / Geocodificacion

```typescript
import { geocode, reverseGeocode } from '@coderesolutions/geo-toolkit';

const results = await geocode('Punta Sal, Tumbes', { limit: 3 });
// [{ name: 'Punta Sal', lat: -3.979, lng: -80.974, ... }]

const place = await reverseGeocode(-3.5559, -80.4426);
// { name: 'Tumbes', displayName: 'Tumbes, Peru', ... }
```

### Distance Calculation / Calculo de Distancias

```typescript
import { haversineDistance, formatDistance } from '@coderesolutions/geo-toolkit';

const km = haversineDistance(-3.5559, -80.4426, -3.6727, -80.6536);
formatDistance(km); // '25 km'
```

### Map Themes / Temas de Mapa

```typescript
import { MapTheme } from '@coderesolutions/geo-toolkit';

const theme = new MapTheme(map, 'basePane', 'labelsPane');
theme.setMode('dark');
theme.setMode('auto'); // switches at 19:00/07:00
theme.isDark();        // true/false
```

### Map Export / Exportacion de Mapa

```typescript
import { captureMapElement, downloadCanvas } from '@coderesolutions/geo-toolkit';

const canvas = await captureMapElement(document.getElementById('map')!, 2);
downloadCanvas(canvas, 'map-tumbes', { format: 'png' });
```

### Tile Providers / Proveedores de Tiles

```typescript
import { getTileProvider, getAllTileProviders, TILE_PROVIDERS } from '@coderesolutions/geo-toolkit';

const cartodb = getTileProvider('cartodb-positron');
// { id: 'cartodb-positron', url: 'https://...', attribution: '...' }

// Available: cartodb-positron, cartodb-dark, cartodb-voyager,
// osm, google-satellite, esri-satellite, opentopomap,
// cartodb-labels-light, cartodb-labels-dark
```

---

## Compatibility / Compatibilidad

| Angular | Status |
|---------|--------|
| 7.x - 12.x | Compatible (ES2015 target) |
| 13.x - 16.x | Compatible |
| 17.x - 19.x | Compatible (standalone components) |

Peer dependencies: `leaflet >= 1.4.0`

Optional: `html2canvas` (only for export module)

---

## Project Structure / Estructura del Proyecto

```
src/
  lib/
    leaflet/          WMS, GeoJSON, FeatureInfo, popups, tiles
    peru/             National layers, ubigeo, department bounds
    search/           Geocoding, distance calculation
    theme/            Map light/dark themes
    export/           Map capture and download
  public-api/
    index.ts          Main entry point
```

---

## License / Licencia

MIT License - Copyright (c) 2025-present Jhafet Canepa

See [LICENSE](LICENSE) for details.
