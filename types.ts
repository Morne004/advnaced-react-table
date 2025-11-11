import React from 'react';

export interface User {
  id: number;
  firstName: string;
  lastName:string;
  age: number;
  email: string;
  city: string;
  status: 'active' | 'inactive' | 'pending';
  company: string;
  jobTitle: string;
  country: string;
  phone: string;
  joinDate: string;
  salary: number;
}

export interface ColumnDef<T> {
  id: string;
  accessorKey?: keyof T;
  header: string;
  cell?: (info: { row: T }) => React.ReactNode;
  enableSorting?: boolean;
}

export type Operator = 'contains' | 'equals' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan';

export interface Filter {
  id: string;
  column: string;
  operator: Operator;
  value: string;
}

export interface SortConfig<T> {
  key: keyof T;
  direction: 'ascending' | 'descending';
}