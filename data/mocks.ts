
import type { User } from '../types';

export const generateMockData = (count: number): User[] => {
  const data: User[] = [];
  const firstNames = ['John', 'Jane', 'Peter', 'Susan', 'Michael', 'Emily', 'Chris', 'Jessica', 'David', 'Sarah', 'Robert', 'Lisa', 'James', 'Mary', 'Daniel', 'Patricia', 'Matthew', 'Jennifer', 'Andrew', 'Linda', 'Thomas', 'Elizabeth', 'Ryan', 'Barbara', 'Kevin', 'Nancy', 'Brian', 'Margaret', 'Jason', 'Sandra'];
  const lastNames = ['Smith', 'Doe', 'Jones', 'Williams', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia', 'Martinez', 'Robinson', 'Clark', 'Rodriguez', 'Lewis', 'Lee', 'Walker', 'Hall', 'Allen', 'Young', 'King', 'Wright'];
  const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'Fort Worth', 'Columbus', 'Charlotte', 'Seattle', 'Denver', 'Boston', 'Portland', 'Detroit', 'Miami', 'Atlanta', 'Las Vegas', 'Nashville', 'Baltimore', 'Sacramento', 'Kansas City', 'Minneapolis', 'Tampa', 'Orlando'];
  const statuses: User['status'][] = ['active', 'inactive', 'pending'];
  const companies = ['Innovate Inc.', 'Solutions Corp.', 'Tech Giants', 'Data Systems', 'Future Forward', 'Quantum Leap', 'Digital Dynamics', 'Cloud Nine Technologies', 'Apex Innovations', 'Vertex Solutions', 'Nexus Enterprises', 'Pinnacle Systems', 'Horizon Industries', 'Catalyst Group', 'Momentum Labs', 'Synergy Partners', 'Vanguard Technologies', 'Fusion Ventures', 'Elevate Digital', 'Paradigm Shift Inc.', 'Stellar Innovations', 'Infinity Solutions', 'Zenith Corporation', 'Omega Systems', 'Alpha Technologies'];
  const jobTitles = ['Software Engineer', 'Product Manager', 'UX Designer', 'Data Scientist', 'Marketing Lead', 'Project Owner', 'Senior Developer', 'DevOps Engineer', 'Business Analyst', 'Quality Assurance Engineer', 'Technical Lead', 'Scrum Master', 'UI Designer', 'Data Analyst', 'Systems Architect', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Sales Manager', 'Account Executive', 'HR Manager', 'Financial Analyst', 'Operations Manager', 'Customer Success Manager', 'Content Strategist'];
  const countries = ['USA', 'Canada', 'Germany', 'United Kingdom', 'Japan', 'Australia', 'France', 'Italy', 'Spain', 'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Switzerland', 'Belgium', 'Austria', 'Ireland', 'New Zealand', 'Singapore', 'South Korea', 'Brazil', 'Mexico', 'India', 'China', 'Poland'];


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
