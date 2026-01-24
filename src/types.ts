export type RecordCategory = 'ሰራተኛ' | 'ወጣት' | 'አዳጊ' | 'ህጻናት';

export type SortField = 'name' | 'church' | 'age';

export type SortDirection = 'asc' | 'desc';

export interface Record {
  id: string;
  name: string;
  church: string;
  age: number;
  category: RecordCategory;
}

export interface User {
  codeId: string;
  password: string;
}
