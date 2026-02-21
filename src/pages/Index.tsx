import { useEffect, useState } from "react";
import HeroSection from "../components/HeroSection";
import AboutSection from "../components/AboutSection";
import SkillsSection from "../components/SkillsSection";
import ProjectsSection from "../components/ProjectsSection";
import Navigation from "../components/Navigation";
import EducationSection from "../components/EducationSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// Resolve relative image paths (e.g. /uploads/...) to full URLs
const resolveUrl = (url: string | null | undefined): string | undefined => {
    if (!url) return undefined;
    if (url.startsWith("http")) return url; // Already absolute (e.g. Supabase URL)
    return `${API_URL}${url}`; // Prepend backend URL to relative paths
};

// --- Interfaces matching backend schemas ---
export interface PersonalDetail {
    id: number;
    email: string;
    contact: string;
    bio: string;
    tag_line: string;
    address: string;
    github: string;
    linkedin: string;
    profile_image?: string;
}

export interface Technology {
    id: number;
    technology: string;
    category: "Language" | "Framework/Library" | "Dev Tool" | "Database";
}

export interface Project {
    id: number;
    title: string;
    description: string;
    project_type: "Hobby" | "Professional" | "Open Source";
    live_link: string | null;
    github_link: string | null;
    cover_photo: string | null;
    tech_stack: Technology[];
}

export interface Education {
    id: number;
    school: string;
    start_date: string;
    end_date: string;
    course: string;
    note: string | null;
}

const Index = () => {
    const [personalData, setPersonalData] = useState<PersonalDetail | null>(null);
    const [technologies, setTechnologies] = useState<Technology[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [education, setEducation] = useState<Education[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [meRes, techRes, projRes, eduRes] = await Promise.allSettled([
                    fetch(`${API_URL}/api/me`),
                    fetch(`${API_URL}/api/technologies`),
                    fetch(`${API_URL}/api/projects`),
                    fetch(`${API_URL}/api/edu`),
                ]);

                // Personal Details
                if (meRes.status === "fulfilled" && meRes.value.ok) {
                    const meData = await meRes.value.json();
                    console.log("Personal Details:", meData);
                    setPersonalData(meData);
                } else {
                    console.warn("Personal details not found or failed to fetch");
                }

                // Technologies
                if (techRes.status === "fulfilled" && techRes.value.ok) {
                    const techData = await techRes.value.json();
                    console.log("Technologies:", techData);
                    setTechnologies(techData);
                }

                // Projects
                if (projRes.status === "fulfilled" && projRes.value.ok) {
                    const projData = await projRes.value.json();
                    console.log("Projects:", projData);
                    // Resolve cover_photo URLs
                    const resolved = projData.map((p: Project) => ({
                        ...p,
                        cover_photo: resolveUrl(p.cover_photo) ?? p.cover_photo,
                    }));
                    setProjects(resolved);
                }

                // Education
                if (eduRes.status === "fulfilled" && eduRes.value.ok) {
                    const eduData = await eduRes.value.json();
                    console.log("Education:", eduData);
                    setEducation(eduData);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-4"
                >
                    <div className="relative w-12 h-12">
                        <div className="absolute inset-0 rounded-full border-2 border-muted" />
                        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" />
                    </div>
                    <p className="text-muted-foreground font-heading text-sm tracking-widest uppercase">
                        Loading...
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navigation />
            <HeroSection tagLine={personalData?.tag_line} bio={personalData?.bio} profileImage={resolveUrl(personalData?.profile_image)} />
            <AboutSection bio={personalData?.bio} tagline={personalData?.tag_line} />
            <SkillsSection technologies={technologies} />
            <ProjectsSection projects={projects} />
            <EducationSection education={education} />
            <ContactSection
                email={personalData?.email}
                contact={personalData?.contact}
                address={personalData?.address}
                apiUrl={API_URL}
            />
            <Footer github={personalData?.github} linkedin={personalData?.linkedin} />
        </div>
    );
};

export default Index;
