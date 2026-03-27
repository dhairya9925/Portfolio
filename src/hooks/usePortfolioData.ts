import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import type { Me, Technology, Project, Education } from '../context/PortfolioContext';

export const usePortfolioData = () => {
  return useQuery({
    queryKey: ['portfolioData'],
    queryFn: async () => {
      // 1. Fetch personal details
      const { data: meData, error: meError } = await supabase
        .from('portfolio_personal_detail')
        .select('*')
        .limit(1)
        .single();
        
      if (meError && meError.code !== 'PGRST116') {
        console.error('Error fetching personal details:', meError);
      }

      // 2. Fetch technologies
      const { data: techData, error: techError } = await supabase
        .from('portfolio_technologies')
        .select('*');
        
      if (techError) {
        console.error('Error fetching technologies:', techError);
      }

      // 3. Fetch projects and their relations
      const { data: projectsData, error: projError } = await supabase
        .from('portfolio_projects')
        .select('*');
        
      if (projError) {
        console.error('Error fetching projects:', projError);
      }

      // Fetch project_technologies junction
      const { data: projTechData } = await supabase
        .from('portfolio_project_technologies')
        .select('*');

      // 4. Fetch education
      const { data: eduData, error: eduError } = await supabase
        .from('portfolio_education')
        .select('*');
        
      if (eduError) {
        console.error('Error fetching education:', eduError);
      }

      // Map Supabase 'portfolio_personal_detail' to 'Me' context format
      let me: Me | null = null;
      if (meData) {
        me = {
          full_name: meData.full_name,
          tagline: meData.tagline,
          bio: meData.bio,
          profile_image: meData.profile_image,
          resume_url: meData.resume_url,
          email: meData.email,
          github: meData.github,
          linkedin: meData.linkedin,
          twitter: meData.twitter,
          stats: {
            projects_completed: meData.projects_completed,
            years_of_experience: meData.years_of_experience,
            clients: meData.clients,
          }
        };
      }

      // Map Technologies
      const technologies: Technology[] = (techData || []).map(t => ({
        id: t.id,
        technology: t.technology,
        category: t.category,
        sort_order: t.order, // Map 'order' to 'sort_order'
      }));

      // Map Projects, combining with their technologies if needed
      const projects: Project[] = (projectsData || []).map(p => {
        // Find technologies for this project
        const techIds = (projTechData || [])
          .filter(pt => pt.project_id === p.id)
          .map(pt => pt.technology_id);
          
        const projectTechs = technologies.filter(t => t.id && techIds.includes(t.id));

        return {
          id: p.id,
          title: p.title,
          description: p.description,
          project_type: p.project_type,
          live_link: p.live_link,
          github_link: p.github_link,
          cover_photo: p.cover_photo,
          sort_order: p.order || p.sort_order, // Try both
          tech_stack: projectTechs
        };
      });

      // Map Education
      const education: Education[] = (eduData || []).map(e => ({
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
