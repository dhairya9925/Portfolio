import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Education", href: "#education" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
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
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/80 backdrop-blur-xl border-b border-border" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-12 h-16 md:h-20">
        <button onClick={() => handleClick("#home")} className="font-heading text-xl font-bold tracking-tight">
          <span className="text-gradient">Portfolio</span>
        </button>

        {/* Desktop */}
        <ul className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <button
                onClick={() => handleClick(item.href)}
                className={`relative px-4 py-2 text-sm font-medium transition-colors ${
                  active === item.href.slice(1) ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
                {active === item.href.slice(1) && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-primary rounded-full"
                  />
                )}
              </button>
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Menu"
        >
          <span className={`w-6 h-0.5 bg-foreground transition-transform ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`w-6 h-0.5 bg-foreground transition-opacity ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`w-6 h-0.5 bg-foreground transition-transform ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border"
        >
          <ul className="flex flex-col py-4 px-6">
            {navItems.map((item) => (
              <li key={item.href}>
                <button
                  onClick={() => handleClick(item.href)}
                  className={`block w-full text-left py-3 text-base font-medium transition-colors ${
                    active === item.href.slice(1) ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
