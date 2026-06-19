import { useScrollHeader } from "../hooks/index.js";
import { IconGH } from "./Icons.jsx";

export default function Header({ theme, toggleTheme, page, go }) {
  const stuck = useScrollHeader();

  function nav(targetPage, scrollId) {
    if (page === targetPage) {
      const el = document.getElementById(scrollId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      go(targetPage, scrollId);
    }
  }

  return (
    <header className={"p-hdr" + (stuck ? " stuck" : "")}>
      <div className="p-hdr-left">
        <div className="p-hdr-profile">
          <img src="/mohammed raees img.png" alt="Mohammed Raees" className="p-hdr-avatar" />
          <button className="p-hdr-status" onClick={() => nav("home", "contact")}>
            <span className="p-status-dot"></span>
            Available for work
            <span className="p-status-arrow">▼</span>
          </button>
        </div>
      </div>

      <nav className="p-nav">
        <button className={page === "home"   ? "active" : ""} onClick={() => nav("home", "about")}>Home</button>
        <button className={page === "about"  ? "active" : ""} onClick={() => go("about")}>About</button>
        <button onClick={() => nav("home", "projects")}>Projects</button>
      </nav>

      <div className="p-hright">
        <button className="p-tbtn" onClick={toggleTheme}>
          {theme === "dark" ? "☾" : "☀"}
        </button>
      </div>
    </header>
  );
}
