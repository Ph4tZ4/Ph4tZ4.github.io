import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Menu, ArrowUp } from 'lucide-react';
import { CustomCursor } from '../components/CustomCursor';
import { getPortfolio } from '../lib/api';
import { emptyPortfolio, type Portfolio as PortfolioData, type PageId } from '../types';
import { Home } from './sections/Home';
import { About } from './sections/About';
import { Skills } from './sections/Skills';
import { Projects } from './sections/Projects';
import { Certificates } from './sections/Certificates';
import { Contact } from './sections/Contact';

const NAV_LINKS: { id: PageId; label: string }[] = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'certificates', label: 'Certificates' },
  { id: 'contact', label: 'Contact' },
];

export function Portfolio() {
  const [data, setData] = useState<PortfolioData>(emptyPortfolio);
  const [page, setPage] = useState<PageId>('home');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showScroll, setShowScroll] = useState(false);

  const appRef = useRef<HTMLElement>(null);
  const transitionRef = useRef<HTMLDivElement>(null);
  const animating = useRef(false);

  // Secret admin access (5 logo clicks within 2s).
  const logoClicks = useRef(0);
  const logoTimer = useRef<number | null>(null);

  useEffect(() => {
    getPortfolio()
      .then((d) =>
        setData({ ...emptyPortfolio, ...d, about: { ...emptyPortfolio.about, ...d.about } }),
      )
      .catch((e) => console.error('Failed to load portfolio:', e));
  }, []);

  useEffect(() => {
    const onScroll = () => setShowScroll(window.scrollY > 300);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function navigate(next: PageId) {
    setMobileOpen(false);
    if (animating.current || next === page) return;
    const appDiv = appRef.current;
    const transition = transitionRef.current;
    if (!appDiv || !transition) {
      setPage(next);
      return;
    }
    animating.current = true;
    gsap.to(appDiv, { opacity: 0, y: -50, duration: 0.3 });
    const tl = gsap.timeline({ onComplete: () => (animating.current = false) });
    tl.to(transition, { transformOrigin: 'bottom', scaleY: 1, duration: 0.4, ease: 'power2.inOut' })
      .add(() => {
        setPage(next);
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
      })
      .to(transition, { transformOrigin: 'top', scaleY: 0, duration: 0.4, ease: 'power2.inOut', delay: 0.1 })
      .to(appDiv, { opacity: 1, y: 0, duration: 0.5 });
  }

  function handleLogoClick() {
    logoClicks.current += 1;
    if (logoClicks.current === 1) {
      logoTimer.current = window.setTimeout(() => {
        logoClicks.current = 0;
      }, 2000);
    }
    if (logoClicks.current === 5) {
      if (logoTimer.current) clearTimeout(logoTimer.current);
      logoClicks.current = 0;
      sessionStorage.setItem('admin_secret_access', 'true');
      window.location.hash = '#/admin';
    } else {
      navigate('home');
    }
  }

  function renderPage() {
    switch (page) {
      case 'home':
        return <Home navigate={navigate} />;
      case 'about':
        return <About data={data.about} />;
      case 'skills':
        return <Skills skills={data.skills} />;
      case 'projects':
        return <Projects projects={data.projects} />;
      case 'certificates':
        return <Certificates certificates={data.certificates} />;
      case 'contact':
        return <Contact />;
    }
  }

  return (
    <>
      {/* Transition Overlay */}
      <div className="page-transition-layer" ref={transitionRef} />

      {/* Noise */}
      <div className="noise-overlay" />

      {/* Cursor */}
      <CustomCursor />

      {/* Scroll To Top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-8 right-8 z-50 p-3 bg-primary text-black rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
          showScroll ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-10'
        }`}
      >
        <ArrowUp className="w-6 h-6" />
      </button>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 px-4 md:px-6 py-4 flex justify-between items-center bg-black/50 backdrop-blur-md text-white shadow-[0_10px_30px_rgba(0,0,0,0.9)] transition-all duration-300">
        <div
          className="font-display font-bold text-xl md:text-2xl tracking-tighter text-primary cursor-pointer"
          onClick={handleLogoClick}
        >
          PIKANOMWAAN<span className="text-white">.CODE</span>
        </div>

        <div className="hidden md:flex space-x-8 lg:space-x-12 font-body text-xs lg:text-sm tracking-widest uppercase">
          {NAV_LINKS.map((l) => (
            <button key={l.id} onClick={() => navigate(l.id)} className="hover:text-primary transition-colors relative group">
              {l.label}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all group-hover:w-full" />
            </button>
          ))}
        </div>

        <button className="md:hidden text-white" onClick={() => setMobileOpen((v) => !v)}>
          <Menu />
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-black z-40 flex flex-col items-center justify-center space-y-8 transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {NAV_LINKS.map((l) => (
          <button key={l.id} onClick={() => navigate(l.id)} className="text-3xl font-display hover:text-primary">
            {l.label}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <main ref={appRef} className="relative z-10 min-h-screen pt-20 md:pt-24 px-4 md:px-12 lg:px-24 pb-24">
        {renderPage()}
      </main>
    </>
  );
}
