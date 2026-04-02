import { useState, useEffect } from "react";
import API from "./api";

export default function Programs() {
  const [programs, setPrograms] = useState([]);
  const [form, setForm] = useState({
    name: "",
    intake: 0,
    KCET: 0,
    COMEDK: 0,
    Management: 0,
  });

  const load = () => {
    API.get("/programs").then((res) => setPrograms(res.data));
  };

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    await API.post("/programs", {
      name: form.name,
      intake: Number(form.intake),
      quotas: {
        KCET: Number(form.KCET),
        COMEDK: Number(form.COMEDK),
        Management: Number(form.Management),
      },
    });
    load();
  };

  // ✅ PREDEFINED PROGRAMS FUNCTION
  const addDefaultPrograms = async () => {
    const defaultPrograms = [
      {
        name: "Computer Science",
        intake: 120,
        quotas: { KCET: 60, COMEDK: 30, Management: 30 },
      },
      {
        name: "Mechanical Engineering",
        intake: 90,
        quotas: { KCET: 45, COMEDK: 25, Management: 20 },
      },
      {
        name: "Civil Engineering",
        intake: 60,
        quotas: { KCET: 30, COMEDK: 15, Management: 15 },
      },
    ];

    for (let p of defaultPrograms) {
      await API.post("/programs", p);
    }

    load();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create Program</h2>

      <input
        placeholder="Name"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        placeholder="Intake"
        onChange={(e) =>
          setForm({ ...form, intake: e.target.value })
        }
      />
      <input
        placeholder="KCET"
        onChange={(e) =>
          setForm({ ...form, KCET: e.target.value })
        }
      />
      <input
        placeholder="COMEDK"
        onChange={(e) =>
          setForm({ ...form, COMEDK: e.target.value })
        }
      />
      <input
        placeholder="Management"
        onChange={(e) =>
          setForm({ ...form, Management: e.target.value })
        }
      />

      <br /><br />

      <button onClick={create}>Create</button>

      {/* ✅ NEW BUTTON */}
      <button
        onClick={addDefaultPrograms}
        style={{ marginLeft: "10px" }}
      >
        Add Default Programs
      </button>

      <h3>Programs</h3>
      {programs.map((p) => (
        <div key={p._id}>
          {p.name} | Intake: {p.intake}
        </div>
      ))}
    </div>
  );
}