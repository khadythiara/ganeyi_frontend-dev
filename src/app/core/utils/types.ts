export type FilterType = 'hourly'  | 'daily' | 'monthly';

export type KpiType = 'byHour'  | 'byDay' | 'byMonth' | 'durationHour' | 'durationDay' | 'durationMonth';

export type SuggestionType = 'current' | 'previous';

export enum AccountType {
  CLIENT,
  AGENT
};