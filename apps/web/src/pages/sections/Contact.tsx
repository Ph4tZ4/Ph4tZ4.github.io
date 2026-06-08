import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ThreeBackground } from '../../components/ThreeBackground';

export function Contact() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('h2', { y: 100, opacity: 0, duration: 1, ease: 'back.out(1.7)' });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root}>
      <ThreeBackground />
      <div className="min-h-[60vh] flex flex-col justify-center items-center text-center relative z-10">
        <h2 className="font-display text-[8vw] leading-none uppercase mb-8 text-primary transition-colors cursor-default">
          Let&apos;s Talk
        </h2>
        <p className="font-body text-xl text-gray-400 max-w-xl mb-12">
          Have a project in mind? Looking for a developer who understands design?
        </p>
        <a
          href="mailto:pikanomwaan.code@gmail.com"
          className="inline-block border border-white/20 px-6 py-4 md:px-12 md:py-6 text-base md:text-2xl font-display uppercase tracking-widest hover:bg-primary hover:text-black hover:scale-105 transition-all duration-300 break-all md:break-normal"
        >
          pikanomwaan.code@gmail.com
        </a>
        <div className="mt-24 flex space-x-8">
          <a href="https://www.instagram.com/k._.kttp.q" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-primary transition-colors">
            INSTAGRAM
          </a>
          <a href="https://www.tiktok.com/@k._.kttp.q" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-primary transition-colors">
            TIKTOK
          </a>
          <a href="https://x.com/Ph4tZ4" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-primary transition-colors">
            X
          </a>
          <a href="https://github.com/Ph4tZ4" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-primary transition-colors">
            GITHUB
          </a>
        </div>
      </div>
    </div>
  );
}
