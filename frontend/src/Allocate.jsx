import { useState, useEffect } from "react";
import API from "./api";

export default function Allocate() {
  const [programs, setPrograms] = useState([]);
  const [apps, setApps] = useState([]);

  const [programId, setProgramId] = useState("");
  const [applicantId, setApplicantId] = useState("");
  const [quota, setQuota] = useState("KCET");

  useEffect(() => {
    API.get("/programs").then(r => setPrograms(r.data));
    API.get("/applicants").then(r => setApps(r.data));
  }, []);

  const allocate = async () => {
    await API.post("/admissions/allocate", {
      programId,
      applicantId,
      quota
    });
    alert("Seat Allocated");
  };

  return (
    <div>
      <h2>Allocate Seat</h2>

      <select onChange={e => setProgramId(e.target.value)}>
        <option>Select Program</option>
        {programs.map(p => (
          <option value={p._id}>{p.name}</option>
        ))}
      </select>

      <select onChange={e => setApplicantId(e.target.value)}>
        <option>Select Applicant</option>
        {apps.map(a => (
          <option value={a._id}>{a.name}</option>
        ))}
      </select>

      <select onChange={e => setQuota(e.target.value)}>
        <option>KCET</option>
        <option>COMEDK</option>
        <option>Management</option>
      </select>

      <button onClick={allocate}>Allocate</button>
    </div>
  );
}