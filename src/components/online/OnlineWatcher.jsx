import { useEffect, useState } from "react";
import { WifiOff, Wifi } from "lucide-react";
import "./Online.css";

export default function OnlineWatcher() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
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
      <div className="ios-network-island offline">
        <WifiOff size={14} />
        <span>Internet yo‘q · Oflayn rejimda ishlamoqda</span>
      </div>
    );
  }

  if (showReconnected) {
    return (
      <div className="ios-network-island online">
        <Wifi size={14} />
        <span>Internet aloqasi tiklandi</span>
      </div>
    );
  }

  return null;
}
