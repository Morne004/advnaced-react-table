// Demo-specific types (not part of the library)
export interface User {
  id: number;
  firstName: string;
  lastName: string;
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
