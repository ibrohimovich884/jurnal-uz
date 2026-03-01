import "./UpdateModal.css";

export default function UpdateModal({ isOpen, onClose, betaVersion }) {
  if (!isOpen) return null;

  return (
    <div className="update-overlay" onClick={onClose}>
      <div className="update-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="pulse-icon">🔔</div>
          <h3>So‘nggi yangilanish</h3>
        </div>
        
        <div className="modal-body">
          <div className="update-status">
            <span className="status-badge">v2026.0.2</span>
            <span className="update-date">{betaVersion}</span>
          </div>
          <ul className="update-features">
            <li><span>✅</span> Online avtomatik yangilash tizimi</li>
            <li><span>✅</span> Raspisaniya 2026 o'quv yiliga moslandi</li>
            <li><span>✅</span> Glassmorphism UI/UX dizayn</li>
            <li><span>✅</span> Oxirigi dars vaqti va ustozni ko'rsatish</li>
            <li><span>✅</span> Dark/Light mode optimizatsiyasi</li>
          </ul>
        </div>

        <button className="modal-close-btn" onClick={onClose}>
          Tushunarli
        </button>
      </div>
    </div>
  );
}