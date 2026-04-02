import { useState, useEffect } from "react";
import API from "./api";

export default function Applicants() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    category: "GM",
    quota: "KCET",
    marks: "",
    feeStatus: "Pending",
    documentStatus: "Pending",
  });

  // Load applicants
  const load = async () => {
    try {
      const res = await API.get("/applicants");
      setList(res.data);
    } catch (err) {
      alert("Failed to load applicants");
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Create applicant
  const create = async () => {
    try {
      setLoading(true);

      await API.post("/applicants", {
        ...form,
        marks: Number(form.marks),
      });

      setForm({
        name: "",
        category: "GM",
        quota: "KCET",
        marks: "",
        feeStatus: "Pending",
        documentStatus: "Pending",
      });

      load();
    } catch (err) {
      alert(err.response?.data?.error || "Create failed");
    } finally {
      setLoading(false);
    }
  };

  // Update fee
  const updateFee = async (id, status) => {
    try {
      await API.put(`/applicants/${id}`, { feeStatus: status });

      setList((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, feeStatus: status } : item,
        ),
      );
    } catch (err) {
      alert(err.response?.data?.error || "Fee update failed");
    }
  };

 const updateDocument = async (id, status) => {
  try {
    await API.put(`/applicants/${id}`, { documentStatus: status });
    
    setList((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, documentStatus: status } : item
      )
    );
    return true; // ✅ Return success
    
  } catch (err) {
    alert(err.response?.data?.error || "Document update failed");
    return false;
  }
};

const confirmAdmission = async (id) => {
  try {
    // 🔥 STEP 1: Ensure verified FIRST
    const updateSuccess = await updateDocument(id, "Verified");
    if (!updateSuccess) return; // Exit if update failed

    // 🔥 STEP 2: Wait for backend sync (1 second)
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 🔥 STEP 3: Now confirm
    const res = await API.post(`/applicants/confirm/${id}`);
    alert("✅ Admission No: " + res.data.admissionNumber);

    load();
  } catch (err) {
    console.error('Confirm error:', err.response?.data); // Debug
    alert(err.response?.data?.error || "Confirmation failed");
  }
};

  return (
    <div style={{ padding: "20px" }}>
      <h2>Applicants</h2>

      {/* FORM */}
      <input
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <select
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
      >
        <option>GM</option>
        <option>SC</option>
        <option>ST</option>
      </select>

      <select
        value={form.quota}
        onChange={(e) => setForm({ ...form, quota: e.target.value })}
      >
        <option>KCET</option>
        <option>COMEDK</option>
        <option>Management</option>
      </select>

      <input
        placeholder="Marks"
        value={form.marks}
        onChange={(e) => setForm({ ...form, marks: e.target.value })}
      />

      {/* Document Status */}
      <select
        value={form.documentStatus}
        onChange={(e) =>
          setForm({
            ...form,
            documentStatus: e.target.value,
          })
        }
      >
        <option>Pending</option>
        <option>Verified</option>
        <option>Rejected</option>
      </select>

      <button onClick={create} disabled={loading}>
        {loading ? "Adding..." : "Add Applicant"}
      </button>

      <hr />

      {/* LIST */}
      {list.map((a) => (
        <div
          key={a._id}
          style={{
            marginBottom: "12px",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        >
          <b>{a.name}</b> | {a.quota} | {a.category}
          {/* Fee */}
          <div>
            Fee:
            <select
              value={a.feeStatus ?? "Pending"}
              onChange={(e) => updateFee(a._id, e.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
          {/* Document */}
          <div>
            Documents:
            <select
              value={a.documentStatus ?? "Pending"}
              onChange={(e) => updateDocument(a._id, e.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="Verified">Verified</option>
              <option value="Rejected">Rejected</option>
            </select>
            {/* Status Badge */}
            <span
              style={{
                marginLeft: "10px",
                fontWeight: "bold",
                color:
                  a.documentStatus === "Verified"
                    ? "green"
                    : a.documentStatus === "Rejected"
                      ? "red"
                      : "orange",
              }}
            >
              {a.documentStatus}
            </span>
          </div>
          {/* Confirm */}
          {!a.isConfirmed ? (
            <button
              disabled={
                a.feeStatus !== "Paid" || a.documentStatus !== "Verified"
              }
              onClick={() => confirmAdmission(a._id, a)}
              style={{ marginTop: "8px" }}
            >
              Confirm Admission
            </button>
          ) : (
            <p style={{ color: "green", marginTop: "8px" }}>
              Admission No: {a.admissionNumber}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
