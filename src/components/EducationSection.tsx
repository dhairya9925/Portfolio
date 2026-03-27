import { useEffect, useRef } from "react";
import { usePortfolio } from "@/context/PortfolioContext";

const defaultEducation = [
  {
    degree: "Master of Computer Science",
    institution: "Stanford University",
    year: "2020 — 2022",
    description: "Specialized in Machine Learning and Distributed Systems.",
    current: false,
  },
  {
    degree: "Bachelor of Computer Science",
    institution: "MIT",
    year: "2016 — 2020",
    description: "Graduated with honors. Focus on algorithms and software engineering.",
    current: false,
  },
  {
    degree: "Full-Stack Web Development",
    institution: "Online Certification",
    year: "2019",
    description: "Comprehensive training in modern web technologies and best practices.",
    current: false,
  },
];

const EducationSection = () => {
  const { education: contextEducation } = usePortfolio();
  const sectionRef = useRef<HTMLDivElement>(null);

  const education = contextEducation.length > 0
    ? contextEducation.map((e, i) => ({
      degree: e.degree,
      institution: e.institution,
      year: `${e.start_year || ""} — ${e.end_year || "Present"}`,
      description: e.description || "",
      current: i === 0, // First item is "current"
    }))
    : defaultEducation;

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
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="education" className="ed-timeline" ref={sectionRef}>
      <div className="ed-timeline__inner">
        {/* Sticky Sidebar */}
        <aside className="ed-timeline__sidebar ed-reveal">
          <p className="ed-timeline__eyebrow">Education</p>
          <h2 className="ed-timeline__heading">
            My <em>journey</em>
          </h2>
        </aside>

        {/* Timeline */}
        <div className="ed-timeline__list">
          {education.map((item, i) => (
            <div
              key={i}
              className={`ed-timeline__item ed-reveal ${item.current ? "ed-timeline__item--current" : ""}`}
            >
              <p className="ed-timeline__date">{item.year}</p>
              <h3 className="ed-timeline__title">{item.institution}</h3>
              <p className="ed-timeline__role">{item.degree}</p>
              {item.description && (
                <div
                  className="ed-timeline__desc"
                  dangerouslySetInnerHTML={{ __html: item.description }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EducationSection;
