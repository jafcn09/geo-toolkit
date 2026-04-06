import { createNationalLayers, DEPARTMENT_BOUNDS } from '../peru/national-layers';

describe('NationalLayers', () => {
  it('should create 6 groups', () => {
    const groups = createNationalLayers();
    expect(groups).toHaveLength(6);
  });

  it('groups should have correct entities', () => {
    const groups = createNationalLayers();
    const entities = groups.map((g: any) => g.entity);
    expect(entities).toContain('SERNANP');
    expect(entities).toContain('SERFOR');
    expect(entities).toContain('INGEMMET');
    expect(entities).toContain('MIDAGRI');
    expect(entities).toContain('IGN / IDEP');
    expect(entities).toContain('MINCETUR');
  });

  it('all layers should have WMS url', () => {
    const groups = createNationalLayers();
    for (const group of groups) {
      for (const layer of group.layers) {
        expect(layer.url).toBeTruthy();
        expect(layer.type).toBe('wms');
        expect(layer.layers).toBeTruthy();
      }
    }
  });

  it('layers should start as not visible', () => {
    const groups = createNationalLayers();
    for (const group of groups) {
      for (const layer of group.layers) {
        expect(layer.visible).toBe(false);
      }
    }
  });

  it('should filter by department bounds', () => {
    const groups = createNationalLayers('TUMBES');
    for (const group of groups) {
      for (const layer of group.layers) {
        expect(layer.bounds).toBeDefined();
        expect(layer.bounds![0][0]).toBeCloseTo(-4.35, 1);
        expect(layer.bounds![1][1]).toBeCloseTo(-79.90, 1);
      }
    }
  });

  it('should work without department filter', () => {
    const groups = createNationalLayers();
    const firstLayer = groups[0].layers[0];
    expect(firstLayer.bounds).toBeUndefined();
  });

  it('DEPARTMENT_BOUNDS should have 25 departments', () => {
    expect(Object.keys(DEPARTMENT_BOUNDS)).toHaveLength(25);
  });

  it('each department bound should have valid coordinates', () => {
    for (const [_dept, bounds] of Object.entries(DEPARTMENT_BOUNDS) as [string, number[][]][]) { 
      expect(bounds[0][0]).toBeLessThan(bounds[1][0]);
      expect(bounds[0][1]).toBeLessThan(bounds[1][1]);
      expect(bounds[0][0]).toBeGreaterThan(-20);
      expect(bounds[1][0]).toBeLessThan(0);
    }
  });

  it('SERNANP should have 3 layers', () => {
    const groups = createNationalLayers();
    const sernanp = groups.find((g: any) => g.id === 'sernanp');
    expect(sernanp!.layers).toHaveLength(3);
  });

  it('MINCETUR should have tourism layers', () => {
    const groups = createNationalLayers();
    const mincetur = groups.find((g: any) => g.id === 'mincetur');
    expect(mincetur!.layers.length).toBeGreaterThanOrEqual(4);
    const names = mincetur!.layers.map((l: any) => l.name);
    expect(names).toContain('Hospedajes');
    expect(names).toContain('Restaurantes');
  });

  it('different departments should have different bounds', () => {
    const tumbes = createNationalLayers('TUMBES');
    const piura = createNationalLayers('PIURA');
    expect(tumbes[0].layers[0].bounds).not.toEqual(piura[0].layers[0].bounds);
  });
});
