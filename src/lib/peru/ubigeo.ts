import { Ubigeo } from "@geo-toolkit/leaflet";


export const DEPARTMENTS: Record<string, string> = {
  '01': 'AMAZONAS', '02': 'ANCASH', '03': 'APURIMAC', '04': 'AREQUIPA',
  '05': 'AYACUCHO', '06': 'CAJAMARCA', '07': 'CALLAO', '08': 'CUSCO',
  '09': 'HUANCAVELICA', '10': 'HUANUCO', '11': 'ICA', '12': 'JUNIN',
  '13': 'LA LIBERTAD', '14': 'LAMBAYEQUE', '15': 'LIMA', '16': 'LORETO',
  '17': 'MADRE DE DIOS', '18': 'MOQUEGUA', '19': 'PASCO', '20': 'PIURA',
  '21': 'PUNO', '22': 'SAN MARTIN', '23': 'TACNA', '24': 'TUMBES',
  '25': 'UCAYALI',
};

export function getDepartmentName(code: string): string | undefined {
  return DEPARTMENTS[code.substring(0, 2)];
}

export function getDepartmentCode(name: string): string | undefined {
  const normalized = name.toUpperCase().replace(/_/g, ' ');
  return Object.entries(DEPARTMENTS).find(([, v]) => v === normalized)?.[0];
}

export function parseUbigeo(code: string): Ubigeo {
  return {
    code,
    department: DEPARTMENTS[code.substring(0, 2)] || code.substring(0, 2),
    province: code.length >= 4 ? code.substring(0, 4) : undefined,
    district: code.length >= 6 ? code : undefined,
  };
}
