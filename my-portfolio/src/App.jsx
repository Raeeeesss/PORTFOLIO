import { useState, useEffect, useCallback, useRef } from "react";
import HomePage   from "./pages/HomePage.jsx";
import AboutPage  from "./pages/AboutPage.jsx";
import WebDevPage from "./pages/WebDevPage.jsx";
import AppDevPage from "./pages/AppDevPage.jsx";

export default function App() {
  const [page,  setPage]     = useState("home");

  const go = useCallback((targetPage, scrollId) => {
    setPage(targetPage);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [page]);

  return (
    <div style={{ minHeight: "100vh", background: "#000000", color: "#ffffff" }}>
      {/* Page router */}
      <main>
        {page === "home"   && <HomePage   go={go} />}
        {page === "about"  && <AboutPage  go={go} />}
        {page === "webdev" && <WebDevPage go={go} />}
        {page === "appdev" && <AppDevPage go={go} />}
      </main>
    </div>
  );
}
