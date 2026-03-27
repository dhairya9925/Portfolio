import { useEffect, useRef, useCallback } from "react";
import { usePortfolio } from "@/context/PortfolioContext";

/* ─────────────────────────────────────────────
   Default / fallback data
   ───────────────────────────────────────────── */
interface SkillItem {
  id?: number;
  name: string;
  featured?: boolean;
}
interface SkillCategory {
  category: string;
  skills: SkillItem[];
}

const defaultSkillsData: SkillCategory[] = [
  {
    category: "Languages",
    skills: [
      { name: "JavaScript", featured: true },
      { name: "TypeScript", featured: true },
      { name: "Python" },
      { name: "Go" },
      { name: "Java" },
      { name: "HTML/CSS" },
    ],
  },
  {
    category: "Frameworks & Libraries",
    skills: [
      { name: "React", featured: true },
      { name: "Next.js", featured: true },
      { name: "Node.js" },
      { name: "Vue.js" },
      { name: "Tailwind CSS" },
      { name: "Framer Motion" },
    ],
  },
  {
    category: "Dev Tools",
    skills: [
      { name: "Git" },
      { name: "Docker" },
      { name: "Figma" },
      { name: "VS Code" },
      { name: "Postman" },
      { name: "Linux" },
    ],
  },
  {
    category: "Database & Cloud",
    skills: [
      { name: "PostgreSQL" },
      { name: "MongoDB" },
      { name: "Redis" },
      { name: "Supabase" },
    ],
  },
];

/* ─────────────────────────────────────────────
   Component
   ───────────────────────────────────────────── */
const SkillsSection = () => {
  const { technologies } = usePortfolio();
  const listRef = useRef<HTMLDivElement>(null);

  // Build skill categories from API data or use defaults
  let groupedSkills: SkillCategory[];

  if (technologies.length > 0) {
    const groups = technologies.reduce((acc, tech) => {
      const cat = tech.category || "Other";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push({ id: tech.id, name: tech.technology, featured: false });
      return acc;
    }, {} as Record<string, SkillItem[]>);

    groupedSkills = Object.entries(groups)
      .map(([category, skills]) => ({ category, skills }))
      .sort((a, b) => {
        if (a.category === "Other") return 1;
        if (b.category === "Other") return -1;
        return 0;
      });
  } else {
    groupedSkills = defaultSkillsData;
  }

  // IntersectionObserver — staggered reveal
  const observerCallback = useCallback<IntersectionObserverCallback>((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target as HTMLElement;
        const delay = parseFloat(el.dataset.delay || "0");
        setTimeout(() => el.classList.add("is-visible"), delay * 1000);
      }
    });
  }, []);

  useEffect(() => {
    const listEl = listRef.current;
    if (!listEl) return;
    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.15,
      rootMargin: "0px 0px -40px 0px",
    });
    const rows = listEl.querySelectorAll(".ed-skills__category");
    rows.forEach((row) => observer.observe(row));
    return () => observer.disconnect();
  }, [groupedSkills, observerCallback]);

  return (
    <section id="skills" className="ed-skills">
      <div className="ed-skills__inner">
        {/* Sticky Sidebar */}
        <aside className="ed-skills__sidebar">
          <p className="ed-skills__eyebrow">My Skills</p>
          <h2 className="ed-skills__heading">
            Technologies I<br />
            <em>work with</em>
          </h2>
          <p className="ed-skills__description">
            A curated set of languages, frameworks, and tools I use
            to design and ship modern digital products.
          </p>
        </aside>

        {/* Skill Categories */}
        <div className="ed-skills__list" ref={listRef}>
          {groupedSkills.map((group, i) => (
            <div
              key={group.category}
              className="ed-skills__category"
              data-delay={String(i * 0.12)}
            >
              <div className="ed-skills__category-header">
                <h3 className="ed-skills__category-title">{group.category}</h3>
                <span className="ed-skills__category-count">
                  {String(group.skills.length).padStart(2, "0")} skill{group.skills.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="ed-skills__tags">
                {group.skills.map((skill) => (
                  <span
                    key={skill.id || skill.name}
                    className={`ed-skills__tag${skill.featured ? " ed-skills__tag--primary" : ""}`}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
