
import type { User } from '../../lib/types';

export const generateMockData = (count: number): User[] => {
  const data: User[] = [];
  const firstNames = ['John', 'Jane', 'Peter', 'Susan', 'Michael', 'Emily', 'Chris', 'Jessica'];
  const lastNames = ['Smith', 'Doe', 'Jones', 'Williams', 'Brown', 'Davis', 'Miller', 'Wilson'];
  const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego'];
  const statuses: User['status'][] = ['active', 'inactive', 'pending'];
  const companies = ['Innovate Inc.', 'Solutions Corp.', 'Tech Giants', 'Data Systems', 'Future Forward', 'Quantum Leap'];
  const jobTitles = ['Software Engineer', 'Product Manager', 'UX Designer', 'Data Scientist', 'Marketing Lead', 'Project Owner'];
  const countries = ['USA', 'Canada', 'Germany', 'United Kingdom', 'Japan', 'Australia'];


  for (let i = 1; i <= count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    data.push({
      id: i,
      firstName: firstName,
      lastName: lastName,
      age: Math.floor(Math.random() * 50) + 18,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
      city: cities[Math.floor(Math.random() * cities.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      company: companies[Math.floor(Math.random() * companies.length)],
      jobTitle: jobTitles[Math.floor(Math.random() * jobTitles.length)],
      country: countries[Math.floor(Math.random() * countries.length)],
      phone: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      joinDate: new Date(Date.now() - Math.floor(Math.random() * 1.577e+11)).toISOString().split('T')[0], // Random date in last 5 years
      salary: Math.floor(Math.random() * 100000) + 50000,
    });
  }
  return data;
};