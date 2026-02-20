import AnimatedSection from "./AnimatedSection";

interface Technology {
  id: number;
  technology: string;
  category: "Language" | "Framework/Library" | "Dev Tool" | "Database";
}

interface SkillsProps {
  technologies?: Technology[];
}

// Map backend category values to display-friendly names
const categoryDisplayNames: Record<string, string> = {
  Language: "Languages",
  "Framework/Library": "Frameworks & Libraries",
  "Dev Tool": "Dev Tools",
  Database: "Databases",
};

// The four categories in display order
const categoryOrder = ["Language", "Framework/Library", "Dev Tool", "Database"];

const SkillCategory = ({
  category,
  items,
  index,
}: {
  category: string;
  items: string[];
  index: number;
}) => (
  <AnimatedSection delay={index * 0.1} className="h-full">
    <div className="h-full p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-colors duration-300">
      <h3 className="text-xl font-heading font-medium mb-4 text-primary">{category}</h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mr-2" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  </AnimatedSection>
);

const SkillsSection = ({ technologies = [] }: SkillsProps) => {
  // Group technologies by category
  const grouped = categoryOrder.map((cat) => ({
    category: categoryDisplayNames[cat] || cat,
    items: technologies.filter((t) => t.category === cat).map((t) => t.technology),
  }));

  // Filter out empty categories
  const skillsData = grouped.filter((g) => g.items.length > 0);

  // If no data from API, show nothing or a placeholder
  if (skillsData.length === 0) {
    return null;
  }

  return (
    <section id="skills" className="section-padding bg-card/50">
      <div className="max-w-7xl mx-auto container px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center mb-16">
            <p className="text-primary font-heading text-sm font-medium tracking-widest uppercase mb-4">My Skills</p>
            <h2 className="font-heading text-4xl md:text-5xl font-bold tracking-tight">
              Technologies I <span className="text-gradient">work with</span>
            </h2>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillsData.map((skillGroup, i) => (
            <SkillCategory key={skillGroup.category} {...skillGroup} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
