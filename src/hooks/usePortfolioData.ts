import { useQuery } from '@tanstack/react-query';
import type { Me, Technology, Project, Education } from '../context/PortfolioContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const usePortfolioData = () => {
  return useQuery({
    queryKey: ['portfolioData'],
    queryFn: async () => {
      // Artificial 5-second delay for testing the loader animation
      // await new Promise(resolve => setTimeout(resolve, 5000));

      // Fetch endpoints concurrently
      const [meRes, techRes, projRes, eduRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/me`),
        fetch(`${API_BASE_URL}/api/technologies`),
        fetch(`${API_BASE_URL}/api/projects`),
        fetch(`${API_BASE_URL}/api/edu`)
      ]);

      if (!meRes.ok && meRes.status !== 404) console.error('Error fetching personal details:', meRes.statusText);
      if (!techRes.ok) console.error('Error fetching technologies:', techRes.statusText);
      if (!projRes.ok) console.error('Error fetching projects:', projRes.statusText);
      if (!eduRes.ok) console.error('Error fetching education:', eduRes.statusText);

      const meData = meRes.ok ? await meRes.json() : null;
      const techData = techRes.ok ? await techRes.json() : [];
      const projectsData = projRes.ok ? await projRes.json() : [];
      const eduData = eduRes.ok ? await eduRes.json() : [];

      // Map Me data
      let me: Me | null = null;
      if (meData) {
        me = {
          full_name: "Dhairya", // Supabase 'full_name' equivalent
          tagline: meData.tag_line,
          bio: meData.bio,
          profile_image: meData.profile_image,
          email: meData.email,
          github: meData.github,
          linkedin: meData.linkedin,
          stats: {
            projects_completed: 10,
            years_of_experience: 1,
            clients: 5,
          }
        };
      }

      // Map Technologies
      const technologies: Technology[] = techData.map((t: any) => ({
        id: t.id,
        technology: t.technology,
        category: t.category,
        sort_order: t.order,
      }));

      // Map Projects
      const projects: Project[] = projectsData.map((p: any) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        project_type: p.project_type,
        live_link: p.live_link,
        github_link: p.github_link,
        cover_photo: p.cover_photo,
        sort_order: p.order,
        tech_stack: (p.tech_stack || []).map((t: any) => ({
          id: t.id,
          technology: t.technology,
          category: t.category,
          sort_order: t.order,
        }))
      }));

      // Map Education
      const education: Education[] = eduData.map((e: any) => ({
        id: e.id,
        degree: e.course || '',
        institution: e.school || '',
        start_year: e.start_date || '',
        end_year: e.end_date || 'Present',
        description: e.note || '',
        sort_order: e.order
      }));

      return {
        me,
        technologies,
        projects,
        education
      };
    }
  });
};
