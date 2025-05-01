"use client";

import React, { useState } from "react";
import SiteHeader from "@/components/layout/site-header";
import { ThemeProvider } from "./theme-provider";

export default function WarrantyFormPage() {
  const [form, setForm] = useState({
    company: "",
    companyAddress: "",
    companyCity: "",
    companyState: "",
    companyZip: "",
    contactPerson: "",
    companyPhone: "",
    homeownerName: "",
    homeownerPhone: "",
    homeownerAddress: "",
    homeownerCity: "",
    homeownerState: "",
    homeownerZip: "",
    item: "",
    model: "",
    serialNumber: "",
    brand: "",
    dateInstalled: "",
    warrantyReason: "",
    signature: ""
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.signature) {
      alert("Please provide a signature");
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-green-900 p-6">
        <div className="bg-gray-800 text-white rounded-lg shadow-2xl p-8 max-w-lg w-full border-2 border-green-500">
          <h2 className="text-2xl font-bold text-green-400 mb-4 text-center">✅ Warranty Request Submitted</h2>
          <p className="text-gray-300 text-center mb-6">
            Thank you! Your warranty request has been received.
          </p>
          <div className="text-center">
            <button
              className="bg-green-600 text-white px-5 py-2 rounded-full hover:bg-green-700 transition"
              onClick={() => setSubmitted(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <SiteHeader />
        <div className="max-w-5xl mx-auto my-10 bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg border border-gray-300 dark:border-gray-700">
          <h1 className="text-3xl font-extrabold text-center text-indigo-400 mb-6">📄 Warranty Claim Form</h1>

          <form onSubmit={handleSubmit} className="space-y-10">
            {renderSection("🏢 Company Details", [
              field("Company", "company"),
              field("Address", "companyAddress"),
              field("City", "companyCity"),
              field("State", "companyState"),
              field("Zip", "companyZip"),
              field("Contact Person", "contactPerson"),
              field("Phone", "companyPhone")
            ])}

            {renderSection("👤 Homeowner Details", [
              field("Name", "homeownerName"),
              field("Phone", "homeownerPhone"),
              field("Address", "homeownerAddress"),
              field("City", "homeownerCity"),
              field("State", "homeownerState"),
              field("Zip", "homeownerZip")
            ])}

            {renderSection("📦 Product Details", [
              field("Item", "item"),
              field("Model", "model"),
              field("Serial Number", "serialNumber"),
              field("Brand", "brand"),
              field("Date Installed", "dateInstalled", "date"),
              textArea("Reason of Warranty", "warrantyReason"),
              field("Signature", "signature")
            ])}

            <div className="text-right">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition shadow-md"
              >
                Submit Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </ThemeProvider>
  );

  function renderSection(title, fields) {
    return (
      <div className="bg-gray-800 rounded-xl shadow p-6 border border-gray-700">
        <h2 className="text-xl font-semibold text-indigo-300 mb-4">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {fields.map((field, index) => (
            <div key={index}>{field}</div>
          ))}
        </div>
      </div>
    );
  }

  function field(label, name, type = "text") {
    return (
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-1">{label} *</label>
        <input
          type={type}
          name={name}
          value={form[name]}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
      </div>
    );
  }

  function textArea(label, name) {
    return (
      <div className="col-span-full">
        <label className="block text-sm font-semibold text-gray-300 mb-1">{label} *</label>
        <textarea
          name={name}
          rows={4}
          value={form[name]}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        ></textarea>
      </div>
    );
  }
}
