// ======================================================
// 2. Table & List
// ======================================================

export interface TableColumn<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  name?: string;
  emptyMessage?: string;
  paginable?: boolean;
  searchable?: boolean;
  rowPerPage?: number;
  actionsColumn?: TableColumn<T>;
  onClickItem?: (row: T) => void;
  onSearch?: (value: string) => void;
  onPageChange?: (page: number) => void;
  page?: number;
  totalRows?: number;
  searchValue?: string;
}

export interface TableSearchProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  mountCountRef: React.RefObject<number>;
}

export interface PaginationProps {
  effectivePage: number;
  pageCount: number;
  handlePageChange: (page: number) => void;
  effectiveRowPerPage: number;
  handleRowPerPageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  total: number;
}
