import { Link } from "react-router";
import "./Home.css";

const CLASSES = ["6a", "6b", "7a", "7b", "8a", "8b", "9a", "9b", "9d"];

export default function Home() {
  return (
    <main className="home">
      <header className="hero">
        <div className="hero-inner">
          <h1 className="hero-title">Maktab dars jadvali — tez va oson</h1>
          <p className="hero-sub">
            Sinfni tanlang, dars tartibini ko‘ring va kim dars o‘tayotganini oson biling.
            Jadval mobilga mos va oddiy boshqaruvga ega.
          </p>

          <div className="hero-cta">
            <Link to="/class/5a" className="btn primary">5A jadvalini ko‘rish</Link>
            <Link to="/class/9b" className="btn outline">9B jadvalini ko‘rish</Link>
          </div>

          <ul className="benefits">
            <li>⏰ Avtomatik dars soatlari</li>
            <li>📍 Xona raqamlari va o‘qituvchi ma'lumotlari</li>
            <li>🔎 Tez qidiruv — sinfni bosing va batafsilni ko‘ring</li>
          </ul>
        </div>
      </header>

      <section className="classes-section" aria-labelledby="classes-heading">
        <div className="section-inner">
          <h2 id="classes-heading" className="section-title">Sinfni tanlang</h2>

          <div className="classes-grid">
            {CLASSES.map((cls) => (
              <Link key={cls} to={`/class/${cls}`} className="class-card">
                <div className="class-name">{cls.toUpperCase()}</div>
                <div className="class-meta">Jadvalni ko‘rish &rarr;</div>
              </Link>
            ))}
          </div>

          <p className="note">
            Agar sizda foidalanishda qandyadir xatolik bo‘lsa — <a href="https://T.me/ibrohimovich_o1">Yaratuvchiga</a>, murojat qilishingiz mumkin
          </p>
        </div>
      </section>
    </main>
  );
}
