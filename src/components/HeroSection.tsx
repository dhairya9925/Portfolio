import { useEffect, useRef } from "react";
import { usePortfolio } from "@/context/PortfolioContext";

const HeroSection = () => {
  const { me } = usePortfolio();
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Staggered fade-in for hero children
    const els = sectionRef.current?.querySelectorAll('.ed-reveal');
    if (!els) return;
    els.forEach((el, i) => {
      setTimeout(() => el.classList.add('is-visible'), 300 + i * 150);
    });
  }, []);

  return (
    <section id="home" className="ed-hero" ref={sectionRef}>
      <div className="ed-hero__inner">
        <div>
          <div className="ed-reveal">
            <p className="ed-hero__eyebrow">
              <span className="ed-hero__dot" />
              Available for work
            </p>
          </div>

          <h1 className="ed-hero__title ed-reveal">
            {me?.tagline && !me.tagline.includes("Turning ideas") ? (
              <>
                {me.tagline.split(',').map((part, i, arr) => {
                  const words = part.trim().split(' ');
                  const lastWord = words.pop();
                  return (
                    <span key={i}>
                      {i === arr.length - 1 ? (
                        <>{words.join(' ')}{words.length > 0 ? ' ' : ''}<em>{lastWord}</em></>
                      ) : (
                        <>{part.trim()}</>
                      )}
                      {i < arr.length - 1 && <br />}
                    </span>
                  );
                })}
              </>
            ) : (
              <>
                Crafting systems<br />
                across software and <em>data.</em>
              </>
            )}
          </h1>

          <p className="ed-hero__subtitle ed-reveal">
            An aspiring software engineer dedicated to the craft of development,
            transforming abstract logic into robust systems designed to solve
            real-world problems.
          </p>

          <div className="ed-hero__ctas ed-reveal">
            <button
              className="ed-btn--primary"
              onClick={() => document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" })}
            >
              View Projects
            </button>
            <button
              className="ed-btn--ghost"
              onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
            >
              Contact Me
            </button>
          </div>
        </div>

        <div className="ed-hero__visual ed-reveal">
          <img
            src={me?.profile_image || "/Editorial\ Styled\ image\ nobg.png"}
            alt={me?.full_name || "Profile"}
            className="ed-hero__avatar"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
