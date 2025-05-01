import React, { useRef, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import WarrantyClaimPDF from "./WarrantyClaimPDF";

const initialForm = {
  company: "",
  contact: "",
  address: "",
  phone: "",
  city: "",
  state: "",
  zip: "",
  homeowner: "",
  homeownerPhone: "",
  homeownerAddress: "",
  homeownerCity: "",
  homeownerState: "",
  homeownerZip: "",
  item: "",
  model: "",
  serial: "",
  brand: "",
  dateInstalled: "",
  reason: "",
  signature: "",
  failedPart: "",
  newPart: "",
  cmFailedPart: "",
  soReplPart: "",
  failedPartSerial: "",
  newPartSerial: "",
  unitSO: "",
  requestReceivedBy: "",
  receivedOn: "",
};

export default function WarrantyClaimForm() {
  const [form, setForm] = useState(initialForm);
  const [logo, setLogo] = useState("/logo empresa.png");
  const [logoFile, setLogoFile] = useState(null);
  const fileInputRef = useRef();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setLogo(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleLogoClick = () => fileInputRef.current.click();

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
      <form className="space-y-8">
        {/* Company Detail */}
        <section>
          <h2 className="font-bold text-lg mb-2">Company Detail</h2>
          <div className="grid grid-cols-2 gap-4">
            <input name="company" value={form.company} onChange={handleChange} placeholder="Company" className="input" />
            <input name="contact" value={form.contact} onChange={handleChange} placeholder="Contact" className="input" />
            <input name="address" value={form.address} onChange={handleChange} placeholder="Address" className="input" />
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="input" />
            <input name="city" value={form.city} onChange={handleChange} placeholder="City" className="input" />
            <input name="state" value={form.state} onChange={handleChange} placeholder="State" className="input" />
            <input name="zip" value={form.zip} onChange={handleChange} placeholder="Zip" className="input" />
          </div>
        </section>
        {/* Homeowner Detail */}
        <section>
          <h2 className="font-bold text-lg mb-2">Homeowner Detail</h2>
          <div className="grid grid-cols-2 gap-4">
            <input name="homeowner" value={form.homeowner} onChange={handleChange} placeholder="Name" className="input" />
            <input name="homeownerPhone" value={form.homeownerPhone} onChange={handleChange} placeholder="Phone" className="input" />
            <input name="homeownerAddress" value={form.homeownerAddress} onChange={handleChange} placeholder="Address" className="input" />
            <input name="homeownerCity" value={form.homeownerCity} onChange={handleChange} placeholder="City" className="input" />
            <input name="homeownerState" value={form.homeownerState} onChange={handleChange} placeholder="State" className="input" />
            <input name="homeownerZip" value={form.homeownerZip} onChange={handleChange} placeholder="Zip" className="input" />
          </div>
        </section>
        {/* Product Detail */}
        <section>
          <h2 className="font-bold text-lg mb-2">Product Detail</h2>
          <div className="grid grid-cols-2 gap-4">
            <input name="item" value={form.item} onChange={handleChange} placeholder="Item" className="input" />
            <input name="model" value={form.model} onChange={handleChange} placeholder="Model" className="input" />
            <input name="serial" value={form.serial} onChange={handleChange} placeholder="Serial #" className="input" />
            <input name="brand" value={form.brand} onChange={handleChange} placeholder="Brand" className="input" />
            <input name="dateInstalled" value={form.dateInstalled} onChange={handleChange} placeholder="Date Installed" className="input" type="date" />
            <input name="reason" value={form.reason} onChange={handleChange} placeholder="Reason of Warranty" className="input" />
            <input name="signature" value={form.signature} onChange={handleChange} placeholder="Signature" className="input" />
          </div>
        </section>
        {/* For internal use only */}
        <section>
          <h2 className="font-bold text-lg mb-2">For internal use only</h2>
          <div className="grid grid-cols-2 gap-4">
            <input name="failedPart" value={form.failedPart} onChange={handleChange} placeholder="Failed Part #" className="input" />
            <input name="newPart" value={form.newPart} onChange={handleChange} placeholder="New Part #" className="input" />
            <input name="cmFailedPart" value={form.cmFailedPart} onChange={handleChange} placeholder="CM # Failed Part" className="input" />
            <input name="soReplPart" value={form.soReplPart} onChange={handleChange} placeholder="SO # Repl Part" className="input" />
            <input name="failedPartSerial" value={form.failedPartSerial} onChange={handleChange} placeholder="Failed Part Serial #" className="input" />
            <input name="newPartSerial" value={form.newPartSerial} onChange={handleChange} placeholder="New Part Serial #" className="input" />
            <input name="unitSO" value={form.unitSO} onChange={handleChange} placeholder="Unit SO#" className="input" />
            <input name="requestReceivedBy" value={form.requestReceivedBy} onChange={handleChange} placeholder="Request Received by" className="input" />
            <input name="receivedOn" value={form.receivedOn} onChange={handleChange} placeholder="Received on" className="input" type="date" />
          </div>
        </section>
      </form>
      <div className="mt-6 flex justify-end">
        <PDFDownloadLink
          document={<WarrantyClaimPDF form={form} logo={logo} />}
          fileName="warranty-claim.pdf"
          className="btn btn-primary"
        >
          {({ loading }) => (loading ? "Generating PDF..." : "Download PDF")}
        </PDFDownloadLink>
      </div>
    </div>
  );
}

// Tailwind CSS classes like 'input' and 'btn btn-primary' are assumed. Adjust as needed.
