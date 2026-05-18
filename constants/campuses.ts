export const CAMPUSES = [
  { value: 'unza', label: 'University of Zambia (UNZA)' },
  { value: 'cbu', label: 'Copperbelt University (CBU)' },
  { value: 'mulungushi', label: 'Mulungushi University' },
  { value: 'unilus', label: 'University of Lusaka (UNILUS)' },
  { value: 'rusangu', label: 'Rusangu University' },
  { value: 'other', label: 'Other campus' },
] as const;

export type CampusValue = (typeof CAMPUSES)[number]['value'];
