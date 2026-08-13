export interface SchoolEntry {
  id: string;
  name: string;
  district: string;
  badgeSymbol: string;
  category: string;
}

export const INITIAL_SCHOOLS: SchoolEntry[] = [
  { id: 'sch-1', name: 'Sainik School Amaravathinagar (Host Institution)', district: 'Tiruppur', badgeSymbol: '🛡️', category: 'Host Institution' }
];
