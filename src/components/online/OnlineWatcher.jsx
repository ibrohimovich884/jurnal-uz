import { useEffect, useState } from "react";
import "./Online.css";

export default function OnlineWatcher() {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {

        const handleOnline = () => {
            console.log("📡 Internet ulandi → sahifa yangilanmoqda");
            setIsOnline(true);

            // Kafolatli yangilash
            window.location.reload();
        };

        const handleOffline = () => {
            console.log("🔴 Offline rejim");
            setIsOnline(false);
        };

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    // Faqat offline bo‘lsa ko‘rinadi
    if (isOnline) return null;

    return (
        <div className="offline-banner">
            📡 Internet yo‘q — offline rejimda ishlayapti
        </div>
    );
}
