import { useState, useEffect } from "react";
import { usePortfolio } from "@/context/PortfolioContext";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Work", href: "#projects" },
  { label: "Education", href: "#education" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const { me } = usePortfolio();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = navItems.map((n) => n.href.slice(1));
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActive(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = (href: string) => {
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className={`ed-nav ${scrolled ? "scrolled" : ""}`}>
      <div className="ed-nav__inner">
        <button className="ed-nav__logo" onClick={() => handleClick("#home")}>
          {me?.full_name || "Portfolio"}
        </button>

        {/* Desktop Links */}
        <ul className="ed-nav__links">
          {navItems.map((item) => (
            <li key={item.href}>
              <button
                className={`ed-nav__link ${active === item.href.slice(1) ? "active" : ""}`}
                onClick={() => handleClick(item.href)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Hamburger */}
        <button
          className={`ed-nav__hamburger ${mobileOpen ? "open" : ""}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`ed-nav__mobile ${mobileOpen ? "open" : ""}`}>
        {navItems.map((item) => (
          <button
            key={item.href}
            className={`ed-nav__mobile-link ${active === item.href.slice(1) ? "active" : ""}`}
            onClick={() => handleClick(item.href)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
