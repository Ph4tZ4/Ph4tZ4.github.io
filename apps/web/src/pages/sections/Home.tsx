import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ThreeBackground } from '../../components/ThreeBackground';
import type { PageId } from '../../types';

export function Home({ navigate }: { navigate: (page: PageId) => void }) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const revealText = gsap.utils.toArray<HTMLElement>('.reveal-text');
      const developerLetters = gsap.utils.toArray<HTMLElement>('.developer-letter');
      const fadeInUp = gsap.utils.toArray<HTMLElement>('.fade-in-up');

      gsap.set(revealText, { yPercent: 115 });
      gsap.set(fadeInUp, { opacity: 0, y: 24 });

      gsap
        .timeline()
        .to(revealText, {
          yPercent: 0,
          duration: 1.2,
          stagger: 0.1,
          ease: 'power4.out',
        })
        .fromTo(
          '.developer-float .reveal-text',
          { skewY: 10 },
          {
            skewY: 0,
            duration: 1.2,
            ease: 'power4.out',
          },
          0,
        )
        .to(
          fadeInUp,
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.2,
            clearProps: 'transform',
          },
          '-=0.7',
        )
        .fromTo(
          developerLetters,
          { y: 2 },
          {
            y: -2,
            duration: 1.8,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            stagger: {
              each: 0.12,
              repeat: -1,
              yoyo: true,
            },
          },
          '<',
        );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root}>
      <ThreeBackground />
      <div className="h-[80vh] flex flex-col justify-center relative z-10">
        <h1 className="font-display font-bold text-[clamp(4.0rem,11vw,10.5rem)] md:text-[clamp(6rem,10vw,10rem)] lg:text-[clamp(6.5rem,8.5vw,9.5rem)] leading-[0.85] uppercase tracking-tighter mix-blend-exclusion">
          <div className="overflow-hidden">
            <span className="block reveal-text">Kittiphat</span>
          </div>
          <div className="overflow-hidden developer-float">
            <span className="block reveal-text text-transparent text-stroke whitespace-nowrap">
              {'Developer'.split('').map((letter, index) => (
                <span key={`${letter}-${index}`} className="developer-letter inline-block">
                  {letter}
                </span>
              ))}
            </span>
          </div>
          <div className="overflow-hidden">
            <span className="block reveal-text text-primary">Portfolio</span>
          </div>
        </h1>

        <div className="mt-8 md:mt-12 flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-6 opacity-0 fade-in-up">
          <p className="font-body text-gray-400 max-w-md text-base md:text-lg">
            ผมเป็นนักพัฒนาซอฟต์แวร์รุ่นใหม่ที่สร้างเทคโนโลยีให้ทั้งใช้งานได้จริงและสร้างแรงบันดาลใจ
            สามารถดูผลงานเพิ่มเติมของผมได้ที่นี่และบน GitHub!
          </p>
          <div className="flex flex-col xs:flex-row space-y-4 xs:space-y-0 xs:space-x-4 w-full md:w-auto">
            <button
              onClick={() => navigate('projects')}
              className="w-full xs:w-auto px-8 py-4 border border-primary text-primary hover:bg-primary hover:text-black transition-all font-bold tracking-widest uppercase text-sm text-center"
            >
              สำรวจผลงาน
            </button>
            <a
              href="/Docs/KittiphatCV.pdf"
              target="_blank"
              download
              className="w-full xs:w-auto px-8 py-4 border border-white/20 text-white hover:border-primary hover:text-primary transition-all font-bold tracking-widest uppercase text-sm flex items-center justify-center"
            >
              ดาวน์โหลด CV
            </a>
          </div>
        </div>

        <div className="absolute bottom-0 right-0 opacity-0 fade-in-up delay-300 hidden md:block">
          <span className="font-display text-6xl md:text-9xl opacity-10 select-none">2026</span>
        </div>
      </div>
    </div>
  );
}
