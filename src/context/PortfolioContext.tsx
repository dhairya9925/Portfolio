import { createContext, useContext, ReactNode } from "react";

// Types based on expected API response
export interface Me {
    full_name?: string;
    tagline?: string;
    bio?: string;
    profile_image?: string;
    resume_url?: string;
    email?: string;
    github?: string;
    linkedin?: string;
    twitter?: string;
    stats?: {
        projects_completed?: number;
        years_of_experience?: number;
        clients?: number;
    };
}

export interface Technology {
    id?: number;
    technology: string;
    category?: string;
    proficiency?: number;
    icon?: string;
    sort_order?: number;
}

export interface Project {
    id?: number;
    title: string;
    description: string;
    project_type?: string;
    live_link?: string;
    github_link?: string;
    cover_photo?: string;
    tech_stack?: Technology[];
    sort_order?: number;
    // Legacy fields for fallback
    technologies?: string[];
    image?: string;
    link?: string;
}

export interface Education {
    id?: number;
    degree: string;
    institution: string;
    start_year?: number | string;
    end_year?: number | string;
    description?: string;
    sort_order?: number;
}

interface PortfolioContextType {
    me: Me | null;
    technologies: Technology[];
    projects: Project[];
    education: Education[];
    loading: boolean;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider = ({
    children,
    value,
}: {
    children: ReactNode;
    value: PortfolioContextType;
}) => {
    return (
        <PortfolioContext.Provider value={value}>
            {children}
        </PortfolioContext.Provider>
    );
};

export const usePortfolio = () => {
    const context = useContext(PortfolioContext);
    if (context === undefined) {
        throw new Error("usePortfolio must be used within a PortfolioProvider");
    }
    return context;
};
