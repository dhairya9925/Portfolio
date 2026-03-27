import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import SkillsSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectsSection";
import EducationSection from "@/components/EducationSection";
import ContactSection from "@/components/ContactSection";

const Index = () => {
  return (
    <div className="ed-page">
      <Navbar />
      <HeroSection />
      <hr className="ed-divider" />
      <AboutSection />
      <hr className="ed-divider" />
      <SkillsSection />
      <hr className="ed-divider" />
      <ProjectsSection />
      <hr className="ed-divider" />
      <EducationSection />
      <hr className="ed-divider" />
      <ContactSection />
    </div>
  );
};

export default Index;
