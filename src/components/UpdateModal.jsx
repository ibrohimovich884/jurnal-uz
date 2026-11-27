import { Sparkles, Star, Share2, Check, Zap, Clock, X } from "lucide-react";
import "./UpdateModal.css";

export default function UpdateModal({ isOpen, onClose, betaVersion }) {
  if (!isOpen) return null;

  return (
    <div className="ios-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="ios-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Top Specular Shine */}
        <div className="modal-top-shine"></div>

        <button
          type="button"
          className="modal-x-btn"
          onClick={onClose}
          aria-label="Yopish"
        >
          <X size={18} />
        </button>

        <div className="ios-modal-header">
          <div className="modal-icon-bubble">
            <Sparkles size={24} />
          </div>
          <h3 className="modal-headline">So‘nggi Yangilanishlar</h3>
          <div className="modal-version-tag">
            <span>v2026.2.3</span>
            <span className="dot-sep">·</span>
            <span>{betaVersion}</span>
          </div>
        </div>

        <div className="ios-modal-body">
          <ul className="modal-features-list">
            <li>
              <div className="feature-icon check">
                <Check size={14} strokeWidth={3} />
              </div>
              <div className="feature-desc">
                <b>8-A, 9-A, 10-A va 10-B Jadvali:</b> Ushbu sinflarning dars jadvallari to'liq yangilandi; yangilanmagan sinflar bosh sahifada kulrang holatda ajratildi.
              </div>
            </li>

            <li>
              <div className="feature-icon star">
                <Star size={14} fill="currentColor" />
              </div>
              <div className="feature-desc">
                <b>Mening Sinfim:</b> Sinflarni erkin surib, o'z sinfingizni birinchi o'ringa qo'yish imkoni.
              </div>
            </li>

            <li>
              <div className="feature-icon share">
                <Share2 size={14} />
              </div>
              <div className="feature-desc">
                <b>Telegramga Ulashish:</b> Kunlik dars jadvalini bitta tugma bilan chiroyli nusxalash.
              </div>
            </li>

            <li>
              <div className="feature-icon check">
                <Check size={14} strokeWidth={3} />
              </div>
              <div className="feature-desc">
                <b>O'tgan darslar:</b> Bugungi o'tib bo'lgan darslar avtomatik belgilanadi.
              </div>
            </li>

            <li>
              <div className="feature-icon zap">
                <Zap size={14} fill="currentColor" />
              </div>
              <div className="feature-desc">
                <b>100% Oflayn:</b> To'liq internetga bog'lanmagan ultra tezkor ish tartibi.
              </div>
            </li>

            <li>
              <div className="feature-icon clock">
                <Clock size={14} />
              </div>
              <div className="feature-desc">
                <b>Jonli hisoblagich:</b> Hozirgi dars va tanaffus qolgan vaqtini soniyagacha hisoblash.
              </div>
            </li>
          </ul>
        </div>

        <button
          type="button"
          className="modal-primary-action-btn"
          onClick={onClose}
        >
          Tushunarli
        </button>
      </div>
    </div>
  );
}