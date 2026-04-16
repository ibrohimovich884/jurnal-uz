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
            <span className="status-badge">v2026.0.4</span>
            <span className="update-date">{betaVersion}</span>
          </div>
          <ul className="update-features">
            <li><span>✅</span> Real-time Clock & Live Interval Integration</li>
            <li><span>✅</span> Dynamic Expandable Premium Card System</li>
            <li><span>✅</span> Horizon UI Professional Color Palette</li>
            <li><span>✅</span> Advanced PWA & Maskable Icon Optimization</li>
            <li><span>✅</span> Deep Dark/Light Mode & Contrast Refinement</li>
          </ul>
        </div>

        <button className="modal-close-btn" onClick={onClose}>
          Tushunarli
        </button>
      </div>
    </div>
  );
}