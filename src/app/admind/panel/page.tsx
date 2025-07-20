'use client';

import React, { useState, useEffect } from 'react';

interface Permissions {
  create?: boolean;
  read?: boolean;
  update?: boolean;
  delete?: boolean;
}

interface Role {
  employeeId: string;
  description: string;
  permissions: Record<string, Permissions>;
}

interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
}

const Panel = () => {
  const [role, setRole] = useState<Role>({
    employeeId: '',
    description: '',
    permissions: {
      dashboard: { read: false },
      counselor: { read: false, update: false, delete: false },
      report: { read: false },
      employee: { read: false, update: false, delete: false },
      patient: { read: false,  delete: false },
    },
  });

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [error, setError] = useState<string | null>(null);

  const sections: string[] = ['Dashboard', 'Counselor', 'Report', 'Employee', 'Patient'];

  const getPermissionsForSection = (section: string): (keyof Permissions)[] => {
  return Object.keys(role.permissions[section.toLowerCase()] || {})
    .filter(key => key !== '_id') as (keyof Permissions)[];
};

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch('/admind/api/employee');
        if (!res.ok) throw new Error('Failed to fetch employees');
        const data = await res.json();
        setEmployees(data.users);
      } catch (err) {
        setError('Error fetching employees');
      }
    };
    fetchEmployees();
  }, []);

  const fetchPermissionsByEmployeeId = async (employeeId: string) => {
    try {
      const res = await fetch(`/admind/api/permissions/${employeeId}`);
      if (!res.ok) throw new Error('Failed to fetch permissions');
      const data = await res.json();
      return data.permissions || {};
    } catch (err) {
      console.error('Permission fetch error', err);
      return {};
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
  const { name, value } = e.target;

  if (name === 'employeeId') {
    const fetchedPermissions = await fetchPermissionsByEmployeeId(value);

    // Allowed structure
    const allowedStructure: Record<string, (keyof Permissions)[]> = {
      dashboard: ['read'],
      counselor: ['read', 'update', 'delete'],
      report: ['read'],
      employee: ['read', 'update', 'delete'],
      patient: ['read', 'delete'],
    };

    const filteredPermissions: Record<string, Permissions> = {};

    for (const section of Object.keys(allowedStructure)) {
      const perms = fetchedPermissions[section] || {};
      filteredPermissions[section] = {};

      for (const key of allowedStructure[section]) {
        filteredPermissions[section][key] = perms[key] || false;
      }
    }

    setRole(prev => ({
      ...prev,
      employeeId: value,
      permissions: filteredPermissions,
    }));
  } else {
    setRole(prev => ({ ...prev, [name]: value }));
  }
};


  const handlePermissionChange = (e: React.ChangeEvent<HTMLInputElement>, section: string) => {
    const { name, checked } = e.target;
    setRole(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [section.toLowerCase()]: {
          ...prev.permissions[section.toLowerCase()],
          [name]: checked,
        },
      },
    }));
  };

  const handleSectionToggle = (section: string, checked: boolean) => {
    setRole(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [section.toLowerCase()]: Object.fromEntries(
          getPermissionsForSection(section).map(p => [p, checked])
        ) as Permissions,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/admind/api/permissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: role.employeeId,
          description: role.description,
          permissions: role.permissions,
        }),
      });

      if (!res.ok) throw new Error('Failed to save permissions');

      alert('Permissions saved!');
      setRole({
        employeeId: '',
        description: '',
        permissions: {
          dashboard: { read: false },
          counselor: { read: false, update: false, delete: false },
          report: { read: false },
          employee: { read: false, update: false, delete: false },
          patient: { read: false, update: false, delete: false },
        },
      });
    } catch {
      setError('Error saving permissions');
    }
  };


  return (
    <div className="min-h-screen bg-transparent p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-[#0A1D58] mb-6">Panel</h1>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Assign Permissions</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1">Employee</label>
              <select
                name="employeeId"
                value={role.employeeId}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
                disabled={employees.length === 0}
              >
                <option value="">
                  {employees.length === 0 ? 'No employees found' : 'Select an employee'}
                </option>
                {employees.map((employee) => (
                  <option key={employee._id} value={employee._id}>
                    {`${employee.firstName} ${employee.lastName} (ID: ${employee._id})`}
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
              <h3 className="text-lg font-semibold mb-2">Permissions</h3>
              <label className="flex items-center mb-2">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setRole(prev => ({
                      ...prev,
                      permissions: Object.fromEntries(
                        sections.map(section => [
                          section.toLowerCase(),
                          Object.fromEntries(
                            getPermissionsForSection(section).map(p => [p, checked])
                          ),
                        ])
                      ),
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
                      checked={getPermissionsForSection(section).every(
                        perm => role.permissions[section.toLowerCase()]?.[perm]
                      )}
                      onChange={(e) => handleSectionToggle(section, e.target.checked)}
                    />
                    <span className="ml-2 capitalize">{section}</span>
                  </label>

                  <table className="w-full border-collapse">
  <thead>
    <tr>
      {getPermissionsForSection(section).map(perm => (
        <th key={perm} className="border p-2 capitalize">{perm}</th>
      ))}
    </tr>
  </thead>
  <tbody>
    <tr>
      {getPermissionsForSection(section).map(perm => (
        <td key={perm} className="border p-2 text-center">
          <input
            type="checkbox"
            name={perm}
            checked={role.permissions[section.toLowerCase()]?.[perm] || false}
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

            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded"
            >
              Save Permissions
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Panel;
