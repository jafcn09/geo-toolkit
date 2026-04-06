import { GeoLayer, GeoLayerGroup } from '../export/interfaces';

export type PeruDepartment =
  | 'AMAZONAS' | 'ANCASH' | 'APURIMAC' | 'AREQUIPA' | 'AYACUCHO'
  | 'CAJAMARCA' | 'CALLAO' | 'CUSCO' | 'HUANCAVELICA' | 'HUANUCO'
  | 'ICA' | 'JUNIN' | 'LA_LIBERTAD' | 'LAMBAYEQUE' | 'LIMA'
  | 'LORETO' | 'MADRE_DE_DIOS' | 'MOQUEGUA' | 'PASCO' | 'PIURA'
  | 'PUNO' | 'SAN_MARTIN' | 'TACNA' | 'TUMBES' | 'UCAYALI';

export const DEPARTMENT_BOUNDS: Record<PeruDepartment, [[number, number], [number, number]]> = {
  TUMBES:       [[-4.35, -81.15], [-3.30, -79.90]],
  PIURA:        [[-5.80, -81.30], [-4.05, -79.20]],
  LAMBAYEQUE:   [[-7.00, -80.60], [-5.70, -79.10]],
  CAJAMARCA:    [[-7.80, -79.50], [-4.60, -77.70]],
  AMAZONAS:     [[-6.60, -78.70], [-2.90, -77.00]],
  SAN_MARTIN:   [[-8.70, -77.70], [-5.40, -75.50]],
  LORETO:       [[-8.70, -77.80], [-0.05, -69.90]],
  LA_LIBERTAD:  [[-8.80, -79.80], [-6.90, -76.80]],
  ANCASH:       [[-10.30, -78.70], [-8.00, -76.80]],
  HUANUCO:      [[-10.50, -77.10], [-8.30, -74.90]],
  PASCO:        [[-11.00, -76.80], [-9.60, -74.60]],
  UCAYALI:      [[-11.50, -75.60], [-7.10, -70.70]],
  JUNIN:        [[-12.60, -76.70], [-10.60, -73.70]],
  LIMA:         [[-13.40, -77.20], [-10.30, -75.70]],
  CALLAO:       [[-12.10, -77.20], [-11.90, -77.00]],
  ICA:          [[-15.50, -76.40], [-13.00, -74.80]],
  HUANCAVELICA: [[-13.90, -76.10], [-11.80, -74.30]],
  AYACUCHO:     [[-15.50, -75.10], [-12.60, -73.00]],
  CUSCO:        [[-14.70, -73.00], [-11.10, -70.40]],
  APURIMAC:     [[-14.90, -73.90], [-13.10, -72.00]],
  MADRE_DE_DIOS:[[-13.40, -72.40], [-9.90, -68.60]],
  AREQUIPA:     [[-17.20, -75.10], [-14.60, -71.00]],
  MOQUEGUA:     [[-17.70, -71.60], [-15.90, -70.00]],
  TACNA:        [[-18.40, -71.20], [-16.80, -69.40]],
  PUNO:         [[-17.40, -71.10], [-13.30, -68.50]],
};

export function createNationalLayers(department?: PeruDepartment): GeoLayerGroup[] {
  const bounds = department ? DEPARTMENT_BOUNDS[department] : undefined;

  const withBounds = (layer: GeoLayer): GeoLayer => ({
    ...layer,
    bounds: bounds || layer.bounds,
  });

  return [
    {
      id: 'sernanp',
      name: 'Areas Naturales Protegidas',
      entity: 'SERNANP',
      layers: [
        withBounds({ id: 'ns-anp-nacionales', name: 'ANP Nacionales', type: 'wms', url: 'https://geospatial.sernanp.gob.pe/arcgis_server/services/sernanp_visor/areas_naturales_protegidas/MapServer/WMSServer', layers: '0,1,2,3,4,5,6,7,8,9', visible: false, opacity: 0.7, attribution: 'SERNANP', queryable: true }),
        withBounds({ id: 'ns-anp-amortiguamiento', name: 'Zonas de Amortiguamiento', type: 'wms', url: 'https://geospatial.sernanp.gob.pe/arcgis_server/services/gestion_de_anp/peru_sernanp_021401/MapServer/WMSServer', layers: '0', visible: false, opacity: 0.6, attribution: 'SERNANP', queryable: true }),
        withBounds({ id: 'ns-acr', name: 'Conservacion Regional', type: 'wms', url: 'https://geospatial.sernanp.gob.pe/arcgis_server/services/sernanp_visor/areas_conservacion_regional/MapServer/WMSServer', layers: '0', visible: false, opacity: 0.7, attribution: 'SERNANP', queryable: true }),
      ],
    },
    {
      id: 'serfor',
      name: 'Recursos Forestales',
      entity: 'SERFOR',
      layers: [
        withBounds({ id: 'ns-ordenamiento-forestal', name: 'Ordenamiento Forestal', type: 'wms', url: 'https://geo.serfor.gob.pe/geoservicios/services/Servicios_OGC/Ordenamiento_Forestal/MapServer/WMSServer', layers: '0,1,2', visible: false, opacity: 0.7, attribution: 'SERFOR', queryable: true }),
        withBounds({ id: 'ns-concesiones-forestales', name: 'Concesiones y Permisos', type: 'wms', url: 'https://geo.serfor.gob.pe/geoservicios/services/Servicios_OGC/Modalidad_Acceso/MapServer/WMSServer', layers: '0,1,2,3,4,5,6', visible: false, opacity: 0.7, attribution: 'SERFOR', queryable: true }),
        withBounds({ id: 'ns-ecosistemas-fragiles', name: 'Ecosistemas Fragiles', type: 'wms', url: 'https://geo.serfor.gob.pe/geoservicios/services/Servicios_OGC/Inventario_Forestal/MapServer/WMSServer', layers: '0,1', visible: false, opacity: 0.7, attribution: 'SERFOR', queryable: true }),
        withBounds({ id: 'ns-incendios-forestales', name: 'Incendios y Focos de Calor', type: 'wms', url: 'https://geo.serfor.gob.pe/geoservicios/services/Servicios_OGC/Unidad_Monitoreo_Satelital/MapServer/WMSServer', layers: '0,1', visible: false, opacity: 0.8, attribution: 'SERFOR', queryable: true }),
      ],
    },
    {
      id: 'ingemmet',
      name: 'Catastro Minero',
      entity: 'INGEMMET',
      layers: [
        withBounds({ id: 'ns-catastro-minero', name: 'Derechos Mineros', type: 'wms', url: 'https://geocatmin.ingemmet.gob.pe/arcgis/services/SERV_CATASTRO_MINERO_WGS84/MapServer/WMSServer', layers: '2', visible: false, opacity: 0.7, attribution: 'INGEMMET', queryable: true }),
      ],
    },
    {
      id: 'midagri',
      name: 'Catastro Rural',
      entity: 'MIDAGRI',
      layers: [
        withBounds({ id: 'ns-predios-rurales', name: 'Predios Rurales', type: 'wms', url: 'https://georural.midagri.gob.pe/geoservicios/services/servicios_ogc/Catastro_Rural/MapServer/WMSServer', layers: '2', visible: false, opacity: 0.7, attribution: 'MIDAGRI - SICAR', queryable: true }),
        withBounds({ id: 'ns-comunidades-nativas', name: 'Comunidades Nativas', type: 'wms', url: 'https://georural.midagri.gob.pe/geoservicios/services/servicios_ogc/Catastro_Rural/MapServer/WMSServer', layers: '0', visible: false, opacity: 0.7, attribution: 'MIDAGRI - SICAR', queryable: true }),
        withBounds({ id: 'ns-comunidades-campesinas', name: 'Comunidades Campesinas', type: 'wms', url: 'https://georural.midagri.gob.pe/geoservicios/services/servicios_ogc/Catastro_Rural/MapServer/WMSServer', layers: '1', visible: false, opacity: 0.7, attribution: 'MIDAGRI - SICAR', queryable: true }),
      ],
    },
    {
      id: 'ign',
      name: 'Carta Nacional',
      entity: 'IGN / IDEP',
      layers: [
        withBounds({ id: 'ns-limites-politicos', name: 'Limites Politicos', type: 'wms', url: 'https://www.idep.gob.pe/geoportal/services/DATOS_GEOESPACIALES/LÍMITES/MapServer/WMSServer', layers: '1,2,3', visible: false, opacity: 0.7, attribution: 'IGN - IDEP', queryable: true }),
        withBounds({ id: 'ns-hidrografia', name: 'Hidrografia', type: 'wms', url: 'https://www.idep.gob.pe/geoportal/services/SERVICIOS_IGN/HIDROGRAFIA_100K/MapServer/WMSServer', layers: '0,1,2', visible: false, opacity: 0.7, attribution: 'IGN - IDEP', queryable: true }),
        withBounds({ id: 'ns-centros-poblados', name: 'Centros Poblados', type: 'wms', url: 'https://www.idep.gob.pe/geoportal/services/DATOS_GEOESPACIALES/CENTROS_POBLADOS/MapServer/WMSServer', layers: '0,1,2,3', visible: false, opacity: 0.8, attribution: 'IGN - IDEP', queryable: true }),
      ],
    },
    {
      id: 'mincetur',
      name: 'Turismo',
      entity: 'MINCETUR',
      layers: [
        withBounds({ id: 'ns-hospedajes', name: 'Hospedajes', type: 'wms', url: 'https://sigmincetur.mincetur.gob.pe/geoserver/wms', layers: 'ProduSig:SIG1GEOEH', visible: false, opacity: 0.8, attribution: 'MINCETUR', queryable: true }),
        withBounds({ id: 'ns-restaurantes', name: 'Restaurantes', type: 'wms', url: 'https://sigmincetur.mincetur.gob.pe/geoserver/wms', layers: 'ProduSig:SIG1GEORE', visible: false, opacity: 0.8, attribution: 'MINCETUR', queryable: true }),
        withBounds({ id: 'ns-agencias-viaje', name: 'Agencias de Viaje', type: 'wms', url: 'https://sigmincetur.mincetur.gob.pe/geoserver/wms', layers: 'ProduSig:SIG1GEOAV', visible: false, opacity: 0.8, attribution: 'MINCETUR', queryable: true }),
        withBounds({ id: 'ns-recursos-turisticos', name: 'Recursos Turisticos', type: 'wms', url: 'https://sigmincetur.mincetur.gob.pe/geoserver/wms', layers: 'ProduSig:SIG1GEOIRT', visible: false, opacity: 0.8, attribution: 'MINCETUR', queryable: true }),
      ],
    },
  ];
}
