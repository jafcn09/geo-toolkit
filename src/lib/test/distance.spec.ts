import { haversineDistance, approximateDistance, formatDistance } from '../search/distance';

describe('Distance', () => {
  it('haversine should calculate Tumbes to Zorritos', () => {
    const km = haversineDistance(-3.5559, -80.4426, -3.6727, -80.6536);
    expect(km).toBeGreaterThan(20);
    expect(km).toBeLessThan(30);
  });

  it('haversine should return 0 for same point', () => {
    const km = haversineDistance(-3.5559, -80.4426, -3.5559, -80.4426);
    expect(km).toBeCloseTo(0, 5);
  });

  it('approximate should be close to haversine for short distances', () => {
    const h = haversineDistance(-3.55, -80.44, -3.67, -80.65);
    const a = approximateDistance(-3.55, -80.44, -3.67, -80.65);
    expect(Math.abs(h - a)).toBeLessThan(2);
  });

  it('formatDistance should show meters for <1km', () => {
    expect(formatDistance(0.5)).toBe('500 m');
    expect(formatDistance(0.123)).toBe('123 m');
  });

  it('formatDistance should show 1 decimal for <10km', () => {
    expect(formatDistance(5.67)).toBe('5.7 km');
    expect(formatDistance(1.234)).toBe('1.2 km');
  });

  it('formatDistance should show whole km for >=10km', () => {
    expect(formatDistance(15.7)).toBe('16 km');
    expect(formatDistance(100.3)).toBe('100 km');
  });

  it('haversine should handle international distances', () => {
    const km = haversineDistance(-12.046, -77.043, 40.712, -74.006);
    expect(km).toBeGreaterThan(5800);
    expect(km).toBeLessThan(6200);
  });
});
