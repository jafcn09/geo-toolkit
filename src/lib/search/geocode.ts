import { GeocodeOptions, GeocodeResult } from "@geo-toolkit/leaflet";


const DEFAULT_OPTIONS: GeocodeOptions = {
  limit: 5,
  countryCode: 'pe',
};

export async function geocode(query: string, options?: GeocodeOptions): Promise<GeocodeResult[]> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const params = new URLSearchParams({
    q: query,
    format: 'json',
    limit: (opts.limit ?? 5).toString(),
    countrycodes: opts.countryCode || 'pe',
    addressdetails: '1',
  });

  if (opts.viewbox) params.set('viewbox', opts.viewbox);
  if (opts.bounded) params.set('bounded', '1');

  try {
    const resp = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
      headers: { 'User-Agent': 'GeoToolkit/1.0' },
      signal: AbortSignal.timeout(8000),
    });
    if (!resp.ok) return [];

    const data = await resp.json();
    return data.map((item: Record<string, unknown>) => ({
      name: item.name as string || '',
      lat: parseFloat(item.lat as string),
      lng: parseFloat(item.lon as string),
      type: item.type as string || 'place',
      displayName: item.display_name as string || '',
      boundingBox: item.boundingbox ? [
        [parseFloat((item.boundingbox as string[])[0]), parseFloat((item.boundingbox as string[])[2])],
        [parseFloat((item.boundingbox as string[])[1]), parseFloat((item.boundingbox as string[])[3])],
      ] as [[number, number], [number, number]] : undefined,
    }));
  } catch {
    return [];
  }
}

export async function reverseGeocode(lat: number, lng: number): Promise<GeocodeResult | null> {
  try {
    const params = new URLSearchParams({
      lat: lat.toString(),
      lon: lng.toString(),
      format: 'json',
      zoom: '18',
    });

    const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?${params}`, {
      headers: { 'User-Agent': 'GeoToolkit/1.0' },
      signal: AbortSignal.timeout(8000),
    });
    if (!resp.ok) return null;

    const item = await resp.json();
    return {
      name: item.name || '',
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      type: item.type || 'place',
      displayName: item.display_name || '',
    };
  } catch {
    return null;
  }
}
