'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaPlus, FaSpinner } from 'react-icons/fa';
import { useToast } from "@/components/ui/use-toast";
import cookies from '@/lib/cookies';

export default function WarrantiesPage() {
  const [warranties, setWarranties] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchWarranties = async () => {
      try {
        const token = cookies.get('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await fetch('/api/admin/warranties', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 401) {
          cookies.remove('token');
          cookies.remove('user');
          router.push('/login');
          return;
        }

        if (!response.ok) {
          throw new Error('Error fetching warranties');
        }

        const data = await response.json();
        setWarranties(data);
      } catch (error) {
        console.error('Error fetching warranties:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Error loading warranties"
        });
        setWarranties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWarranties();
  }, [router, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Warranty Management</h1>
        <button
          onClick={() => router.push('/admin/warranties/new')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FaPlus /> New Warranty
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Purchase Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {warranties.map((warranty) => (
              <tr
                key={warranty.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => router.push(`/admin/warranties/${warranty.id}`)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {warranty.customerName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {warranty.customerPhone}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {warranty.brand} {warranty.model}
                  </div>
                  <div className="text-sm text-gray-500">
                    SN: {warranty.serial}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${warranty.warrantyStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      warranty.warrantyStatus === 'approved' ? 'bg-green-100 text-green-800' : 
                      'bg-red-100 text-red-800'}`}>
                    {warranty.warrantyStatus.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(warranty.purchaseDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(warranty.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 