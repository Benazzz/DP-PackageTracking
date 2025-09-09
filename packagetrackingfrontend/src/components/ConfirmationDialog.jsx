import "bootstrap/dist/css/bootstrap.min.css";

function ConfirmationDialog({ status, onConfirm, onCancel }) {
  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
    >
      <div
        className="card p-4 shadow"
        style={{ maxWidth: "400px", width: "90%" }}
      >
        <p className="mb-4">
          Are you sure you want to change status to <strong>{status}</strong>?
        </p>
        <div className="d-flex justify-content-end">
          <button className="btn btn-secondary me-2" onClick={onCancel}>
            No
          </button>
          <button className="btn btn-primary" onClick={onConfirm}>
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationDialog;
