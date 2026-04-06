import { getDepartmentName, getDepartmentCode, parseUbigeo, DEPARTMENTS } from '../peru/ubigeo';

describe('Ubigeo', () => {
  it('should have 25 departments', () => {
    expect(Object.keys(DEPARTMENTS)).toHaveLength(25);
  });

  it('getDepartmentName should return correct name', () => {
    expect(getDepartmentName('24')).toBe('TUMBES');
    expect(getDepartmentName('20')).toBe('PIURA');
    expect(getDepartmentName('15')).toBe('LIMA');
    expect(getDepartmentName('08')).toBe('CUSCO');
  });

  it('getDepartmentName should work with longer codes', () => {
    expect(getDepartmentName('240101')).toBe('TUMBES');
    expect(getDepartmentName('2401')).toBe('TUMBES');
  });

  it('getDepartmentName should return undefined for invalid code', () => {
    expect(getDepartmentName('99')).toBeUndefined();
  });

  it('getDepartmentCode should return correct code', () => {
    expect(getDepartmentCode('TUMBES')).toBe('24');
    expect(getDepartmentCode('LIMA')).toBe('15');
  });

  it('getDepartmentCode should be case insensitive', () => {
    expect(getDepartmentCode('tumbes')).toBe('24');
    expect(getDepartmentCode('Tumbes')).toBe('24');
  });

  it('getDepartmentCode should handle underscores', () => {
    expect(getDepartmentCode('LA_LIBERTAD')).toBe('13');
    expect(getDepartmentCode('MADRE_DE_DIOS')).toBe('17');
  });

  it('parseUbigeo should parse full district code', () => {
    const result = parseUbigeo('240101');
    expect(result.code).toBe('240101');
    expect(result.department).toBe('TUMBES');
    expect(result.province).toBe('2401');
    expect(result.district).toBe('240101');
  });

  it('parseUbigeo should handle department-only code', () => {
    const result = parseUbigeo('24');
    expect(result.department).toBe('TUMBES');
    expect(result.province).toBeUndefined();
    expect(result.district).toBeUndefined();
  });
});
