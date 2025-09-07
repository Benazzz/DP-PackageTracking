import { useState } from "react";
import api from "../helpers/api";

function CreatePackageDialog({onClose, onCreated}) {
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

        const response = await api.post("/Packages", object);
        onCreated(response.data);
        onClose();
    }
    catch {
        console.error(err);
        setError("Failed to create package");
    }
    finally {
        setLoading(false);
    }
  };

  return (
    <div className="dialog">
      <h2>Create Package</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <h3>Sender</h3>
        <input placeholder="Name" value={senderName} onChange={(e) => setSenderName(e.target.value)} required />
        <input placeholder="Phone" value={senderPhone} onChange={(e) => setSenderPhone(e.target.value)} required />
        <input placeholder="Address" value={senderAddress} onChange={(e) => setSenderAddress(e.target.value)} required />

        <h3>Recipient</h3>
        <input placeholder="Name" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} required />
        <input placeholder="Phone" value={recipientPhone} onChange={(e) => setRecipientPhone(e.target.value)} required />
        <input placeholder="Address" value={recipientAddress} onChange={(e) => setRecipientAddress(e.target.value)} required />

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Package"}
        </button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );  
}

export default CreatePackageDialog;