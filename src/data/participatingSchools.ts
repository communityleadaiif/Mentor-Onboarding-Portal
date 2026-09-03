export interface SchoolEntry {
  id: string;
  name: string;
  teamName?: string;
  district: string;
  badgeSymbol: string;
  category: string;
  status?: string;
  submissionId?: string;
}

export const INITIAL_SCHOOLS: SchoolEntry[] = [
  { id: 'sch-1', name: 'Sainik School Amaravathinagar (Host Institution)', district: 'Tiruppur', badgeSymbol: '🛡️', category: 'Host Institution' }
];

