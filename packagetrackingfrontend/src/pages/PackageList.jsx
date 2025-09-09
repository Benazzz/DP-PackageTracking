import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CreatePackageDialog from "../components/CreatePackageDialog";
import ConfirmationDialog from "../components/ConfirmationDialog";
import { statusTransitions } from "../helpers/statusTransitions";
import { fetchPackages, changePackageStatus } from "../helpers/packageApi";
import "bootstrap/dist/css/bootstrap.min.css";

function PackageList() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [pendingPackage, setPendingPackage] = useState(null);
  const [pendingStatus, setPendingStatus] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");

  const [trackingFilter, setTrackingFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchPackagesList();
  }, []);

  const fetchPackagesList = async () => {
    try {
      const params = {};
      if (trackingFilter) params.trackingNumber = trackingFilter;
      if (statusFilter) params.status = statusFilter;

      const data = await fetchPackages(params);
      setPackages(data);
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
      await changePackageStatus(pendingPackage.id, pendingStatus);
      setStatusMessage(`Status changed to "${pendingStatus}" successfully!`);
      fetchPackagesList();
    } catch (error) {
      setStatusMessage("Failed to change status. Try again.");
    } finally {
      setPendingPackage(null);
      setPendingStatus(null);
      setTimeout(() => setStatusMessage(""), 3000);
    }
  };

  const cancelStatusChange = () => {
    setPendingPackage(null);
    setPendingStatus(null);
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Package List</h1>
        <button className="btn btn-primary" onClick={() => setShowDialog(true)}>
          Create Package
        </button>
      </div>

      {showDialog && (
        <CreatePackageDialog
          onClose={() => setShowDialog(false)}
          onCreated={handlePackageCreated}
        />
      )}

      <div className="row mb-4 g-2 align-items-end">
        <div className="col-md-4">
          <label className="form-label">Tracking Number</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter tracking number"
            value={trackingFilter}
            onChange={(e) => setTrackingFilter(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Status</label>
          <select
            className="form-select"
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
        </div>
        <div className="col-md-4">
          <button className="btn btn-success mt-2" onClick={fetchPackagesList}>
            Apply Filters
          </button>
        </div>
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

      <div className="row g-3">
        {packages.length === 0 && (
          <div className="col-12 text-center text-muted">
            No packages found.
          </div>
        )}

        {packages
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map((pkg) => {
            const availableStatuses =
              statusTransitions[pkg.currentStatus] || [];
            return (
              <div key={pkg.id} className="col-md-6 col-lg-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <Link
                      to={`/packages/${pkg.id}`}
                      className="text-decoration-none text-dark"
                    >
                      <h5 className="card-title mb-2">
                        Tracking: {pkg.trackingNumber}
                      </h5>
                      <p className="card-text mb-1">
                        <strong>Sender:</strong> {pkg.senderName}
                      </p>
                      <p className="card-text mb-1">
                        <strong>Recipient:</strong> {pkg.recipientName}
                      </p>
                      <p className="card-text mb-1">
                        <strong>Status:</strong> {pkg.currentStatus}
                      </p>
                      <p className="card-text text-muted">
                        Created At:{" "}
                        {new Date(pkg.createdAt).toLocaleDateString("en-CA")}
                      </p>
                    </Link>

                    {availableStatuses.length > 0 && (
                      <div className="mt-3">
                        <small className="text-muted">
                          Quick Status Change:
                        </small>
                        <div className="d-flex flex-wrap gap-2 mt-1">
                          {availableStatuses.map((status) => (
                            <button
                              key={status}
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleStatusClick(pkg, status)}
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
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

export default PackageList;
