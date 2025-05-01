"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalWarranties: 0,
    pendingWarranties: 0,
    inProgressWarranties: 0,
    completedWarranties: 0,
    totalSellers: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await fetch('/api/admin/dashboard/stats', {
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
          throw new Error('Failed to fetch dashboard statistics');
        }

        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [router]);

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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Warranties Card */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-700">Total Warranties</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{stats.totalWarranties}</p>
        </div>

        {/* Pending Warranties Card */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-700">Pending Warranties</h3>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pendingWarranties}</p>
        </div>

        {/* In Progress Warranties Card */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-700">In Progress</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{stats.inProgressWarranties}</p>
        </div>

        {/* Completed Warranties Card */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-700">Completed Warranties</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats.completedWarranties}</p>
        </div>

        {/* Total Sellers Card */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-700">Total Sellers</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">{stats.totalSellers}</p>
        </div>
      </div>

      <div className="mt-8">
        <button
          onClick={() => router.push('/admin/warranties')}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          View All Warranties
        </button>
      </div>
    </div>
  );
}
