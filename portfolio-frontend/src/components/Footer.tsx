import { Github, Linkedin } from "lucide-react";

interface FooterProps {
    github?: string;
    linkedin?: string;
}

const Footer = ({ github, linkedin }: FooterProps) => (
    <footer className="border-t border-border py-8 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm">
                © {new Date().getFullYear()} Portfolio. All rights reserved.
            </p>
            <div className="flex gap-6">
                {github && (
                    <a
                        href={github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground text-sm hover:text-primary transition-colors flex items-center gap-1.5"
                    >
                        <Github className="w-4 h-4" /> GitHub
                    </a>
                )}
                {linkedin && (
                    <a
                        href={linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground text-sm hover:text-primary transition-colors flex items-center gap-1.5"
                    >
                        <Linkedin className="w-4 h-4" /> LinkedIn
                    </a>
                )}
            </div>
        </div>
    </footer>
);

export default Footer;
