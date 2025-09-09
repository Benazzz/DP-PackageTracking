import { useState } from "react";
import { createPackage } from "../helpers/packageApi";
import "bootstrap/dist/css/bootstrap.min.css";

function CreatePackageDialog({ onClose, onCreated }) {
  const [senderName, setSenderName] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [senderAddress, setSenderAddress] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const object = {
        senderName,
        senderPhone,
        senderAddress,
        recipientName,
        recipientPhone,
        recipientAddress,
      };

      const data = await createPackage(object);
      onCreated(data);
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to create package");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
    >
      <div
        className="card p-4 shadow"
        style={{ maxWidth: "500px", width: "95%" }}
      >
        <h3 className="card-title mb-3">Create Package</h3>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <h5>Sender</h5>
          <div className="mb-3">
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Name"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              required
            />
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Phone"
              value={senderPhone}
              onChange={(e) => setSenderPhone(e.target.value)}
              required
            />
            <input
              type="text"
              className="form-control"
              placeholder="Address"
              value={senderAddress}
              onChange={(e) => setSenderAddress(e.target.value)}
              required
            />
          </div>

          <h5>Recipient</h5>
          <div className="mb-3">
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Name"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              required
            />
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Phone"
              value={recipientPhone}
              onChange={(e) => setRecipientPhone(e.target.value)}
              required
            />
            <input
              type="text"
              className="form-control"
              placeholder="Address"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              required
            />
          </div>

          <div className="d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-secondary me-2"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Package"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePackageDialog;
