import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

interface HeroProps {
  tagLine?: string;
  bio?: string;
  profileImage?: string;
}

const HeroSection = ({ tagLine, bio, profileImage }: HeroProps) => {
  return (
    <section id="home" className="relative min-h-screen flex items-center section-padding pt-32">
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full relative grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-12 items-center">
        <div className="space-y-2">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <p className="text-primary font-heading text-sm md:text-base font-medium tracking-widest uppercase mb-6">
              Welcome to my portfolio
            </p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold leading-[0.95] tracking-tight mb-8"
          >
            <>
              Learning fast,
              <br />
              building <span className="text-gradient">faster</span>.
            </>

          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-muted-foreground text-lg md:text-xl max-w-xl leading-relaxed mb-12"
          >
            <p>
              An aspiring software engineer dedicated to the craft of development,
              transforming abstract logic into robust systems designed to solve real-world problems.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex gap-4"
          >
            <button
              onClick={() => document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" })}
              className="px-8 py-3.5 bg-primary text-primary-foreground font-heading font-semibold text-sm rounded-lg hover:brightness-110 transition-all"
            >
              View Projects
            </button>
            <button
              onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
              className="px-8 py-3.5 border border-border text-foreground font-heading font-semibold text-sm rounded-lg hover:bg-secondary transition-all"
            >
              Contact Me
            </button>
          </motion.div>
        </div>

        {/* Right Column: Image */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="hidden md:flex justify-center relative"
        >
          <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse" />
            <img
              src={profileImage || "/Portfolio-image-2.png"}
              alt="Profile"
              className="w-fit h-fit object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500 ease-in-out"
            />
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
          <ArrowDown className="w-5 h-5 text-muted-foreground" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
