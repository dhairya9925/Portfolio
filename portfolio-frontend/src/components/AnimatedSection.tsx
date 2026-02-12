import { useEffect, useRef, ReactNode } from "react";
import { motion, useInView, useAnimation, Variant } from "framer-motion";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

const variants = {
  hidden: { opacity: 0, y: 40 } as Variant,
  visible: { opacity: 1, y: 0 } as Variant,
};

const AnimatedSection = ({ children, className = "", delay = 0 }: AnimatedSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={controls}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;
