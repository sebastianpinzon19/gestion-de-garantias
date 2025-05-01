"use client";

import { useEffect, useState } from 'react';

export default function SellerDashboard() {
  const [stats, setStats] = useState({
    totalWarranties: 0,
    pendingWarranties: 0,
    completedWarranties: 0,
    recentWarranties: []
  });

  useEffect(() => {
    // Aquí puedes agregar la lógica para cargar las estadísticas iniciales
    // Por ahora usaremos datos de ejemplo
    setStats({
      totalWarranties: 45,
      pendingWarranties: 12,
      completedWarranties: 33,
      recentWarranties: [
        { id: 1, customer: 'John Doe', product: 'Laptop', status: 'Pending' },
        { id: 2, customer: 'Jane Smith', product: 'Phone', status: 'Completed' },
        { id: 3, customer: 'Bob Johnson', product: 'Tablet', status: 'Pending' }
      ]
    });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Warranties Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">Total Warranties</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.totalWarranties}</p>
        </div>

        {/* Pending Warranties Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">Pending Warranties</h3>
          <p className="text-3xl font-bold text-yellow-600">{stats.pendingWarranties}</p>
        </div>

        {/* Completed Warranties Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">Completed Warranties</h3>
          <p className="text-3xl font-bold text-green-600">{stats.completedWarranties}</p>
        </div>
      </div>

      {/* Recent Warranties Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Warranties</h2>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.recentWarranties.map((warranty) => (
                <tr key={warranty.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{warranty.customer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{warranty.product}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      warranty.status === 'Pending' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {warranty.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 