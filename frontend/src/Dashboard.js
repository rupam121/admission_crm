import Navbar from "./components/Navbar";
import { useEffect, useState } from "react";
import API from "./api";

export default function Dashboard() {
  const [data, setData] = useState({});

  useEffect(() => {
    API.get("/dashboard").then(res => setData(res.data));
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-6 grid grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-2xl p-6">
          <h2 className="text-gray-500">Total Seats</h2>
          <p className="text-3xl font-bold">{data.total}</p>
        </div>

        <div className="bg-green-100 shadow rounded-2xl p-6">
          <h2>Filled</h2>
          <p className="text-3xl">{data.filled}</p>
        </div>

        <div className="bg-blue-100 shadow rounded-2xl p-6">
          <h2>Remaining</h2>
          <p className="text-3xl">{data.remaining}</p>
        </div>
      </div>
    </>
  );
}