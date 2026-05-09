import { useState, useEffect } from "react";

const fmt = (n) => Number(n).toLocaleString("en-IN");

const STATUS_COLORS = {
  pending:  "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

export default function Dashboard({ user, onNewApplication, onLogout }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");
  const [selected, setSelected]         = useState(null);
  const [updating, setUpdating]         = useState(false);

  useEffect(() => { fetchApplications(); }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/application/all", {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      const data = await res.json();
      if (data.success) setApplications(data.data);
      else setError("Failed to load applications");
    } catch {
      setError("Backend server nahi chal raha");
    }
    setLoading(false);
  };

  const updateStatus = async (id, status) => {
    setUpdating(true);
    try {
      const res = await fetch(`http://localhost:8000/api/application/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        setSelected(null);
        fetchApplications();
      }
    } catch {
      alert("Status update failed");
    }
    setUpdating(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <nav className="bg-blue-700 text-white px-6 py-3 flex justify-between items-center shadow">
        <h1 className="text-xl font-bold">🏦 LendSwift</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm">👤 {user?.name}</span>
          <button onClick={onNewApplication}
            className="bg-green-500 text-white text-sm px-3 py-1 rounded hover:bg-green-600">
            + New Application
          </button>
          <button onClick={onLogout}
            className="bg-white text-blue-700 text-sm px-3 py-1 rounded hover:bg-gray-100">
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto py-8 px-4">

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">My Dashboard</h2>
          <p className="text-gray-500 text-sm mt-1">Track your loan applications</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow text-center">
            <p className="text-3xl font-bold text-blue-600">{applications.length}</p>
            <p className="text-sm text-gray-500 mt-1">Total Applications</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow text-center">
            <p className="text-3xl font-bold text-yellow-500">
              {applications.filter(a => a.status === "pending" || !a.status).length}
            </p>
            <p className="text-sm text-gray-500 mt-1">Pending</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow text-center">
            <p className="text-3xl font-bold text-green-500">
              {applications.filter(a => a.status === "approved").length}
            </p>
            <p className="text-sm text-gray-500 mt-1">Approved</p>
          </div>
        </div>

        {/* Applications List */}
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-700">All Applications</h3>
            <button onClick={fetchApplications} className="text-sm text-blue-600 underline">
              Refresh
            </button>
          </div>

          {loading && <div className="text-center py-8 text-gray-400">Loading...</div>}
          {error   && <div className="text-center py-8 text-red-500">{error}</div>}

          {!loading && !error && applications.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">No applications yet</p>
              <button onClick={onNewApplication}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Apply Now
              </button>
            </div>
          )}

          {!loading && applications.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-gray-500 text-left">
                    <th className="pb-2 pr-4">App ID</th>
                    <th className="pb-2 pr-4">Loan Type</th>
                    <th className="pb-2 pr-4">Amount</th>
                    <th className="pb-2 pr-4">Date</th>
                    <th className="pb-2 pr-4">Status</th>
                    <th className="pb-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="py-3 pr-4 font-mono text-xs">LND{app.id}</td>
                      <td className="py-3 pr-4 capitalize">{app.loan_type}</td>
                      <td className="py-3 pr-4">₹{fmt(app.amount)}</td>
                      <td className="py-3 pr-4 text-gray-400">
                        {new Date(app.created_at).toLocaleDateString("en-IN")}
                      </td>
                      <td className="py-3 pr-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[app.status] || STATUS_COLORS.pending}`}>
                          {app.status || "pending"}
                        </span>
                      </td>
                      <td className="py-3">
                        <button onClick={() => setSelected(app)}
                          className="text-blue-600 text-xs underline">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Application Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-screen overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Application Details</h3>
              <button onClick={() => setSelected(null)}
                className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>

            <div className="space-y-2 text-sm">
              {[
                ["App ID",     `LND${selected.id}`],
                ["Loan Type",  selected.loan_type],
                ["Amount",     `₹${fmt(selected.amount)}`],
                ["Applicant",  selected.name],
                ["Mobile",     selected.mobile],
                ["Email",      selected.email],
                ["PAN",        selected.pan ? `****${selected.pan.slice(-4)}` : "—"],
                ["State",      selected.state],
                ["Applied On", new Date(selected.created_at).toLocaleDateString("en-IN")],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between py-2 border-b last:border-0">
                  <span className="text-gray-500">{label}</span>
                  <span className="font-medium capitalize">{value}</span>
                </div>
              ))}

              {/* Status */}
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Status</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[selected.status] || STATUS_COLORS.pending}`}>
                  {selected.status || "pending"}
                </span>
              </div>
            </div>

            {/* Approve / Reject Buttons - sirf pending pe dikhega */}
            {(selected.status === "pending" || !selected.status) && (
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => updateStatus(selected.id, "approved")}
                  disabled={updating}
                  className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600 font-medium disabled:bg-gray-400"
                >
                  {updating ? "Updating..." : "✅ Approve"}
                </button>
                <button
                  onClick={() => updateStatus(selected.id, "rejected")}
                  disabled={updating}
                  className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 font-medium disabled:bg-gray-400"
                >
                  {updating ? "Updating..." : "❌ Reject"}
                </button>
              </div>
            )}

            {/* Already resolved message */}
            {selected.status === "approved" && (
              <div className="mt-4 p-2 bg-green-50 text-green-700 text-sm text-center rounded">
                ✅ This application has been approved
              </div>
            )}
            {selected.status === "rejected" && (
              <div className="mt-4 p-2 bg-red-50 text-red-700 text-sm text-center rounded">
                ❌ This application has been rejected
              </div>
            )}

            <button onClick={() => setSelected(null)}
              className="w-full mt-3 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
