import { useEffect, useState } from "react";
import api from "../helpers/api";
import { Link } from "react-router-dom";
import CreatePackageDialog from "../components/CreatePackageDialog";
import ConfirmationDialog from "../components/ConfirmationDialog";
import { statusTransitions } from "../helpers/statusTransitions";

function PackageList() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [pendingPackage, setPendingPackage] = useState(null);
  const [pendingStatus, setPendingStatus] = useState(null); 
  const [statusMessage, setStatusMessage] = useState(""); 

  // Filter states
  const [trackingFilter, setTrackingFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const params = {};
      if (trackingFilter) params.trackingNumber = trackingFilter;
      if (statusFilter) params.status = statusFilter;

      const response = await api.get("/Packages", { params });
      setPackages(response.data);
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePackageCreated = (newPackage) => {
    setPackages((prev) => [newPackage, ...prev]);
  };

  const handleStatusClick = (pkg, newStatus) => {
    setPendingPackage(pkg);
    setPendingStatus(newStatus);
  };

  const confirmStatusChange = async () => {
    try {
      await api.post(`/Packages/${pendingPackage.id}/status`, pendingStatus);
      setPendingPackage(null);
      setPendingStatus(null);
      setStatusMessage(`Status changed to "${pendingStatus}" successfully!`);
      fetchPackages(); 
    } catch (error) {
      console.error("Error changing status:", error);
      setStatusMessage("Failed to change status. Try again.");
      setPendingPackage(null);
      setPendingStatus(null);
    }
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const cancelStatusChange = () => {
    setPendingPackage(null);
    setPendingStatus(null);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Package list</h1>
      <button onClick={() => setShowDialog(true)}>Create Package</button>

      {showDialog && (
        <CreatePackageDialog
          onClose={() => setShowDialog(false)}
          onCreated={handlePackageCreated}
        />
      )}

      <div style={{ margin: "1rem 0" }}>
        <input
          type="text"
          placeholder="Filter by tracking number"
          value={trackingFilter}
          onChange={(e) => setTrackingFilter(e.target.value)}
          style={{ marginRight: "1rem" }}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Created">Created</option>
          <option value="Sent">Sent</option>
          <option value="Accepted">Accepted</option>
          <option value="Returned">Returned</option>
          <option value="Canceled">Canceled</option>
        </select>
        <button onClick={fetchPackages} style={{ marginLeft: "1rem" }}>Filter</button>
      </div>

      <div>
        {packages
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map((pkg) => {
            const availableStatuses = statusTransitions[pkg.currentStatus] || [];
            return (
              <div
                key={pkg.id}
                style={{
                  border: "1px solid #ccc",
                  margin: "10px",
                  padding: "10px",
                }}
              >
                <Link to={`/packages/${pkg.id}`}>
                  <p>Tracking Number: {pkg.trackingNumber}</p>
                  <p>Sender: {pkg.senderName}</p>
                  <p>Recipient: {pkg.recipientName}</p>
                  <p>Status: {pkg.currentStatus}</p>
                  <p>
                    Created At:{" "}
                    {new Date(pkg.createdAt).toLocaleDateString("en-CA")}
                  </p>
                </Link>

                {availableStatuses.length > 0 && (
                  <div>
                    <strong>Quick Status Change:</strong>
                    {availableStatuses.map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusClick(pkg, status)}
                        style={{ marginLeft: "5px" }}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {pendingStatus && (
        <ConfirmationDialog
          message={`Are you sure you want to change status to "${pendingStatus}"?`}
          onConfirm={confirmStatusChange}
          onCancel={cancelStatusChange}
        />
      )}
      {statusMessage && (
        <p style={{ color: statusMessage.includes("Failed") ? "red" : "green" }}>
          {statusMessage}
        </p>
      )}
    </div>
  );
}

export default PackageList;
