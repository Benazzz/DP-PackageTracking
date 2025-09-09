import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { statusTransitions } from "../helpers/statusTransitions";
import ConfirmationDialog from "../components/ConfirmationDialog";
import { fetchPackageById, changePackageStatus } from "../helpers/packageApi";
import "bootstrap/dist/css/bootstrap.min.css";

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
      const data = await fetchPackageById(id);
      setPkg(data);
    } catch (err) {
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
      await changePackageStatus(id, pendingStatus);
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

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="alert alert-danger mt-3">{error}</div>;
  if (!pkg) return <div className="text-center mt-3">No package found</div>;

  const availableStatuses = statusTransitions[pkg.currentStatus] || [];

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Package Details</h1>
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate("/")}
        >
          ← Back to Package List
        </button>
      </div>

      {statusMessage && (
        <div
          className={`alert ${
            statusMessage.includes("Failed") ? "alert-danger" : "alert-success"
          }`}
        >
          {statusMessage}
        </div>
      )}

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Tracking Number: {pkg.trackingNumber}</h5>

          <div className="row">
            <div className="col-md-6">
              <h6>Sender</h6>
              <p className="mb-1">
                <strong>Name:</strong> {pkg.senderName}
              </p>
              <p className="mb-1">
                <strong>Phone:</strong> {pkg.senderPhone}
              </p>
              <p className="mb-0">
                <strong>Address:</strong> {pkg.senderAddress}
              </p>
            </div>

            <div className="col-md-6">
              <h6>Recipient</h6>
              <p className="mb-1">
                <strong>Name:</strong> {pkg.recipientName}
              </p>
              <p className="mb-1">
                <strong>Phone:</strong> {pkg.recipientPhone}
              </p>
              <p className="mb-0">
                <strong>Address:</strong> {pkg.recipientAddress}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Status</h5>

          <p>
            Current:{" "}
            <span className="badge bg-primary">{pkg.currentStatus}</span>
            <small className="text-muted ms-2">
              (since{" "}
              {new Date(pkg.createdAt).toLocaleString("en-CA", {
                hour12: false,
              })}
              )
            </small>
          </p>

          {availableStatuses.length > 0 && (
            <div className="mb-3">
              <h6>Change Status:</h6>
              {availableStatuses.map((status) => (
                <button
                  key={status}
                  className="btn btn-sm btn-outline-primary me-2 mb-2"
                  onClick={() => handleChangeStatus(status)}
                >
                  {status}
                </button>
              ))}
            </div>
          )}

          <h6>Status History</h6>
          <ul className="list-group list-group-flush">
            {pkg.statusHistory
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
              .map((s, index) => (
                <li
                  key={index}
                  className="list-group-item d-flex justify-content-between"
                >
                  {s.status}
                  <small className="text-muted">
                    {new Date(s.timestamp).toLocaleString("en-CA", {
                      hour12: false,
                    })}
                  </small>
                </li>
              ))}
          </ul>
        </div>
      </div>

      {pendingStatus && (
        <ConfirmationDialog
          status={pendingStatus}
          onConfirm={confirmStatusChange}
          onCancel={cancelStatusChange}
        />
      )}
    </div>
  );
}

export default PackageDetails;
