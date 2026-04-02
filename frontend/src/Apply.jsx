import { useState, useEffect } from "react";
import API from "./api";

export default function Apply() {
  const [programs, setPrograms] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    category: "GM",
    quota: "KCET",
    marks: "",
    program: ""
  });

  useEffect(() => {
    API.get("/programs").then(res => setPrograms(res.data));
  }, []);

  const submit = async () => {
    try {
      await API.post("/applicants", form);
      alert("✅ Application Submitted");
      setForm({
        name: "",
        email: "",
        phone: "",
        category: "GM",
        quota: "KCET",
        marks: "",
        program: ""
      });
    } catch (err) {
      alert(err.response?.data?.error || "Error");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Apply for Admission</h2>

      <input placeholder="Name"
        value={form.name}
        onChange={e => setForm({...form, name: e.target.value})}
        className="border p-2 w-full mb-2"
      />

      <input placeholder="Email"
        value={form.email}
        onChange={e => setForm({...form, email: e.target.value})}
        className="border p-2 w-full mb-2"
      />

      <input placeholder="Phone"
        value={form.phone}
        onChange={e => setForm({...form, phone: e.target.value})}
        className="border p-2 w-full mb-2"
      />

      <select
        value={form.program}
        onChange={e => setForm({...form, program: e.target.value})}
        className="border p-2 w-full mb-2"
      >
        <option value="">Select Program</option>
        {programs.map(p => (
          <option key={p._id} value={p._id}>{p.name}</option>
        ))}
      </select>

      <select
        value={form.quota}
        onChange={e => setForm({...form, quota: e.target.value})}
        className="border p-2 w-full mb-2"
      >
        <option>KCET</option>
        <option>COMEDK</option>
        <option>Management</option>
      </select>

      <select
        value={form.category}
        onChange={e => setForm({...form, category: e.target.value})}
        className="border p-2 w-full mb-2"
      >
        <option>GM</option>
        <option>SC</option>
        <option>ST</option>
      </select>

      <input placeholder="Marks"
        value={form.marks}
        onChange={e => setForm({...form, marks: e.target.value})}
        className="border p-2 w-full mb-2"
      />

      <button
        onClick={submit}
        className="bg-blue-500 text-white p-2 w-full rounded"
      >
        Apply
      </button>
    </div>
  );
}