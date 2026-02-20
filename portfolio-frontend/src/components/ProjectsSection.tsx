import AnimatedSection from "./AnimatedSection";
import { ExternalLink, Github } from "lucide-react";

interface Technology {
  id: number;
  technology: string;
  category: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  project_type: "Hobby" | "Professional" | "Open Source";
  live_link: string | null;
  github_link: string | null;
  cover_photo: string | null;
  tech_stack: Technology[];
}

interface ProjectsProps {
  projects?: Project[];
}

const ProjectsSection = ({ projects = [] }: ProjectsProps) => {
  if (projects.length === 0) {
    return null;
  }

  return (
    <section id="projects" className="section-padding">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection>
          <p className="text-primary font-heading text-sm font-medium tracking-widest uppercase mb-4">My Work</p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-16 tracking-tight">
            Featured <span className="text-gradient">projects</span>
          </h2>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, i) => (
            <AnimatedSection key={project.id} delay={i * 0.15}>
              <div className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-all duration-500">
                <div className="relative overflow-hidden">
                  {project.cover_photo ? (
                    <img
                      src={project.cover_photo}
                      alt={project.title}
                      className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-52 bg-secondary/50 flex items-center justify-center">
                      <span className="text-muted-foreground text-sm">No Cover Image</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                    {project.live_link && (
                      <a
                        href={project.live_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-primary rounded-full text-primary-foreground hover:brightness-110 transition"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    {project.github_link && (
                      <a
                        href={project.github_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-secondary rounded-full text-foreground hover:bg-muted transition"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-heading text-xl font-semibold">{project.title}</h3>
                    <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium">
                      {project.project_type}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech_stack.map((tech) => (
                      <span key={tech.id} className="text-xs px-3 py-1 bg-secondary rounded-full text-secondary-foreground">
                        {tech.technology}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
