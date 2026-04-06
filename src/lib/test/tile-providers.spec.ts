import { getTileProvider, getAllTileProviders, TILE_PROVIDERS } from '../leaflet/tile-providers';

describe('TileProviders', () => {
  it('should have at least 5 providers', () => {
    expect(Object.keys(TILE_PROVIDERS).length).toBeGreaterThanOrEqual(5);
  });

  it('should return provider by id', () => {
    const provider = getTileProvider('cartodb-positron');
    expect(provider).toBeDefined();
    expect(provider!.url).toContain('cartocdn.com');
    expect(provider!.attribution).toContain('CARTO');
  });

  it('should return undefined for unknown id', () => {
    expect(getTileProvider('nonexistent')).toBeUndefined();
  });

  it('should return all providers as array', () => {
    const all = getAllTileProviders();
    expect(Array.isArray(all)).toBe(true);
    expect(all.length).toBe(Object.keys(TILE_PROVIDERS).length);
  });

  it('each provider should have required fields', () => {
    for (const provider of getAllTileProviders()) {
      expect(provider.id).toBeTruthy();
      expect(provider.name).toBeTruthy();
      expect(provider.url).toContain('{z}');
      expect(provider.attribution).toBeTruthy();
    }
  });

  it('should have dark variants', () => {
    const dark = getAllTileProviders().filter((p: any) => p.dark);
    expect(dark.length).toBeGreaterThanOrEqual(1);
  });

  it('google-satellite should have high maxNativeZoom', () => {
    const google = getTileProvider('google-satellite');
    expect(google!.maxNativeZoom).toBeGreaterThanOrEqual(20);
  });
});
