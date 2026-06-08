import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { GraduationCap, Briefcase, Lightbulb, Zap, Heart } from 'lucide-react';
import type { About as AboutType } from '../../types';

export function About({ data }: { data: AboutType }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (root.current) {
        gsap.from(root.current.children, { opacity: 0, y: 20, duration: 0.8, stagger: 0.2 });
      }
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mt-8 md:mt-12">
        <center className="order-first lg:order-none">
          <div className="relative w-full max-w-[400px] lg:max-w-[500px]">
            <div className="w-full aspect-[5/6] bg-surfaceHighlight border border-white/5 relative overflow-hidden group about-image-container">
              <img src="/images/Avata.JPG" alt="Profile" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60" />
              <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 bg-black/80 backdrop-blur border border-white/10 p-4 md:p-6 max-w-[200px] md:max-w-xs">
                <div className="text-3xl md:text-4xl font-display text-primary mb-1">{data.years}</div>
                <div className="text-[10px] md:text-xs uppercase tracking-widest text-gray-400">Years Experience</div>
              </div>
            </div>
          </div>
        </center>

        <div className="flex flex-col justify-start">
          <h2 className="font-display text-4xl md:text-6xl mb-6 md:mb-8 uppercase text-center lg:text-left">Who I Am</h2>

          <div
            className="about-scroll-container max-h-[400px] md:max-h-[500px] overflow-y-auto pr-2 md:pr-4"
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#EAB308 #1E1E1E' }}
          >
            <div className="mb-8">
              <p className="font-body text-lg md:text-xl text-gray-300 leading-relaxed mb-4 text-justify md:text-left">
                {data.description}
              </p>
              <p className="font-body text-gray-400 leading-relaxed text-justify md:text-left">{data.detail}</p>
            </div>

            <div className="border-t border-white/10 pt-6 pb-6 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 mb-8">
              <div>
                <h4 className="text-primary font-display uppercase text-lg mb-2">Location</h4>
                <p className="text-gray-400">{data.location}</p>
              </div>
              <div>
                <h4 className="text-primary font-display uppercase text-lg mb-2">Availability</h4>
                <p className="text-gray-400">{data.status}</p>
              </div>
            </div>

            {data.education?.length > 0 && (
              <div className="border-t border-white/10 pt-6 mb-8">
                <h3 className="font-display text-2xl text-primary uppercase mb-4 flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2" /> Education
                </h3>
                <div className="space-y-4">
                  {data.education.map((edu, i) => (
                    <div key={i} className="bg-surface/50 border border-white/5 p-4 hover:border-primary/30 transition-all">
                      <div className="flex flex-col sm:flex-row justify-between items-start mb-2">
                        <h4 className="font-display text-lg text-white">{edu.degree}</h4>
                        <span className="text-xs text-gray-500 uppercase tracking-wider mt-1 sm:mt-0">{edu.year}</span>
                      </div>
                      <p className="text-primary text-sm mb-2">{edu.institution}</p>
                      <p className="text-gray-400 text-sm leading-relaxed">{edu.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.experience?.length > 0 && (
              <div className="border-t border-white/10 pt-6 mb-8">
                <h3 className="font-display text-2xl text-primary uppercase mb-4 flex items-center">
                  <Briefcase className="w-5 h-5 mr-2" /> Experience
                </h3>
                <div className="space-y-4">
                  {data.experience.map((exp, index) => (
                    <div key={index} className={`relative pl-6 border-l-2 ${index === 0 ? 'border-primary' : 'border-white/10'}`}>
                      <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full ${index === 0 ? 'bg-primary' : 'bg-white/20'}`} />
                      <div className="pb-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start mb-2">
                          <h4 className="font-display text-lg text-white">{exp.role}</h4>
                          <span className="text-xs text-gray-500 uppercase tracking-wider mt-1 sm:mt-0">{exp.period}</span>
                        </div>
                        <p className="text-primary text-sm mb-2">{exp.company}</p>
                        <p className="text-gray-400 text-sm leading-relaxed">{exp.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.philosophy && (
              <div className="border-t border-white/10 pt-6 mb-8">
                <h3 className="font-display text-2xl text-primary uppercase mb-4 flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2" /> Philosophy &amp; Approach
                </h3>
                <div className="bg-surface/50 border border-white/5 p-5 border-l-2 border-l-primary">
                  <p className="text-gray-300 leading-relaxed italic">&ldquo;{data.philosophy}&rdquo;</p>
                </div>
              </div>
            )}

            {data.expertise?.length > 0 && (
              <div className="border-t border-white/10 pt-6 mb-8">
                <h3 className="font-display text-2xl text-primary uppercase mb-4 flex items-center">
                  <Zap className="w-5 h-5 mr-2" /> Technical Expertise
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {data.expertise.map((exp, i) => (
                    <div key={i} className="bg-surface/50 border border-white/5 p-4 hover:border-primary/30 transition-all group">
                      <h4 className="font-display text-base text-white mb-2 group-hover:text-primary transition-colors">{exp.area}</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.interests?.length > 0 && (
              <div className="border-t border-white/10 pt-6 mb-4">
                <h3 className="font-display text-2xl text-primary uppercase mb-4 flex items-center">
                  <Heart className="w-5 h-5 mr-2" /> Interests &amp; Hobbies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {data.interests.map((interest, i) => (
                    <span
                      key={i}
                      className="bg-surface border border-white/10 px-4 py-2 text-sm text-gray-300 hover:border-primary hover:text-primary transition-all cursor-default"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
