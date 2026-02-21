import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

const navItems = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#projects" },
    { label: "Education", href: "#education" },
    { label: "Contact", href: "#contact" },
];

const Navigation = () => {
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
        gsap.to(window, {
            duration: 1,
            scrollTo: { y: href, offsetY: 80 },
            ease: "power3.inOut"
        });
    };

    return (
        <motion.div
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
        >
            <div className="relative w-full max-w-4xl pointer-events-auto">
                <nav
                    className={`flex items-center justify-between px-6 h-16 rounded-full transition-all duration-300 ${scrolled ? "bg-background/80 backdrop-blur-xl border border-border shadow-[0_8px_32px_rgba(0,0,0,0.12)]" : "bg-transparent"
                        }`}
                >
                    <button onClick={() => handleClick("#home")} className="font-heading text-xl font-bold tracking-tight">
                        <span className="text-gradient">Portfolio</span>
                    </button>

                    {/* Desktop */}
                    <ul className="hidden md:flex items-center gap-2">
                        {navItems.map((item) => (
                            <li key={item.href}>
                                <button
                                    onClick={() => handleClick(item.href)}
                                    className={`relative px-4 py-2 text-sm font-medium transition-colors ${active === item.href.slice(1) ? "text-primary" : "text-muted-foreground hover:text-foreground"
                                        }`}
                                >
                                    {item.label}
                                    {active === item.href.slice(1) && (
                                        <motion.span
                                            layoutId="nav-active"
                                            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-[3px] bg-primary rounded-t-lg drop-shadow-[0_-2px_10px_var(--primary)]"
                                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
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
                </nav>

                {/* Mobile menu dropdown */}
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-[calc(100%+0.5rem)] left-0 w-full md:hidden bg-background/95 backdrop-blur-xl border border-border shadow-2xl rounded-2xl overflow-hidden"
                    >
                        <ul className="flex flex-col py-2 px-4">
                            {navItems.map((item) => (
                                <li key={item.href}>
                                    <button
                                        onClick={() => handleClick(item.href)}
                                        className={`block w-full text-left py-3 px-4 rounded-xl text-base font-medium transition-all ${active === item.href.slice(1) ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                            }`}
                                    >
                                        {item.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export default Navigation;