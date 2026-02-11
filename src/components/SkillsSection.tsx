import AnimatedSection from "./AnimatedSection";
import { motion } from "framer-motion";

const skills = [
  { name: "React", level: 90 },
  { name: "TypeScript", level: 85 },
  { name: "Node.js", level: 80 },
  { name: "Python", level: 75 },
  { name: "Tailwind CSS", level: 92 },
  { name: "PostgreSQL", level: 70 },
  { name: "Docker", level: 65 },
  { name: "Git", level: 88 },
];

const SkillBar = ({ name, level, index }: { name: string; level: number; index: number }) => (
  <AnimatedSection delay={index * 0.08} className="group">
    <div className="flex justify-between mb-2">
      <span className="font-heading text-sm font-medium text-foreground">{name}</span>
      <span className="text-xs text-muted-foreground">{level}%</span>
    </div>
    <div className="h-2 bg-secondary rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${level}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.3 + index * 0.08, ease: "easeOut" }}
        className="h-full rounded-full bg-primary"
      />
    </div>
  </AnimatedSection>
);

const SkillsSection = () => {
  return (
    <section id="skills" className="section-padding bg-card/50">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection>
          <p className="text-primary font-heading text-sm font-medium tracking-widest uppercase mb-4">My Skills</p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-16 tracking-tight">
            Technologies I <span className="text-gradient">work with</span>
          </h2>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-x-16 gap-y-8 max-w-4xl">
          {skills.map((skill, i) => (
            <SkillBar key={skill.name} {...skill} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
