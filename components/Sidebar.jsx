"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  HomeIcon, 
  UserGroupIcon, 
  DocumentTextIcon, 
  CogIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  DocumentPlusIcon,
  ClipboardDocumentCheckIcon,
  UserIcon
} from '@heroicons/react/24/outline';

const iconMap = {
  'home': HomeIcon,
  'users': UserGroupIcon,
  'warranties': DocumentTextIcon,
  'settings': CogIcon,
  'analytics': ChartBarIcon,
  'warranty': ShieldCheckIcon,
  'new-warranty': DocumentPlusIcon,
  'pending': ClipboardDocumentCheckIcon,
  'profile': UserIcon
};

export default function Sidebar({ menuItems, error }) {
  const router = useRouter();
  const [activeItem, setActiveItem] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const path = window.location.pathname;
    const currentItem = menuItems.find(item => item.link === path);
    setActiveItem(currentItem?.id);
    
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
  }, [menuItems]);

  const handleMenuClick = (item) => {
    setActiveItem(item.id);
    router.push(item.link);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-4 text-xl font-bold border-b border-gray-700 flex items-center space-x-2">
        <ShieldCheckIcon className="w-6 h-6" />
        <span>{user?.role === 'admin' ? 'Admin Panel' : 'Seller Panel'}</span>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {error ? (
          <div className="text-red-500 text-sm bg-red-100/10 p-3 rounded">{error}</div>
        ) : (
          menuItems.map((item) => {
            const IconComponent = iconMap[item.icon] || ShieldCheckIcon;
            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeItem === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </button>
            );
          })
        )}
      </nav>

      <div className="p-4 border-t border-gray-700">
        {user && (
          <div className="mb-4">
            <p className="text-sm text-gray-400">Logged in as:</p>
            <p className="font-medium">{user.name}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 text-red-400 hover:text-red-300 px-3 py-2 rounded-lg transition-colors duration-200"
        >
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
} 