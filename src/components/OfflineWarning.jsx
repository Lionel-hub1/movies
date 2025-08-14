import { useState, useEffect } from "react";

const OfflineWarning = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  if (!isOffline) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-yellow-500 text-black text-center p-2 animate-fadeIn">
      <p className="font-semibold">
        You are currently offline. Some features may not be available.
      </p>
    </div>
  );
};

export default OfflineWarning;
