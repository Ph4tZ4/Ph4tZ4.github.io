import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Award, X } from 'lucide-react';
import type { Certificate } from '../../types';

gsap.registerPlugin(ScrollTrigger);

export function Certificates({ certificates }: { certificates: Certificate[] }) {
  const root = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.certificate-card').forEach((card, index) => {
        gsap.from(card, {
          scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none reverse' },
          y: 50,
          opacity: 0,
          duration: 0.8,
          delay: index * 0.1,
          ease: 'power3.out',
        });
      });
      setTimeout(() => ScrollTrigger.refresh(), 100);
    }, root);
    return () => ctx.revert();
  }, [certificates]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = selected !== null ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [selected]);

  const active = selected !== null ? certificates[selected] : null;

  return (
    <div ref={root}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-4">
        <h2 className="font-display text-4xl md:text-6xl uppercase">Certifications</h2>
        <div className="hidden md:block text-right text-gray-500 font-body text-sm">PROFESSIONAL ACHIEVEMENTS</div>
      </div>

      {certificates.length === 0 ? (
        <div className="bg-surface border border-white/5 p-12 text-center">
          <Award className="text-primary/30 w-12 h-12 mx-auto mb-4" />
          <h3 className="font-display text-2xl text-gray-400 mb-2">No Certificates</h3>
          <p className="text-gray-600 text-sm">Add certificates from the admin panel to display them here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {certificates.map((data, index) => (
            <div
              key={index}
              onClick={() => setSelected(index)}
              className="certificate-card group bg-surface border border-white/10 hover:border-primary/50 transition-all duration-300 overflow-hidden cursor-pointer"
            >
              {data.image && (
                <div className="w-full h-48 overflow-hidden relative">
                  <img
                    src={data.image}
                    alt={data.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
                </div>
              )}
              <div className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-primary/10 p-3 border border-primary/20">
                    <Award className="text-primary w-8 h-8" />
                  </div>
                  <span className="text-xs text-gray-500 uppercase tracking-widest">{data.date}</span>
                </div>
                <h3 className="text-2xl font-display uppercase mb-2 group-hover:text-primary transition-colors">
                  {data.title}
                </h3>
                <p className="text-primary text-sm mb-4 font-semibold">{data.issuer}</p>
                <p className="text-gray-400 leading-relaxed">{data.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {active && (
        <div className="fixed inset-0 z-[100] transition-opacity duration-300">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl px-4 md:px-8">
            <div className="bg-surface border border-white/10 flex flex-col md:flex-row overflow-hidden max-h-[85vh] md:max-h-[90vh] w-full">
              <div className="w-full md:w-1/2 bg-black/50 relative flex items-center justify-center bg-zinc-900 h-56 md:h-auto shrink-0">
                <img src={active.image || ''} alt="Certificate" className="w-full h-full object-contain p-4 md:p-0" />
              </div>
              <div className="w-full md:w-1/2 bg-surface relative flex flex-col min-h-0 flex-1 md:flex-none">
                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors z-20 bg-surface/80 rounded-full p-1"
                >
                  <X className="w-8 h-8" />
                </button>
                <div className="p-6 md:p-12 overflow-y-auto h-full">
                  <div className="mb-6 mt-8 md:mt-0">
                    <span className="text-primary text-sm font-bold tracking-widest uppercase mb-2 block">
                      {active.date}
                    </span>
                    <h2 className="text-2xl md:text-4xl font-display uppercase text-white mb-2 leading-tight">
                      {active.title}
                    </h2>
                    <p className="text-gray-400 text-base md:text-lg">{active.issuer}</p>
                  </div>
                  <div className="w-12 h-1 bg-primary mb-6 shrink-0" />
                  <div className="text-gray-300 leading-relaxed text-base md:text-lg pb-8">
                    <p>{active.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
