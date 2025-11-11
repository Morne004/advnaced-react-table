
import React from 'react';
import { DataTable } from './components/DataTable';
import type { ColumnDef, User } from './types';
import { generateMockData } from './data/mocks';

const mockData = generateMockData(200);

const columns: ColumnDef<User>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    header: 'ID',
    enableSorting: true,
  },
  {
    id: 'firstName',
    accessorKey: 'firstName',
    header: 'First Name',
  },
  {
    id: 'lastName',
    accessorKey: 'lastName',
    header: 'Last Name',
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: 'Email',
    enableSorting: false,
  },
    {
    id: 'phone',
    accessorKey: 'phone',
    header: 'Phone Number',
    enableSorting: false,
  },
  {
    id: 'age',
    accessorKey: 'age',
    header: 'Age',
  },
  {
    id: 'company',
    accessorKey: 'company',
    header: 'Company',
  },
  {
    id: 'jobTitle',
    accessorKey: 'jobTitle',
    header: 'Job Title',
  },
  {
    id: 'city',
    accessorKey: 'city',
    header: 'City',
  },
    {
    id: 'country',
    accessorKey: 'country',
    header: 'Country',
  },
  {
    id: 'joinDate',
    accessorKey: 'joinDate',
    header: 'Join Date',
  },
  {
    id: 'salary',
    accessorKey: 'salary',
    header: 'Salary',
    cell: ({ row }) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(row.salary);
    },
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.status;
      const colorMap = {
        active: 'bg-green-200 text-green-800',
        inactive: 'bg-red-200 text-red-800',
        pending: 'bg-yellow-200 text-yellow-800',
      };
      return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorMap[status]}`}>{status}</span>;
    },
  },
];

const App: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Advanced Interactive Data Table</h1>
      <DataTable data={mockData} columns={columns} />
    </div>
  );
}

export default App;
