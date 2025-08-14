import { useState, useEffect } from "react";

const PwaInstallPrompt = () => {
  const [installPromptEvent, setInstallPromptEvent] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      // Prevent the mini-infobar from appearing on mobile
      event.preventDefault();
      // Stash the event so it can be triggered later.
      setInstallPromptEvent(event);
      // Show the install button
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPromptEvent) {
      return;
    }
    // Show the install prompt
    installPromptEvent.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await installPromptEvent.userChoice;
    // We've used the prompt, and can't use it again, so hide the button
    setIsVisible(false);
    setInstallPromptEvent(null);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slideUp">
      <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg shadow-lg">
        <p className="text-white">Install the app for a better experience!</p>
        <button
          onClick={handleInstallClick}
          className="px-4 py-2 text-sm font-bold text-white transition-colors rounded-lg bg-primary hover:bg-opacity-80"
        >
          Install
        </button>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-white"
          aria-label="Close"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default PwaInstallPrompt;
