import { Link } from "react-router";
import { AlertCircle, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="ios-not-found">
      <div className="ios-not-found-card">
        <AlertCircle size={44} className="error-icon" />
        <h2>404 — Sahifa topilmadi</h2>
        <p>Siz qidirayotgan manzil mavjud emas yoki boshqa joyga ko'chirilgan.</p>
        <Link to="/" className="ios-return-btn" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
          <Home size={16} />
          <span>Bosh sahifaga qaytish</span>
        </Link>
      </div>
    </div>
  );
}
