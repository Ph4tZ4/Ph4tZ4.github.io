import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Github, ExternalLink, FolderGit2 } from 'lucide-react';
import type { Project } from '../../types';

gsap.registerPlugin(ScrollTrigger);

export function Projects({ projects }: { projects: Project[] }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.project-card').forEach((card) => {
        gsap.from(card, {
          scrollTrigger: { trigger: card, start: 'top 80%', toggleActions: 'play none none reverse' },
          y: 100,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
        });
      });
      setTimeout(() => ScrollTrigger.refresh(), 100);
    }, root);
    return () => ctx.revert();
  }, [projects]);

  return (
    <div ref={root}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-4">
        <h2 className="font-display text-4xl md:text-6xl uppercase">Selected Works</h2>
        <div className="hidden md:block text-right text-gray-500 font-body text-sm">
          SCROLL TO EXPLORE
          <br />
          DRAG TO NAVIGATE
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="bg-surface border border-white/5 p-12 text-center">
          <FolderGit2 className="text-primary/30 w-12 h-12 mx-auto mb-4" />
          <h3 className="font-display text-2xl text-gray-400 mb-2">No Projects</h3>
          <p className="text-gray-600 text-sm">Add projects from the admin panel to display them here.</p>
        </div>
      ) : (
        <div className="space-y-16 md:space-y-24">
          {projects.map((data, index) => {
          const isEven = (index + 1) % 2 === 0;
          const repo = data.repoLink || data.link;
          return (
            <div
              key={index}
              className={`project-card group flex flex-col ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 md:gap-12 items-center`}
            >
              <div className="w-full md:w-1/2 overflow-hidden border border-white/10 relative aspect-video cursor-pointer">
                {data.image ? (
                  <>
                    <img
                      src={data.image}
                      alt={data.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                  </>
                ) : (
                  <>
                    <div className="absolute inset-0 bg-surfaceHighlight flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
                      <span className="font-display text-6xl text-white/5">{data.title.substring(0, 2)}</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                  </>
                )}
                <div className="absolute bottom-4 left-4">
                  <span className="bg-primary text-black text-xs font-bold px-2 py-1 uppercase">{data.tech}</span>
                </div>
              </div>

              <div className={`w-full md:w-1/2 text-left ${isEven ? 'md:text-right' : 'md:text-left'}`}>
                <h3 className="text-primary font-body text-xs md:text-sm tracking-widest mb-2">
                  0{index + 1} / PROJECT
                </h3>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-display uppercase mb-4 md:mb-6 group-hover:text-primary transition-colors cursor-pointer">
                  {data.title}
                </h2>
                <p className={`text-gray-400 text-base md:text-lg mb-6 md:mb-8 leading-relaxed max-w-md ${isEven ? 'md:ml-auto' : ''}`}>
                  {data.description}
                </p>
                <div className={`flex gap-6 justify-start ${isEven ? 'md:justify-end' : 'md:justify-start'}`}>
                  {repo && (
                    <a
                      href={repo}
                      target="_blank"
                      rel="noreferrer"
                      className="text-white border-b border-white/20 pb-1 hover:border-primary hover:text-primary transition-all uppercase tracking-widest text-xs md:text-sm flex items-center gap-2"
                    >
                      <Github className="w-4 h-4" /> Visit Repo
                    </a>
                  )}
                  {data.demoLink && (
                    <a
                      href={data.demoLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-white border-b border-white/20 pb-1 hover:border-primary hover:text-primary transition-all uppercase tracking-widest text-xs md:text-sm flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" /> Visit Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
          })}
        </div>
      )}
    </div>
  );
}
