import React, { useRef, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import WarrantyClaimPDF from "./WarrantyClaimPDF";
import { toast } from "react-hot-toast";

const initialForm = {
  customerName: "",
  address: "",
  customerPhone: "",
  customerSignature: "",
  damageDate: "",
  damageDescription: "",
  damagedPart: "",
  damagedPartSerial: "",
  invoiceNumber: "",
  model: "",
  ownerName: "",
  ownerPhone: "",
  purchaseDate: "",
  replacementPart: "",
  replacementSerial: "",
  serial: "",
  sellerSignature: "",
  technicianNotes: "",
};

export default function WarrantyClaimForm() {
  const [form, setForm] = useState(initialForm);
  const [logo, setLogo] = useState("/logo empresa.png");
  const [logoFile, setLogoFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoClick = () => fileInputRef.current.click();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/garantias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          id: crypto.randomUUID(),
          damageDate: new Date(form.damageDate),
          purchaseDate: new Date(form.purchaseDate),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear la garantía');
      }

      toast.success('Garantía creada exitosamente');
      setForm(initialForm);
    } catch (error) {
      console.error('Error submitting warranty:', error);
      toast.error(error.message || 'Error al crear la garantía');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow mt-8">
      <div className="flex flex-col items-center mb-6">
        <div
          className="w-48 h-24 bg-gray-100 flex items-center justify-center cursor-pointer border border-gray-300 rounded mb-2"
          title="Click to change logo"
          onClick={handleLogoClick}
        >
          {logo ? (
            <img src={logo} alt="Company Logo" className="max-h-20 max-w-full" />
          ) : (
            <span className="text-gray-400">Click to upload logo</span>
          )}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleLogoChange}
          />
        </div>
        <span className="text-xs text-gray-500">Click the logo to change</span>
      </div>
      <form id="warranty-form" onSubmit={handleSubmit} className="space-y-8">
        {/* Customer Information */}
        <section>
          <h2 className="font-bold text-lg mb-2">Customer Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <input name="customerName" value={form.customerName} onChange={handleChange} placeholder="Customer Name" className="input" required />
            <input name="customerPhone" value={form.customerPhone} onChange={handleChange} placeholder="Customer Phone" className="input" required />
            <input name="address" value={form.address} onChange={handleChange} placeholder="Address" className="input" required />
            <input name="customerSignature" value={form.customerSignature} onChange={handleChange} placeholder="Customer Signature" className="input" required />
          </div>
        </section>

        {/* Product Information */}
        <section>
          <h2 className="font-bold text-lg mb-2">Product Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <input name="model" value={form.model} onChange={handleChange} placeholder="Model" className="input" required />
            <input name="serial" value={form.serial} onChange={handleChange} placeholder="Serial Number" className="input" required />
            <input name="invoiceNumber" value={form.invoiceNumber} onChange={handleChange} placeholder="Invoice Number" className="input" required />
            <input name="purchaseDate" value={form.purchaseDate} onChange={handleChange} type="date" className="input" required />
          </div>
        </section>

        {/* Damage Information */}
        <section>
          <h2 className="font-bold text-lg mb-2">Damage Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <input name="damageDate" value={form.damageDate} onChange={handleChange} type="date" className="input" required />
            <input name="damagedPart" value={form.damagedPart} onChange={handleChange} placeholder="Damaged Part" className="input" required />
            <input name="damagedPartSerial" value={form.damagedPartSerial} onChange={handleChange} placeholder="Damaged Part Serial" className="input" />
            <input name="damageDescription" value={form.damageDescription} onChange={handleChange} placeholder="Damage Description" className="input" required />
          </div>
        </section>

        {/* Replacement Information */}
        <section>
          <h2 className="font-bold text-lg mb-2">Replacement Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <input name="replacementPart" value={form.replacementPart} onChange={handleChange} placeholder="Replacement Part" className="input" />
            <input name="replacementSerial" value={form.replacementSerial} onChange={handleChange} placeholder="Replacement Serial" className="input" />
            <input name="technicianNotes" value={form.technicianNotes} onChange={handleChange} placeholder="Technician Notes" className="input" />
            <input name="sellerSignature" value={form.sellerSignature} onChange={handleChange} placeholder="Seller Signature" className="input" />
          </div>
        </section>
      </form>
      <div className="mt-6 flex justify-end space-x-4">
        <button 
          type="submit" 
          form="warranty-form"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Warranty"}
        </button>
        <PDFDownloadLink
          document={<WarrantyClaimPDF form={form} logo={logo} />}
          fileName="warranty-claim.pdf"
          className="btn btn-secondary"
        >
          {({ loading }) => (loading ? "Generating PDF..." : "Download PDF")}
        </PDFDownloadLink>
      </div>
    </div>
  );
}

// Tailwind CSS classes like 'input' and 'btn btn-primary' are assumed. Adjust as needed.
