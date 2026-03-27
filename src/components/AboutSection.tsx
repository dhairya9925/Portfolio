import { useEffect, useRef } from "react";
import { usePortfolio } from "@/context/PortfolioContext";

const AboutSection = () => {
  const { me } = usePortfolio();
  const sectionRef = useRef<HTMLDivElement>(null);

  const stats = [
    {
      value: me?.stats?.years_of_experience ? `${me.stats.years_of_experience}+` : "3+",
      label: "Years Experience",
    },
    {
      value: me?.stats?.projects_completed ? `${me.stats.projects_completed}+` : "20+",
      label: "Projects Built",
    },
    {
      value: me?.stats?.clients ? `${me.stats.clients}+` : "5+",
      label: "Happy Clients",
    },
  ];

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const reveals = el.querySelectorAll('.ed-reveal');
            reveals.forEach((r, i) => {
              setTimeout(() => r.classList.add('is-visible'), i * 120);
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="ed-about" ref={sectionRef}>
      <div className="ed-about__inner">
        {/* Sticky Sidebar */}
        <aside className="ed-about__sidebar ed-reveal">
          <img
            src={me?.profile_image || "/Editorial Styled image nobg.png"}
            alt={me?.full_name || "Profile"}
            className="ed-about__avatar-small"
          />
          <h3 className="ed-about__name">{me?.full_name || "Dhairya"}</h3>
          <p className="ed-about__role">Software Developer</p>
        </aside>

        {/* Content */}
        <div className="ed-about__content">
          <p className="ed-about__eyebrow ed-reveal">About Me</p>

          <div className="ed-about__body ed-reveal">
            {me?.bio ? (
              <div dangerouslySetInnerHTML={{ __html: me.bio }} />
            ) : (
              <>
                <p>
                  I'm a developer who loves creating beautiful, functional web applications.
                  With a strong foundation in both front-end and back-end technologies,
                  I bring ideas to life through clean code and thoughtful design.
                </p>
                <p>
                  My approach combines technical precision with creative problem-solving,
                  always striving to build products that make a real difference in people's lives.
                </p>
              </>
            )}
          </div>

          <blockquote className="ed-about__pullquote ed-reveal">
            "Good code is its own best documentation."
          </blockquote>

          <div className="ed-about__stats ed-reveal">
            {stats.map((stat) => (
              <div key={stat.label} className="ed-about__stat">
                <p className="ed-about__stat-value">{stat.value}</p>
                <p className="ed-about__stat-label">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
