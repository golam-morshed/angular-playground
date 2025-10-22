// Vercel Serverless Function for Employee API
// This replaces json-server for production

let employees = [
  {
    "id": 1,
    "name": "John Smith",
    "email": "john.smith@company.com",
    "position": "Senior Software Engineer",
    "department": "Engineering",
    "address": {
      "street": "123 Main Street",
      "city": "San Francisco",
      "postalCode": "94105"
    },
    "skills": ["JavaScript", "TypeScript", "Angular", "Node.js"]
  },
  {
    "id": 2,
    "name": "Sarah Johnson",
    "email": "sarah.johnson@company.com",
    "position": "Product Manager",
    "department": "Product",
    "address": {
      "street": "456 Oak Avenue",
      "city": "New York",
      "postalCode": "10001"
    },
    "skills": ["Product Strategy", "Agile", "User Research", "Analytics"]
  }
];

export default function handler(req, res) {
  const { method, query, body } = req;
  const { id } = query;

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  switch (method) {
    case 'GET':
      if (id) {
        const employee = employees.find(emp => emp.id === parseInt(id));
        if (employee) {
          res.status(200).json(employee);
        } else {
          res.status(404).json({ error: 'Employee not found' });
        }
      } else {
        res.status(200).json(employees);
      }
      break;

    case 'POST':
      const newEmployee = {
        ...body,
        id: Math.max(...employees.map(emp => emp.id)) + 1
      };
      employees.push(newEmployee);
      res.status(201).json(newEmployee);
      break;

    case 'PUT':
      const index = employees.findIndex(emp => emp.id === parseInt(id));
      if (index !== -1) {
        employees[index] = { ...employees[index], ...body, id: parseInt(id) };
        res.status(200).json(employees[index]);
      } else {
        res.status(404).json({ error: 'Employee not found' });
      }
      break;

    case 'DELETE':
      const deleteIndex = employees.findIndex(emp => emp.id === parseInt(id));
      if (deleteIndex !== -1) {
        const deletedEmployee = employees.splice(deleteIndex, 1)[0];
        res.status(200).json(deletedEmployee);
      } else {
        res.status(404).json({ error: 'Employee not found' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
