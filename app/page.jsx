"use client"

import React from "react";
import SiteHeader from "@/components/layout/site-header";
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();

  const handleWarrantyForm = () => {
    router.push('/warranty-form');
  };

  const handleLogin = () => {
    router.push('/login');
  };

  const handleDashboard = () => {
    if (user?.role === 'ADMIN') {
      router.push('/admin/dashboard');
    } else if (user?.role === 'SELLER') {
      router.push('/seller/dashboard');
    } else {
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 via-blue-500 to-yellow-500">
      <SiteHeader />
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">
            Warranty System
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Digitize the warranty management process to eliminate paperwork, allowing customers to submit requests and sellers to manage them easily.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* For Customers */}
          <div className="bg-gray-900/20 backdrop-blur-lg border border-blue-500/20 rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-blue-300 mb-4">For Customers</h2>
            <p className="text-white/80 mb-8">
              Complete the warranty form for your product and receive updates about the status of your request.
                </p>
            <button
              onClick={handleWarrantyForm}
              className="w-full bg-gradient-to-r from-blue-500 to-yellow-500 text-white py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
                    Request Warranty
            </button>
              </div>
              
          {/* For Sellers/Admins */}
          <div className="bg-gray-900/20 backdrop-blur-lg border border-yellow-500/20 rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-yellow-300 mb-4">
              {user ? 'Access Your Dashboard' : 'For Sellers & Admins'}
            </h2>
            <p className="text-white/80 mb-8">
              {user 
                ? 'Manage warranty requests, update their status, and generate PDF documents.'
                : 'Sign in to manage warranty requests, update their status, and generate PDF documents.'}
                </p>
            <button
              onClick={user ? handleDashboard : handleLogin}
              className="w-full bg-gradient-to-r from-yellow-500 to-blue-500 text-white py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              {user ? 'Go to Dashboard' : 'Sign In'}
            </button>
          </div>
        </div>

        <footer className="text-center mt-16 text-white/60">
          <p>© 2024 Warranty Management System. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}
