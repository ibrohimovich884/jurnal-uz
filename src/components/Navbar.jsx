import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router";
import "./Navbar.css";

const CLASSES = [
	"6a", "6b",
	"7a", "7b",
	"8a", "8b",
	"9a", "9b", "9d"
];

export default function Navbar() {
	const [menuOpen, setMenuOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const [darkMode, setDarkMode] = useState(false);
	const location = useLocation();

	/* ----------- LOCALSTORAGE: DARK MODE HOLATINI YOQLASH ----------- */
	useEffect(() => {
		const saved = localStorage.getItem("darkMode") === "true";
		setDarkMode(saved);

		if (saved) {
			document.body.classList.add("dark");
		}
	}, []);

	const toggleDarkMode = () => {
		const newMode = !darkMode;
		setDarkMode(newMode);

		document.body.classList.toggle("dark", newMode);
		localStorage.setItem("darkMode", newMode);
	};

	/* ----------- SCROLL EFFECT ----------- */
	useEffect(() => {
		const handleScroll = () => setScrolled(window.scrollY > 20);
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	/* ----------- MENU OCHILGANDA SCROLL OCHIRISH ----------- */
	useEffect(() => {
		document.body.style.overflow = menuOpen ? "hidden" : "unset";
		return () => (document.body.style.overflow = "unset");
	}, [menuOpen]);

	/* ----------- ESC YOPISH ----------- */
	useEffect(() => {
		const handleEscape = (e) => {
			if (e.key === "Escape" && menuOpen) setMenuOpen(false);
		};
		document.addEventListener("keydown", handleEscape);
		return () => document.removeEventListener("keydown", handleEscape);
	}, [menuOpen]);

	/* ----------- ROUTE O‘ZGARSA MENUNI YOPISH ----------- */
	useEffect(() => setMenuOpen(false), [location]);

	const currentClass = location.pathname.match(/\/class\/(\w+)/)?.[1]?.toUpperCase();

	return (
		<>
			<header className={`navbar ${scrolled ? "scrolled" : ""} ${darkMode ? "dark-nav" : ""}`}>
				<div className="nav-container">

					<NavLink to="/" className="logo">Jurnal uz</NavLink>

					{currentClass && <div className="current-class-mobile">{currentClass}-sinf</div>}

					<button
						className={`menu-toggle ${menuOpen ? "active" : ""}`}
						onClick={() => setMenuOpen(!menuOpen)}
					>
						<span></span><span></span><span></span>
					</button>

					<nav className={`nav-links ${menuOpen ? "open" : ""}`}>
						{CLASSES.map((cls) => (
							<NavLink
								key={cls}
								to={`/class/${cls}`}
								className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
							>
								{cls.toUpperCase()}
							</NavLink>
						))}
					</nav>
				</div>
			</header>

			<div className={`blur-overlay ${menuOpen ? "active" : ""}`} onClick={() => setMenuOpen(false)} />

			{/* DARK MODE BUTTON */}
			<button
				onClick={toggleDarkMode}
				className="dark-toggle-btn"
				aria-label="Dark mode"
			>
				{darkMode ? "☀️" : "🌙"}
			</button>
		</>
	);
}
