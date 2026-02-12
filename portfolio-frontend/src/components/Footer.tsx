const Footer = () => (
  <footer className="border-t border-border py-8 px-6 md:px-12">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
      <p className="text-muted-foreground text-sm">
        © {new Date().getFullYear()} Portfolio. All rights reserved.
      </p>
      <div className="flex gap-6">
        {["GitHub", "LinkedIn", "Twitter"].map((link) => (
          <a key={link} href="#" className="text-muted-foreground text-sm hover:text-primary transition-colors">
            {link}
          </a>
        ))}
      </div>
    </div>
  </footer>
);

export default Footer;
