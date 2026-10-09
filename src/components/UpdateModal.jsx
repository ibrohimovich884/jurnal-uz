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
            <span className="status-badge">v2026.1.0</span>
            <span className="update-date">{betaVersion}</span>
          </div>
          <ul className="update-features">
            <li><span>✅</span> 10-B va 10-A sinflari dars jadvali to‘liq yangilandi</li>
            <li><span>✅</span> 9-A va 9-B sinflari jadvali yangi dars rejasiga moslashtirildi</li>
            <li><span>✅</span> Xonalar va o‘qituvchilar taqsimoti to‘liq tekshirildi</li>
            <li><span>✅</span> Jonli dars va tanaffus vaqti hisoblagichi</li>
            <li><span>✅</span> Yangilangan dars ma’lumotlari va interaktiv kartalar</li>
          </ul>
        </div>

        <button className="modal-close-btn" onClick={onClose}>
          Tushunarli
        </button>
      </div>
    </div>
  );
}