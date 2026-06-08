import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ThreeBackground } from '../../components/ThreeBackground';
import type { PageId } from '../../types';

export function Home({ navigate }: { navigate: (page: PageId) => void }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.reveal-text', { y: 200, skewY: 10, duration: 1.2, stagger: 0.1, ease: 'power4.out' });
      gsap.to('.fade-in-up', { opacity: 1, y: 0, duration: 1, delay: 0.5, stagger: 0.2 });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root}>
      <ThreeBackground />
      <div className="h-[80vh] flex flex-col justify-center relative z-10">
        <h1 className="font-display font-bold text-[12vw] md:text-[10vw] lg:text-[9vw] leading-[0.85] uppercase tracking-tighter mix-blend-exclusion">
          <div className="overflow-hidden">
            <span className="block reveal-text">Kittiphat</span>
          </div>
          <div className="overflow-hidden">
            <span className="block reveal-text text-transparent text-stroke">Developer</span>
          </div>
          <div className="overflow-hidden">
            <span className="block reveal-text text-primary">Portfolio</span>
          </div>
        </h1>

        <div className="mt-8 md:mt-12 flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-6 opacity-0 fade-in-up">
          <p className="font-body text-gray-400 max-w-md text-base md:text-lg">
            I&rsquo;m a young software developer creating technology that is both functional and inspiring.
            Check out more of my work here and on my GitHub!
          </p>
          <div className="flex flex-col xs:flex-row space-y-4 xs:space-y-0 xs:space-x-4 w-full md:w-auto">
            <button
              onClick={() => navigate('projects')}
              className="w-full xs:w-auto px-8 py-4 border border-primary text-primary hover:bg-primary hover:text-black transition-all font-bold tracking-widest uppercase text-sm text-center"
            >
              Explore Works
            </button>
            <a
              href="/Docs/KittiphatCV.pdf"
              target="_blank"
              download
              className="w-full xs:w-auto px-8 py-4 border border-white/20 text-white hover:border-primary hover:text-primary transition-all font-bold tracking-widest uppercase text-sm flex items-center justify-center"
            >
              Download CV
            </a>
          </div>
        </div>

        <div className="absolute bottom-0 right-0 opacity-0 fade-in-up delay-300 hidden md:block">
          <span className="font-display text-6xl md:text-9xl opacity-10 select-none">2025</span>
        </div>
      </div>
    </div>
  );
}
