import { Routes, Route } from "react-router";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ClassPage from "./pages/ClassPage.jsx";
import CalculatorPage from "./pages/CalculatorPage.jsx";
import NotFound from "./pages/NotFound.jsx";
import OnlineWatcher from "./components/online/OnlineWatcher.jsx";

export default function App() {
	return (
		<div>
			<Navbar />
			<OnlineWatcher />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/class/:className" element={<ClassPage />} />
				<Route path="/hisoblovchi" element={<CalculatorPage />} />
				<Route path="/uchrashuvlar" element={<CalculatorPage />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</div>
	);
}

