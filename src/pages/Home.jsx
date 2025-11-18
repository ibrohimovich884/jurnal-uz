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
            <Link to="/class/6a" className="btn primary">6A jadvalini ko‘rish</Link>
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


// import { Link } from "react-router";
// import { useEffect } from "react";
// import "./Home.css";

// // Barcha sinflar ro'yxati - bir joyda
// const CLASSES = ["5a", "5b", "6a", "6b", "7a", "7b", "8a", "8b", "9a", "9b", "9d"];

// // Statistika ma'lumotlari
// const STATS = [
//   { value: "11", label: "Sinflar" },
//   { value: "500+", label: "O'quvchilar" },
//   { value: "24/7", label: "Mavjud" }
// ];

// export default function Home() {
//   // SEO uchun title o'rnatish
//   useEffect(() => {
//     document.title = "Maktab dars jadvali — tez va oson";
    
//     // Meta description
//     let metaDescription = document.querySelector('meta[name="description"]');
//     if (!metaDescription) {
//       metaDescription = document.createElement('meta');
//       metaDescription.name = "description";
//       document.head.appendChild(metaDescription);
//     }
//     metaDescription.content = "Maktab dars jadvalini ko'ring. Barcha sinflar uchun dars vaqtlari, xona raqamlari va o'qituvchi ma'lumotlari.";
//   }, []);

//   return (
//     <main className="home">
//       {/* Skip to content link - accessibility uchun */}
//       <a href="#main-content" className="skip-link">
//         Asosiy kontentga o'tish
//       </a>

//       <header className="hero">
//         <div className="hero-inner">
//           {/* Hero visual element */}
//           <div className="hero-icon" aria-hidden="true">
//             📚
//           </div>

//           <h1 className="hero-title">Maktab dars jadvali — tez va oson</h1>
//           <p className="hero-sub">
//             Sinfni tanlang, dars tartibini ko'ring va kim dars o'tayotganini oson bilib oling.
//             Jadval mobilga mos va oddiy boshqaruvga ega.
//           </p>

//           <div className="hero-cta">
//             <Link to="/class/5a" className="btn primary">
//               5A jadvalini ko'rish
//             </Link>
//             <Link to="/class/9b" className="btn outline">
//               9B jadvalini ko'rish
//             </Link>
//           </div>

//           <ul className="benefits">
//             <li>⏰ Avtomatik dars soatlari</li>
//             <li>📍 Xona raqamlari va o'qituvchi ma'lumotlari</li>
//             <li>🔎 Tez qidiruv — sinfni bosing va batafsil ko'ring</li>
//           </ul>

//           {/* Statistika */}
//           <div className="stats">
//             {STATS.map((stat, index) => (
//               <div key={index} className="stat-item">
//                 <div className="stat-value">{stat.value}</div>
//                 <div className="stat-label">{stat.label}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </header>

//       <section id="main-content" className="classes-section" aria-labelledby="classes-heading">
//         <div className="section-inner">
//           <h2 id="classes-heading" className="section-title">Barcha sinflar</h2>
//           <p className="section-desc">O'z sinfingizni tanlang va jadvalga o'ting</p>

//           <div className="classes-grid">
//             {CLASSES.map((cls) => (
//               <Link 
//                 key={cls} 
//                 to={`/class/${cls}`} 
//                 className="class-card"
//                 aria-label={`${cls.toUpperCase()}-sinf dars jadvaliga o'tish`}
//               >
//                 <div className="class-name">{cls.toUpperCase()}-sinf</div>
//                 <div className="class-meta">Jadvalga o'tish &rarr;</div>
//               </Link>
//             ))}
//           </div>

//           <div className="help-section">
//             <p className="note">
//               Agar sizda foydalanishda qandaydir xatolik bo'lsa — <a href="https://t.me/ibrohimovich_o1" target="_blank" rel="noopener noreferrer">yaratuvchiga murojaat qiling</a>
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="footer">
//         <div className="footer-inner">
//           <div className="footer-content">
//             <div className="footer-brand">
//               <h3>Jurnal.uz</h3>
//               <p>Maktab dars jadvali tizimi</p>
//             </div>
            
//             <div className="footer-links">
//               <h4>Bog'lanish</h4>
//               <a href="https://t.me/ibrohimovich_o1" target="_blank" rel="noopener noreferrer">
//                 Telegram
//               </a>
//             </div>
//           </div>
          
//           <div className="footer-bottom">
//             <p>&copy; {new Date().getFullYear()} Jurnal.uz. Barcha huquqlar himoyalangan.</p>
//           </div>
//         </div>
//       </footer>
//     </main>
//   );
// }