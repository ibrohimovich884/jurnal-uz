import { useEffect, useState } from "react";
import "./Online.css";

export default function OnlineWatcher() {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [showReconnected, setShowReconnected] = useState(false);

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            // Sahifani majburan qayta yuklamaymiz — ma'lumotlar offline holatda
            // ham to'liq ishlaydi, shuning uchun reload foydalanuvchi holatini
            // (ochiq modal, scroll pozitsiyasi va h.k.) bekorga yo'qotadi.
            setShowReconnected(true);
            const timer = setTimeout(() => setShowReconnected(false), 3000);
            return () => clearTimeout(timer);
        };

        const handleOffline = () => {
            setIsOnline(false);
            setShowReconnected(false);
        };

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    if (!isOnline) {
        return (
            <div className="offline-banner">
                📡 Internet yo‘q — offline rejimda ishlayapti
            </div>
        );
    }

    if (showReconnected) {
        return (
            <div className="offline-banner online-banner">
                ✅ Internet tiklandi
            </div>
        );
    }

    return null;
}
