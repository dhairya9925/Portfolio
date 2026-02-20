import AnimatedSection from "./AnimatedSection";
import { GraduationCap } from "lucide-react";

interface Education {
  id: number;
  school: string;
  start_date: string;
  end_date: string;
  course: string;
  note: string | null;
}

interface EducationProps {
  education?: Education[];
}

const EducationSection = ({ education = [] }: EducationProps) => {
  if (education.length === 0) {
    return null;
  }

  return (
    <section id="education" className="section-padding bg-card/50">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection>
          <p className="text-primary font-heading text-sm font-medium tracking-widest uppercase mb-4">Education</p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-16 tracking-tight">
            My <span className="text-gradient">journey</span>
          </h2>
        </AnimatedSection>

        <div className="max-w-3xl relative">
          {/* Timeline line */}
          <div className="absolute left-[19px] top-2 bottom-2 w-px bg-border" />

          <div className="space-y-12">
            {education.map((item, i) => (
              <AnimatedSection key={item.id} delay={i * 0.2}>
                <div className="flex gap-6">
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                      <GraduationCap className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-primary font-heading font-medium">{item.start_date} - {item.end_date}</span>
                    <h3 className="font-heading text-xl font-semibold mt-1">{item.course}</h3>
                    <p className="text-muted-foreground text-sm mt-1">{item.school}</p>
                    {item.note && (
                      <p className="text-muted-foreground text-sm mt-3 leading-relaxed">{item.note}</p>
                    )}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EducationSection;
