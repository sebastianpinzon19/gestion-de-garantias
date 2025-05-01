"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WarrantyDetails({ params }) {
  const [warranty, setWarranty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchWarrantyDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await fetch(`/api/seller/warranties/${params.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.push('/login');
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch warranty details');
        }

        const data = await response.json();
        setWarranty(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWarrantyDetails();
  }, [params.id, router]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        Error: {error}
      </div>
    );
  }

  if (!warranty) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Warranty not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:text-blue-900"
        >
          ← Back to Warranties
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold">Warranty Details</h1>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Name</label>
                  <p className="mt-1">{warranty.customerName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Email</label>
                  <p className="mt-1">{warranty.customerEmail}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Phone</label>
                  <p className="mt-1">{warranty.customerPhone}</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">Product Information</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Product Name</label>
                  <p className="mt-1">{warranty.productName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Serial Number</label>
                  <p className="mt-1">{warranty.productSerial}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Purchase Date</label>
                  <p className="mt-1">{new Date(warranty.purchaseDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-4">Warranty Information</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-600">Status</label>
                <span className={`mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(warranty.status)}`}>
                  {warranty.status}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Created At</label>
                <p className="mt-1">{new Date(warranty.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Description</label>
                <p className="mt-1 whitespace-pre-wrap">{warranty.description}</p>
              </div>
            </div>
          </div>

          {warranty.updates && warranty.updates.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-4">Updates History</h2>
              <div className="space-y-4">
                {warranty.updates.map((update, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <p className="text-sm text-gray-600">
                      {new Date(update.createdAt).toLocaleString()}
                    </p>
                    <p className="mt-1">{update.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 