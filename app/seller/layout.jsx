"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

export default function SellerLayout({ children }) {
  const [menuItems, setMenuItems] = useState([]);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchMenu = async () => {
      try {
        const response = await fetch('/api/seller/menu', {
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
          throw new Error('Error al cargar el menú');
        }

        const data = await response.json();
        setMenuItems(data);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      }
    };

    fetchMenu();
  }, [router]);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar menuItems={menuItems} error={error} />
      <main className="flex-1 overflow-y-auto p-6">
        {children}
      </main>
    </div>
  );
} 