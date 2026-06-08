import { useEffect, useRef, useState } from 'react';
import { Sparkles, Code2 } from 'lucide-react';
import type { Skill } from '../../types';

// AI diagnostic key is intentionally empty (matches original index.html).
const apiKey = '';

export function Skills({ skills }: { skills: Skill[] }) {
  const [showTerminal, setShowTerminal] = useState(false);
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const t = setTimeout(() => {
      barsRef.current.forEach((bar, i) => {
        if (bar) {
          bar.style.transition = 'width 1.5s ease-out';
          bar.style.width = `${skills[i]?.level ?? 0}%`;
        }
      });
    }, 100);
    return () => clearTimeout(t);
  }, [skills]);

  function runDiagnostic() {
    if (!apiKey) {
      alert('Please add your Gemini API Key in the code');
      return;
    }
    setShowTerminal(true);
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-6">
        <h2 className="font-display text-4xl md:text-6xl uppercase">Technical Arsenal</h2>
        <button
          onClick={runDiagnostic}
          className="w-full md:w-auto bg-surface border border-primary/30 hover:border-primary px-6 py-3 flex items-center justify-center space-x-3 group transition-all"
        >
          <Sparkles className="text-primary w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-widest text-gray-300 group-hover:text-primary">
            Run AI Diagnostic
          </span>
        </button>
      </div>

      {showTerminal && (
        <div className="mb-12 bg-black/50 border border-primary/20 p-6 font-mono text-sm text-primary/80 min-h-[100px] relative">
          <div className="absolute top-2 right-2 text-[10px] text-gray-600">PIKANOMWAAN SYSTEM v4.0</div>
          <div className="animate-pulse">SCANNING CORE SYSTEMS...</div>
        </div>
      )}

      {skills.length === 0 ? (
        <div className="bg-surface border border-white/5 p-12 text-center">
          <Code2 className="text-primary/30 w-12 h-12 mx-auto mb-4" />
          <h3 className="font-display text-2xl text-gray-400 mb-2">No Skills</h3>
          <p className="text-gray-600 text-sm">Add skills from the admin panel to display them here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {skills.map((data, index) => (
            <div
              key={index}
              className="bg-surface border border-white/5 p-6 md:p-8 hover:border-primary/50 transition-all duration-300 group"
            >
              <div className="flex justify-between items-start mb-6">
                <Code2 className="text-primary w-8 h-8" />
                <span className="font-display text-2xl opacity-20 group-hover:opacity-100 transition-opacity">
                  {data.level}%
                </span>
              </div>
              <h3 className="font-display text-2xl mb-2">{data.name}</h3>
              <p className="text-gray-500 text-sm mb-4">{data.category}</p>
              <div className="w-full bg-white/5 h-1">
                <div
                  ref={(el) => {
                    barsRef.current[index] = el;
                  }}
                  className="bg-primary h-full"
                  style={{ width: '0%' }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
