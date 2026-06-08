import { useEffect, useState } from 'react';
import { Portfolio } from './pages/Portfolio';
import { Admin } from './pages/Admin';

function getRoute(): string {
  // Hash-based routing keeps things dependency-free and works on static hosts.
  return window.location.hash.replace(/^#/, '') || '/';
}

export default function App() {
  const [route, setRoute] = useState<string>(getRoute());

  useEffect(() => {
    const onHashChange = () => setRoute(getRoute());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  if (route.startsWith('/admin')) return <Admin />;
  return <Portfolio />;
}
