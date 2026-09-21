import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { api } from "./lib/api";

const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);
export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [health, setHealth] = useState(null);
  const [notification, setNotification] = useState("");
  const timer = useRef();
  const notify = useCallback((message) => {
    setNotification(message);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setNotification(""), 4500);
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    api("/auth", { signal: controller.signal })
      .then((result) => setUser(result.data))
      .catch(() => {})
      .finally(() => {
        if (!controller.signal.aborted) setAuthLoading(false);
      });
    const check = () =>
      api("/health", { signal: controller.signal })
        .then(setHealth)
        .catch((error) => {
          if (error.name !== "AbortError") setHealth({ status: "offline" });
        });
    check();
    const interval = setInterval(check, 60000);
    return () => {
      controller.abort();
      clearInterval(interval);
      clearTimeout(timer.current);
    };
  }, []);
  const signOut = async () => {
    await api("/signOut", { method: "POST" });
    setUser(null);
    notify("You have signed out.");
  };
  return (
    <AppContext.Provider
      value={{ user, setUser, authLoading, health, notify, signOut }}
    >
      {children}
      {notification && (
        <div className="notification" role="status">
          {notification}
        </div>
      )}
    </AppContext.Provider>
  );
}
