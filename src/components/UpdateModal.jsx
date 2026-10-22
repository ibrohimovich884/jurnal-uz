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
            <span className="status-badge">v2026.1.7</span>
            <span className="update-date">{betaVersion}</span>
          </div>
          <ul className="update-features">
            <li><span>⭐</span> <b>Mening sinfim:</b> Sinflar tartibini erkin surib, o'z sinfingizni birinchi o'ringa qo'yish imkoni</li>
            <li><span>📤</span> <b>Telegramga ulashish:</b> Kunlik dars jadvalini bitta tugma bilan chiroyli nusxalash</li>
            <li><span>✓</span> <b>O'tgan darslar:</b> Bugungi o'tib bo'lgan darslar avtomatik belgilanadi</li>
            <li><span>⚡</span> <b>100% Oflayn:</b> To'liq internetga bog'lanmagan tezkor ish tartibi</li>
            <li><span>🕒</span> Jonli dars va tanaffus hisoblagichi faol</li>
          </ul>
        </div>

        <button className="modal-close-btn" onClick={onClose}>
          Tushunarli
        </button>
      </div>
    </div>
  );
}