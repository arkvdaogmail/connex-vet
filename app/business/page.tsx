
'use client';
import { useState } from "react";
export default function BusinessProofPage() {
  const [form, setForm] = useState({
    entity: "",
    domain: "",
    country: "",
    legalType: "",
    category: "",
    sha: "",
    dnsVerified: false,
    txHash: "",
    status: ""
  });

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const generateSHA = async () => {
    const encoder = new TextEncoder();
    const data = `${form.entity}|${form.domain}|${form.country}|${form.legalType}|${form.category}`;
    const hashBuffer = await crypto.subtle.digest("SHA-256", encoder.encode(data));
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    setForm((prev) => ({ ...prev, sha: hashHex }));
  };

  const checkDNS = async () => {
    try {
      const res = await fetch(`https://dns.google/resolve?name=_arkv.${form.domain}&type=TXT`);
      const json = await res.json();
      const record = json.Answer?.find((a) => a.data.includes(form.sha));
      setForm((prev) => ({ ...prev, dnsVerified: !!record }));
    } catch (err) {
      setForm((prev) => ({ ...prev, dnsVerified: false }));
    }
  };

  const mockTxSign = async () => {
    const tx = "0x" + form.sha.slice(0, 12);
    setForm((prev) => ({ ...prev, txHash: tx, status: "Proof recorded" }));
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Register Business Domain Proof</h1>
      <input name="entity" placeholder="Entity Name" onChange={handleInput} className="w-full p-2 border rounded" />
      <input name="domain" placeholder="Domain (example.com)" onChange={handleInput} className="w-full p-2 border rounded" />
      <input name="country" placeholder="Country" onChange={handleInput} className="w-full p-2 border rounded" />
      <input name="legalType" placeholder="Legal Type (LLC, DAO)" onChange={handleInput} className="w-full p-2 border rounded" />
      <input name="category" placeholder="Category (Finance, Health...)" onChange={handleInput} className="w-full p-2 border rounded" />

      <button onClick={generateSHA} className="bg-blue-500 text-white px-4 py-2 rounded">Generate SHA-ID</button>
      {form.sha && <p className="text-sm">SHA-ID: <code>{form.sha}</code></p>}

      <button onClick={checkDNS} disabled={!form.sha} className="bg-green-500 text-white px-4 py-2 rounded">Verify Domain TXT Record</button>
      <p className="text-sm">DNS Verified: {form.dnsVerified ? "✅" : "❌"}</p>

      <button onClick={mockTxSign} disabled={!form.dnsVerified} className="bg-purple-500 text-white px-4 py-2 rounded">Sign TX (Simulated)</button>
      <p className="text-sm">TX Hash: {form.txHash}</p>
      <p className="text-green-600">{form.status}</p>
    </div>
  );
}
