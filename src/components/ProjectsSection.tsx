import AnimatedSection from "./AnimatedSection";
import { ExternalLink, Github } from "lucide-react";

const projects = [
  {
    title: "E-Commerce Platform",
    description: "A full-featured online store with cart, checkout, and payment integration.",
    tags: ["React", "Node.js", "Stripe", "PostgreSQL"],
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
  },
  {
    title: "Task Management App",
    description: "Collaborative task manager with real-time updates and team features.",
    tags: ["TypeScript", "React", "WebSocket", "MongoDB"],
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop",
  },
  {
    title: "AI Dashboard",
    description: "Analytics dashboard with AI-powered insights and data visualization.",
    tags: ["Python", "React", "TensorFlow", "D3.js"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
  },
  {
    title: "Social Media App",
    description: "A modern social platform with real-time messaging and content sharing.",
    tags: ["React Native", "Firebase", "Redux", "Node.js"],
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=400&fit=crop",
  },
];

const ProjectsSection = () => {
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
            <AnimatedSection key={project.title} delay={i * 0.15}>
              <div className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-all duration-500">
                <div className="relative overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                    <button className="p-3 bg-primary rounded-full text-primary-foreground hover:brightness-110 transition">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <button className="p-3 bg-secondary rounded-full text-foreground hover:bg-muted transition">
                      <Github className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-heading text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="text-xs px-3 py-1 bg-secondary rounded-full text-secondary-foreground">
                        {tag}
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
