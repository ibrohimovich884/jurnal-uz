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
            <span className="status-badge">v2026.1.6</span>
            <span className="update-date">{betaVersion}</span>
          </div>
          <ul className="update-features">
            <li><span>✅</span> 8-A, 8-B va 9-B sinflari dars jadvallari to‘liq yangilandi</li>
            <li><span>✅</span> O‘qituvchilar (Djumayev B.K., Alimova M.S., Jontayev A.A.) va xonalar yangilandi</li>
            <li><span>✅</span> 9-A, 10-A, 10-B va 11-sinflar jadvallari ham dolzarb holatda</li>
            <li><span>✅</span> Jonli dars va tanaffus vaqti hisoblagichi faol</li>
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