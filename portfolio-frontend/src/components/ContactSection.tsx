import AnimatedSection from "./AnimatedSection";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";

interface ContactProps {
    email?: string;
    contact?: string;
    address?: string;
    apiUrl?: string;
}

const ContactSection = ({ email, contact, address, apiUrl = "http://127.0.0.1:8000" }: ContactProps) => {
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);

        try {
            const response = await fetch(`${apiUrl}/api/contact`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Failed to send message");

            console.log("Contact form submitted successfully");
            setSent(true);
            setFormData({ name: "", email: "", message: "" });

            // Reset success message after 4 seconds
            setTimeout(() => setSent(false), 4000);
        } catch (error) {
            console.error("Error sending message:", error);
            alert("Failed to send message. Please try again.");
        } finally {
            setSending(false);
        }
    };

    const contactInfo = [
        { icon: Mail, label: email || "hello@example.com" },
        { icon: Phone, label: contact || "+1 (555) 123-4567" },
        { icon: MapPin, label: address || "Location" },
    ];

    return (
        <section id="contact" className="section-padding">
            <div className="max-w-7xl mx-auto">
                <AnimatedSection>
                    <p className="text-primary font-heading text-sm font-medium tracking-widest uppercase mb-4">Get in Touch</p>
                    <h2 className="font-heading text-4xl md:text-5xl font-bold mb-16 tracking-tight">
                        Let's <span className="text-gradient">connect</span>
                    </h2>
                </AnimatedSection>

                <div className="grid md:grid-cols-2 gap-16">
                    <AnimatedSection delay={0.2}>
                        <div className="space-y-8">
                            <p className="text-muted-foreground leading-relaxed">
                                I'm always open to discussing new projects, creative ideas,
                                or opportunities to be part of your vision.
                            </p>
                            <div className="space-y-6">
                                {contactInfo.map((item) => (
                                    <div key={item.label} className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <item.icon className="w-4 h-4 text-primary" />
                                        </div>
                                        <span className="text-foreground text-sm">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </AnimatedSection>

                    <AnimatedSection delay={0.4}>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <input
                                type="text"
                                placeholder="Your Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                className="w-full px-5 py-3.5 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-primary/50 transition"
                            />
                            <input
                                type="email"
                                placeholder="Your Email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                className="w-full px-5 py-3.5 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-primary/50 transition"
                            />
                            <textarea
                                placeholder="Your Message"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                required
                                rows={5}
                                className="w-full px-5 py-3.5 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-primary/50 transition resize-none"
                            />
                            <button
                                type="submit"
                                disabled={sending}
                                className="flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground font-heading font-semibold text-sm rounded-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {sending ? "Sending..." : sent ? "Sent ✓" : "Send Message"}{" "}
                                {!sending && !sent && <Send className="w-4 h-4" />}
                            </button>
                        </form>
                    </AnimatedSection>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
