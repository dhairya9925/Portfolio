import AnimatedSection from "./AnimatedSection";
import { User, Code, Coffee } from "lucide-react";

interface AboutProps {
  bio?: string;
  tagline?: string;
}

const AboutSection = ({ bio, tagline }: AboutProps) => {
  const stats = [
    { icon: Code, label: "Projects Completed", value: "50+" },
    { icon: Coffee, label: "Cups of Coffee", value: "1000+" },
    { icon: User, label: "Happy Clients", value: "30+" },
  ];

  return (
    <section id="about" className="section-padding">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection>
          <p className="text-primary font-heading text-sm font-medium tracking-widest uppercase mb-4">About Me</p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-12 tracking-tight">
            {tagline || (
              <>
                Turning ideas into <span className="text-gradient">reality</span>
              </>
            )}
          </h2>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-16 items-start">
          <AnimatedSection delay={0.2}>
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              {bio ? (
                <div dangerouslySetInnerHTML={{ __html: bio }} className="space-y-4" />
              ) : (
                <>
                  <p>
                    I'm a developer who loves creating beautiful, functional web applications. With a strong foundation in both front-end and back-end technologies, I bring ideas to life through clean code and thoughtful design.
                  </p>
                  <p>
                    When I'm not coding, you'll find me exploring new technologies,
                    contributing to open-source projects, or sharing knowledge with
                    the developer community.
                  </p>
                </>
              )}
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.4}>
            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-card border border-border rounded-xl p-6 text-center">
                  <stat.icon className="w-5 h-5 text-primary mx-auto mb-3" />
                  <p className="font-heading text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-muted-foreground text-xs mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
