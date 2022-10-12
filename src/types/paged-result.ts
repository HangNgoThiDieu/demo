interface Empty {}

export interface PagedResult<T extends Empty> {
  items: T[];
  hasMoreRecords: boolean;
}