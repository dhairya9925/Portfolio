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
    <section id="projects" className="section-padding overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection>
          <div className="flex flex-col items-center text-center mb-24">
            <p className="text-primary font-heading text-sm font-medium tracking-widest uppercase mb-4">My Work</p>
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Featured <span className="text-gradient">projects</span>
            </h2>
            <div className="w-24 h-1 bg-primary/30 mt-8 rounded-full"></div>
          </div>
        </AnimatedSection>

        <div className="flex flex-col gap-32">
          {projects.map((project, i) => {
            const isEven = i % 2 === 0;

            return (
              <AnimatedSection key={project.id} delay={0.1}>
                <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-20`}>

                  {/* Image Container - Takes up more space */}
                  <div className="w-full lg:w-3/5 relative group perspective">
                    {/* Decorative glowing background */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-700 rounded-[2rem] -z-10"></div>

                    <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card shadow-2xl transition-transform duration-500 group-hover:shadow-primary/10">
                      {project.cover_photo ? (
                        <div className="relative aspect-video">
                          <img
                            src={project.cover_photo}
                            alt={project.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                          />
                          {/* Subtle overlay gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60"></div>
                        </div>
                      ) : (
                        <div className="w-full aspect-video bg-secondary/30 flex items-center justify-center">
                          <span className="text-muted-foreground font-medium flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                            No Preview Available
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Text Content Container */}
                  <div className="w-full lg:w-2/5 flex flex-col justify-center">
                    <div className="mb-6 flex items-center gap-3">
                      <span className="text-xs px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full font-semibold tracking-wide uppercase shadow-[0_0_15px_rgba(255,165,0,0.1)]">
                        {project.project_type}
                      </span>
                    </div>

                    <h3 className="font-heading text-3xl md:text-4xl font-bold mb-6 text-foreground drop-shadow-sm">
                      {project.title}
                    </h3>

                    <div className="p-6 bg-card/40 backdrop-blur-sm border border-border/50 rounded-2xl shadow-lg mb-8 relative">
                      <div className="absolute -left-[1px] top-1/2 -translate-y-1/2 w-[3px] h-12 bg-primary/50 rounded-r-md"></div>
                      <p className="text-muted-foreground leading-relaxed md:text-lg">
                        {project.description}
                      </p>
                    </div>

                    <div className="mb-10">
                      <p className="text-sm font-semibold text-foreground/80 mb-4 uppercase tracking-wider">Technologies Used</p>
                      <div className="flex flex-wrap gap-2">
                        {project.tech_stack.map((tech) => (
                          <span
                            key={tech.id}
                            className="text-sm px-4 py-1.5 bg-secondary/50 border border-border/80 hover:border-primary/50 hover:bg-secondary transition-colors duration-300 rounded-lg text-secondary-foreground font-medium"
                          >
                            {tech.technology}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* CTAs */}
                    <div className="flex items-center gap-4">
                      {project.live_link && (
                        <a
                          href={project.live_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:brightness-110 shadow-[0_0_20px_rgba(255,165,0,0.3)] hover:shadow-[0_0_25px_rgba(255,165,0,0.5)] transition-all duration-300 hover:-translate-y-1"
                        >
                          <span>Live Demo</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      {project.github_link && (
                        <a
                          href={project.github_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-6 py-3 bg-secondary/80 text-foreground border border-border font-semibold rounded-xl hover:bg-secondary hover:border-border transition-all duration-300 hover:-translate-y-1"
                        >
                          <Github className="w-4 h-4" />
                          <span>Source Code</span>
                        </a>
                      )}
                    </div>
                  </div>

                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
