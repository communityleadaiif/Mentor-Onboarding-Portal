export interface GovtDept {
  category: string;
  departments: { id: string; name: string; exampleIssues: string }[];
}

export const GOVT_DEPARTMENTS: GovtDept[] = [
  {
    category: 'Public Works & Infrastructure',
    departments: [
      { id: 'pwd', name: 'Public Works Department (PWD)', exampleIssues: 'Bridge maintenance, public building structures, dam sluice gates' },
      { id: 'highways', name: 'State Highways & Rural Roads Department', exampleIssues: 'Potholes, missing street signage, hazardous sharp turns, speed breakers' },
      { id: 'corporation_municipality', name: 'City Corporation / Municipality / Town Panchayat', exampleIssues: 'Garbage disposal, street lighting, drainage blockage, public toilets' },
      { id: 'panchayat_raj', name: 'Rural Development & Panchayat Raj Department', exampleIssues: 'Village connectivity roads, community water tanks, village sanitation' }
    ]
  },
  {
    category: 'Water Resources & Environment',
    departments: [
      { id: 'twad', name: 'Tamil Nadu Water Supply & Drainage (TWAD) Board', exampleIssues: 'Drinking water pipeline leaks, contaminated overhead tanks, water scarcity' },
      { id: 'water_resources', name: 'Water Resources Department (WRD)', exampleIssues: 'Canal desilting, riverbank erosion, lake encroachment, agricultural irrigation' },
      { id: 'tnpcb', name: 'Tamil Nadu Pollution Control Board (TNPCB)', exampleIssues: 'Industrial effluent discharge, open plastic burning, noise pollution' },
      { id: 'forest_wildlife', name: 'Forest & Wildlife Department', exampleIssues: 'Human-wildlife conflict, forest perimeter fencing, illegal tree felling' }
    ]
  },
  {
    category: 'Energy & Utilities',
    departments: [
      { id: 'tangedco', name: 'TANGEDCO (Tamil Nadu Electricity Board)', exampleIssues: 'Dangling electric wires, malfunctioning transformers, frequent rural power outages' },
      { id: 'transport', name: 'State Transport Corporation (TNSTC) & RTO', exampleIssues: 'Overcrowded student buses, lack of bus shelters, erratic bus timings' }
    ]
  },
  {
    category: 'Public Health, Education & Agriculture',
    departments: [
      { id: 'public_health', name: 'Department of Public Health & Preventive Medicine', exampleIssues: 'Mosquito breeding grounds, dengue risk, primary health care access' },
      { id: 'school_education', name: 'School Education Department', exampleIssues: 'School infrastructure, computer lab facilities, clean drinking water in schools' },
      { id: 'agriculture', name: 'Agriculture & Farmers Welfare Department', exampleIssues: 'Crop pest outbreaks, lack of cold storage for perishable produce, soil health' }
    ]
  },
  {
    category: 'Civic Safety & Emergency',
    departments: [
      { id: 'police_traffic', name: 'Police & Traffic Department', exampleIssues: 'Unsafe pedestrian crossings near schools, lack of traffic signals' },
      { id: 'fire_rescue', name: 'Fire & Rescue Services', exampleIssues: 'Narrow access roads for emergency vehicles, fire safety awareness' },
      { id: 'others', name: 'Other Local Body / Department', exampleIssues: 'Custom local authority or multi-department problem' }
    ]
  }
];
