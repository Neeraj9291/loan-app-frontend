import { useEffect, useState } from "react";

const STATUS_COLORS = {
  pending:  "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

export default function AdminDashboard({ goBack }) {
  const [apps, setApps]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState("all");
  const [selected, setSelected] = useState(null);

  const fetchApps = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/application/all");
      const data = await res.json();
      setApps(data.data || []);
    } catch {
      alert("Backend se data nahi aaya");
    }
    setLoading(false);
  };

  useEffect(() => { fetchApps(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await fetch(`http://localhost:8000/api/application/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setApps((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a))
      );
      if (selected?.id === id) setSelected((p) => ({ ...p, status }));
    } catch {
      alert("Status update failed");
    }
  };

  const filtered = filter === "all" ? apps : apps.filter((a) => a.status === filter);

  const counts = {
    all:      apps.length,
    pending:  apps.filter((a) => a.status === "pending").length,
    approved: apps.filter((a) => a.status === "approved").length,
    rejected: apps.filter((a) => a.status === "rejected").length,
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-700 text-white px-6 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold">🏦 LendSwift - Admin Panel</h1>
        <button onClick={goBack}
          className="bg-white text-blue-700 text-sm px-3 py-1 rounded hover:bg-gray-100">
          ← Back to App
        </button>
      </nav>

      <div className="max-w-6xl mx-auto p-6">

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total",    key: "all",      color: "bg-blue-500" },
            { label: "Pending",  key: "pending",  color: "bg-yellow-500" },
            { label: "Approved", key: "approved", color: "bg-green-500" },
            { label: "Rejected", key: "rejected", color: "bg-red-500" },
          ].map(({ label, key, color }) => (
            <div key={key} className={`${color} text-white rounded-xl p-4 text-center cursor-pointer`}
              onClick={() => setFilter(key)}>
              <p className="text-3xl font-bold">{counts[key]}</p>
              <p className="text-sm">{label}</p>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4">
          {["all", "pending", "approved", "rejected"].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-1 rounded-full text-sm font-medium capitalize
                ${filter === f ? "bg-blue-600 text-white" : "bg-white text-gray-600 border"}`}>
              {f}
            </button>
          ))}
          <button onClick={fetchApps} className="ml-auto text-sm text-blue-600 underline">
            🔄 Refresh
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <p className="text-center text-gray-500 py-10">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-10">Koi application nahi mili</p>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Loan Type</th>
                  <th className="px-4 py-3 text-left">Amount</th>
                  <th className="px-4 py-3 text-left">Mobile</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-gray-500">#{app.id}</td>
                    <td className="px-4 py-3 font-medium cursor-pointer text-blue-600"
                      onClick={() => setSelected(app)}>
                      {app.name}
                    </td>
                    <td className="px-4 py-3 capitalize">{app.loan_type}</td>
                    <td className="px-4 py-3">₹{Number(app.amount).toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3">{app.mobile}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[app.status]}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {app.status !== "approved" && (
                          <button onClick={() => updateStatus(app.id, "approved")}
                            className="bg-green-500 text-white text-xs px-2 py-1 rounded hover:bg-green-600">
                            ✓ Approve
                          </button>
                        )}
                        {app.status !== "rejected" && (
                          <button onClick={() => updateStatus(app.id, "rejected")}
                            className="bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600">
                            ✗ Reject
                          </button>
                        )}
                        {app.status !== "pending" && (
                          <button onClick={() => updateStatus(app.id, "pending")}
                            className="bg-yellow-500 text-white text-xs px-2 py-1 rounded hover:bg-yellow-600">
                            ↺ Pending
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[80vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Application #{selected.id}</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            {[
              ["Name",        selected.name],
              ["Email",       selected.email],
              ["Mobile",      selected.mobile],
              ["DOB",         selected.dob],
              ["PAN",         selected.pan ? `****${selected.pan.slice(-4)}` : "—"],
              ["Aadhaar",     selected.aadhaar ? `****${selected.aadhaar.slice(-4)}` : "—"],
              ["Loan Type",   selected.loan_type],
              ["Amount",      `₹${Number(selected.amount).toLocaleString("en-IN")}`],
              ["Address",     selected.address],
              ["Pincode",     selected.pincode],
              ["State",       selected.state],
              ["Status",      selected.status],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between py-2 border-b text-sm">
                <span className="text-gray-500">{label}</span>
                <span className="font-medium capitalize">{value || "—"}</span>
              </div>
            ))}
            <div className="flex gap-2 mt-4">
              {selected.status !== "approved" && (
                <button onClick={() => updateStatus(selected.id, "approved")}
                  className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600">
                  ✓ Approve
                </button>
              )}
              {selected.status !== "rejected" && (
                <button onClick={() => updateStatus(selected.id, "rejected")}
                  className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600">
                  ✗ Reject
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
