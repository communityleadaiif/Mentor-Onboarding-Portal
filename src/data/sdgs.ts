export interface SDGItem {
  id: number;
  title: string;
  shortTitle: string;
  tagline: string;
  color: string;
  iconSymbol: string;
}

export const SDGS_DATA: SDGItem[] = [
  { id: 1, title: 'No Poverty', shortTitle: 'No Poverty', tagline: 'End poverty in all its forms everywhere.', color: '#E5243B', iconSymbol: '🛡️' },
  { id: 2, title: 'Zero Hunger', shortTitle: 'Zero Hunger', tagline: 'End hunger, achieve food security and improved nutrition.', color: '#DDA63A', iconSymbol: '🌾' },
  { id: 3, title: 'Good Health and Well-being', shortTitle: 'Good Health', tagline: 'Ensure healthy lives and promote well-being for all at all ages.', color: '#4C9F38', iconSymbol: '🏥' },
  { id: 4, title: 'Quality Education', shortTitle: 'Quality Education', tagline: 'Ensure inclusive and equitable quality education for all.', color: '#C5192D', iconSymbol: '🎓' },
  { id: 5, title: 'Gender Equality', shortTitle: 'Gender Equality', tagline: 'Achieve gender equality and empower all women and girls.', color: '#FF3A21', iconSymbol: '⚖️' },
  { id: 6, title: 'Clean Water and Sanitation', shortTitle: 'Clean Water', tagline: 'Ensure availability and sustainable management of water.', color: '#26BDEE', iconSymbol: '💧' },
  { id: 7, title: 'Affordable and Clean Energy', shortTitle: 'Clean Energy', tagline: 'Ensure access to affordable, reliable, sustainable energy.', color: '#FCC30B', iconSymbol: '⚡' },
  { id: 8, title: 'Decent Work and Economic Growth', shortTitle: 'Decent Work', tagline: 'Promote sustained, inclusive and sustainable economic growth.', color: '#A21942', iconSymbol: '📈' },
  { id: 9, title: 'Industry, Innovation and Infrastructure', shortTitle: 'Industry & Innovation', tagline: 'Build resilient infrastructure, foster innovation.', color: '#FD6925', iconSymbol: '🏗️' },
  { id: 10, title: 'Reduced Inequalities', shortTitle: 'Reduced Inequalities', tagline: 'Reduce inequality within and among countries.', color: '#DD1367', iconSymbol: '🤝' },
  { id: 11, title: 'Sustainable Cities and Communities', shortTitle: 'Sustainable Communities', tagline: 'Make cities and human settlements inclusive, safe, resilient.', color: '#FD9D24', iconSymbol: '🏙️' },
  { id: 12, title: 'Responsible Consumption and Production', shortTitle: 'Responsible Consumption', tagline: 'Ensure sustainable consumption and production patterns.', color: '#BF8B2E', iconSymbol: '♻️' },
  { id: 13, title: 'Climate Action', shortTitle: 'Climate Action', tagline: 'Take urgent action to combat climate change and its impacts.', color: '#3F7E44', iconSymbol: '🌱' },
  { id: 14, title: 'Life Below Water', shortTitle: 'Life Below Water', tagline: 'Conserve and sustainably use oceans, seas and marine resources.', color: '#0A97D9', iconSymbol: '🐟' },
  { id: 15, title: 'Life on Land', shortTitle: 'Life on Land', tagline: 'Protect, restore and promote sustainable use of terrestrial ecosystems.', color: '#56C02B', iconSymbol: '🌳' },
  { id: 16, title: 'Peace, Justice and Strong Institutions', shortTitle: 'Peace & Justice', tagline: 'Promote peaceful and inclusive societies for sustainable development.', color: '#00689D', iconSymbol: '🏛️' },
  { id: 17, title: 'Partnerships for the Goals', shortTitle: 'Partnerships', tagline: 'Strengthen the means of implementation and revitalize partnerships.', color: '#19486A', iconSymbol: '🌐' }
];
