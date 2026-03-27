import { useEffect, useRef, useState } from "react";
import { usePortfolio } from "@/context/PortfolioContext";

/* ── SVG Icons ── */
const GitHubIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-github w-4 h-4"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
);

const LinkedInIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-linkedin w-4 h-4"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
);

const TwitterIcon = () => (
    <svg className="ed-contact__social-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

const ContactSection = () => {
    const { me } = usePortfolio();
    const sectionRef = useRef<HTMLDivElement>(null);
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [submitted, setSubmitted] = useState(false);

    const email = me?.email || "hello@example.com";
    const name = me?.full_name || "Dhairya";

    const socialLinks = [
        { label: "GitHub", href: me?.github, Icon: GitHubIcon },
        { label: "LinkedIn", href: me?.linkedin, Icon: LinkedInIcon },
    ].filter((s) => s.href);

    const linksToDisplay = socialLinks.length > 0
        ? socialLinks
        : [
            { label: "GitHub", href: "#", Icon: GitHubIcon },
            { label: "LinkedIn", href: "#", Icon: LinkedInIcon },
        ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("http://127.0.0.1:8000/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                setSubmitted(true);
                setFormData({ name: "", email: "", message: "" });
                setTimeout(() => setSubmitted(false), 4000);
            } else {
                alert("Something went wrong. Please try again.");
            }
        } catch {
            alert("Could not send message. Please try again later.");
        }
    };

    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const reveals = el.querySelectorAll('.ed-reveal');
                        reveals.forEach((r, i) => {
                            setTimeout(() => r.classList.add('is-visible'), i * 150);
                        });
                    }
                });
            },
            { threshold: 0.15 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <>
            <section id="contact" className="ed-contact" ref={sectionRef}>
                <div className="ed-contact__inner">
                    <h2 className="ed-contact__heading ed-reveal">
                        Let's work <em>together.</em>
                    </h2>
                    <p className="ed-contact__sub ed-reveal">
                        I'm always open to discussing new projects, creative ideas,
                        or opportunities to be part of your vision.
                    </p>

                    <a href={`mailto:${email}`} className="ed-contact__email ed-reveal">
                        {email}
                    </a>

                    {/* Contact Form */}
                    <form className="ed-contact__form ed-reveal" onSubmit={handleSubmit}>
                        <div className="ed-contact__form-row">
                            <div>
                                <label className="ed-contact__form-label" htmlFor="contact-name">Name</label>
                                <input
                                    id="contact-name"
                                    type="text"
                                    className="ed-contact__input"
                                    placeholder="Your name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="ed-contact__form-label" htmlFor="contact-email">Email</label>
                                <input
                                    id="contact-email"
                                    type="email"
                                    className="ed-contact__input"
                                    placeholder="you@email.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="ed-contact__form-label" htmlFor="contact-message">Message</label>
                            <textarea
                                id="contact-message"
                                className="ed-contact__textarea"
                                placeholder="Tell me about your project..."
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                required
                            />
                        </div>
                        <button type="submit" className="ed-contact__submit">
                            {submitted ? "Message Sent ✓" : "Send Message"}
                        </button>
                    </form>

                    {/* Social Links with Icons */}
                    <div className="ed-contact__socials ed-reveal">
                        {linksToDisplay.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ed-contact__social"
                            >
                                <link.Icon />
                                {link.label}
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="ed-footer">
                <p className="ed-footer__text">
                    © {new Date().getFullYear()} {name}. Designed & built by me.
                </p>
            </footer>
        </>
    );
};

export default ContactSection;
