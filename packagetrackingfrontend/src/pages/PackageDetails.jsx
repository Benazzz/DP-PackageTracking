import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../helpers/api";
import { statusTransitions } from "../helpers/statusTransitions";
import ConfirmationDialog from "../components/ConfirmationDialog";

function PackageDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingStatus, setPendingStatus] = useState(null); 
  const [statusMessage, setStatusMessage] = useState(""); 

  useEffect(() => {
    fetchPackage();
  }, [id]);

  const fetchPackage = async () => {
    try {
      const response = await api.get(`/Packages/${id}`);
      setPkg(response.data);
    } catch (err) {
      console.error("Error fetching package:", err);
      setError("Failed to load package details");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeStatus = (newStatus) => {
    setPendingStatus(newStatus);
  };

  const confirmStatusChange = async () => {
    try {
      await api.post(`/Packages/${id}/status`, pendingStatus);
      setPendingStatus(null);
      setStatusMessage(`Status changed to "${pendingStatus}" successfully!`);
      fetchPackage(); 
    } catch (err) {
      console.error("Error changing status:", err);
      setStatusMessage("Failed to change status. Try again.");
      setPendingStatus(null);
    }
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const cancelStatusChange = () => {
    setPendingStatus(null);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!pkg) return <div>No package found</div>;

  const availableStatuses = statusTransitions[pkg.currentStatus] || [];

  return (
    <div>
      <h1>Package Details</h1>
      <button onClick={() => navigate("/")}>← Back to Package List</button>

      <p><strong>Tracking Number:</strong> {pkg.trackingNumber}</p>

      <h3>Sender</h3>
      <p>Name: {pkg.senderName}</p>
      <p>Phone: {pkg.senderPhone}</p>
      <p>Address: {pkg.senderAddress}</p>

      <h3>Recipient</h3>
      <p>Name: {pkg.recipientName}</p>
      <p>Phone: {pkg.recipientPhone}</p>
      <p>Address: {pkg.recipientAddress}</p>

      <h3>Status</h3>
      <p>
        Current: <strong>{pkg.currentStatus}</strong> (since {new Date(pkg.createdAt).toLocaleString("en-CA", {hour12: false})})
      </p>
      {statusMessage && <p style={{ color: statusMessage.includes("Failed") ? "red" : "green" }}>{statusMessage}</p>}

      {availableStatuses.length > 0 && (
        <div>
          <h4>Change Status:</h4>
          {availableStatuses.map((status) => (
            <button key={status} onClick={() => handleChangeStatus(status)}>
              {status}
            </button>
          ))}
        </div>
      )}

    <h3>Status History</h3>
    <ul>
      {pkg.statusHistory
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) 
        .map((s, index) => (
          <li key={index}>
            {s.status} at {new Date(s.timestamp).toLocaleString("en-CA", { hour12: false })}
          </li>
        ))
      }
    </ul>

      {pendingStatus && (
        <ConfirmationDialog
          message={`Are you sure you want to change status to "${pendingStatus}"?`}
          onConfirm={confirmStatusChange}
          onCancel={cancelStatusChange}
        />
      )}
    </div>
  );
}

export default PackageDetails;
