'use client';

import { useState, useEffect } from 'react';

interface Permissions {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

interface Role {
  name: string;
  description: string;
  permissions: Record<string, Permissions>;
}

interface Employee {
  id: string;
  name: string;
}

export default function ProfileManagement() {
  const [role, setRole] = useState<Role>({
    name: '',
    description: '',
    permissions: { dashboard: { create: false, read: false, update: false, delete: false }, 
                   counselor: { create: false, read: false, update: false, delete: false }, 
                   report: { create: false, read: false, update: false, delete: false }, 
                   employee: { create: false, read: false, update: false, delete: false }, 
                   patient: { create: false, read: false, update: false, delete: false } },
  });
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch('/api/employees');
        if (!res.ok) throw new Error('Failed to fetch employees');
        const data = await res.json();
        setEmployees(data);
      } catch (err) {
        setError('Error fetching employees');
      }
    };
    fetchEmployees();
  }, []);

  const sections: string[] = ['Dashboard', 'Counselor', 'Report', 'Employee', 'Patient'];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRole(prev => ({ ...prev, [name]: value }));
  };

  const handlePermissionChange = (e: React.ChangeEvent<HTMLInputElement>, section: string) => {
    const { name, checked } = e.target;
    setRole(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [section.toLowerCase()]: {
          ...prev.permissions[section.toLowerCase()],
          [name]: checked
        }
      }
    }));
  };

  const handleSectionToggle = (section: string, checked: boolean) => {
    setRole(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [section.toLowerCase()]: { create: checked, read: checked, update: checked, delete: checked }
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Role Saved:', role);
    alert('Role saved successfully!');
    setRole({
      name: '',
      description: '',
      permissions: { dashboard: { create: false, read: false, update: false, delete: false }, 
                     counselor: { create: false, read: false, update: false, delete: false }, 
                     report: { create: false, read: false, update: false, delete: false }, 
                     employee: { create: false, read: false, update: false, delete: false }, 
                     patient: { create: false, read: false, update: false, delete: false } }
    });
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h2 className="text-2xl font-bold mb-4">Add Role</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Employee</label>
          <select
            name="name"
            value={role.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select an employee</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.name}>
                {`${employee.name} (ID: ${employee.id})`}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1">Description</label>
          <textarea
            name="description"
            value={role.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={4}
            required
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Role Permissions</h3>
          <label className="flex items-center mb-2">
            <input
              type="checkbox"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const checked = e.target.checked;
                setRole(prev => ({
                  ...prev,
                  permissions: Object.fromEntries(
                    sections.map(section => [section.toLowerCase(), { create: checked, read: checked, update: checked, delete: checked }])
                  )
                }));
              }}
            />
            <span className="ml-2">Select all</span>
          </label>
          {sections.map(section => (
            <div key={section} className="mb-4">
              <label className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={['create', 'read', 'update', 'delete'].every(perm => role.permissions[section.toLowerCase()][perm])}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSectionToggle(section, e.target.checked)}
                />
                <span className="ml-2 capitalize">{section}</span>
              </label>
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border p-2">Permission</th>
                    <th className="border p-2">Create</th>
                    <th className="border p-2">Read</th>
                    <th className="border p-2">Update</th>
                    <th className="border p-2">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2">{section}</td>
                    {['create', 'read', 'update', 'delete'].map(perm => (
                      <td key={perm} className="border p-2 text-center">
                        <input
                          type="checkbox"
                          name={perm}
                          checked={role.permissions[section.toLowerCase()][perm]}
                          onChange={(e) => handlePermissionChange(e, section)}
                        />
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Save Role
        </button>
      </form>
    </div>
  );
}