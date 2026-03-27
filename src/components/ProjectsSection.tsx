import { useEffect, useRef } from "react";
import { usePortfolio } from "@/context/PortfolioContext";

const defaultProjects = [
  {
    title: "E-Commerce Platform",
    description: "A full-featured online store with cart, checkout, and payment integration.",
    tags: ["React", "Node.js", "Stripe", "PostgreSQL"],
    link: "#",
    github_link: "#",
  },
  {
    title: "Task Management App",
    description: "Collaborative task manager with real-time updates and team features.",
    tags: ["TypeScript", "React", "WebSocket", "MongoDB"],
    link: "#",
    github_link: "#",
  },
  {
    title: "AI Dashboard",
    description: "Analytics dashboard with AI-powered insights and data visualization.",
    tags: ["Python", "React", "TensorFlow", "D3.js"],
    link: "#",
    github_link: "#",
  },
  {
    title: "Social Media App",
    description: "A modern social platform with real-time messaging and content sharing.",
    tags: ["React Native", "Firebase", "Redux", "Node.js"],
    link: "#",
    github_link: "#",
  },
];

const ProjectsSection = () => {
  const { projects: contextProjects } = usePortfolio();
  const sectionRef = useRef<HTMLDivElement>(null);

  const projects = contextProjects.length > 0
    ? contextProjects.map((p) => ({
      title: p.title,
      description: p.description,
      tags: p.tech_stack?.map(t => t.technology) || p.technologies || [],
      link: p.live_link || p.link || "#",
      github_link: p.github_link || "#",
    }))
    : defaultProjects;

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const reveals = el.querySelectorAll('.ed-reveal');
            reveals.forEach((r, i) => {
              setTimeout(() => r.classList.add('is-visible'), i * 100);
            });
          }
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="projects" className="ed-work" ref={sectionRef}>
      <div className="ed-work__inner">
        <p className="ed-work__eyebrow ed-reveal">Selected Work</p>
        <h2 className="ed-work__heading ed-reveal">
          Featured <em>projects</em>
        </h2>

        <div className="ed-work__list">
          {projects.map((project, i) => (
            <div key={project.title} className="ed-work__item ed-reveal" data-delay={String(i * 0.08)}>
              <span className="ed-work__index">
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="ed-work__info">
                <h3 className="ed-work__title">{project.title}</h3>
                <p className="ed-work__desc">{project.description}</p>
                <div className="ed-work__tags">
                  {project.tags.map((tag) => (
                    <span key={tag} className="ed-work__tag">{tag}</span>
                  ))}
                </div>
              </div>

              {project.link && project.link !== "#" ? (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ed-work__arrow"
                  aria-label={`View ${project.title}`}
                >
                  →
                </a>
              ) : project.github_link && project.github_link !== "#" ? (
                <a
                  href={project.github_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ed-work__arrow"
                  aria-label={`View ${project.title} on GitHub`}
                >
                  →
                </a>
              ) : (
                <span className="ed-work__arrow">→</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
