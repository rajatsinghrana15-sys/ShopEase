import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const RouterContext = createContext(null);
export function RouterProvider({ children }) {
  const readLocation = () => window.location.pathname + window.location.search;
  const [pathname, setPathname] = useState(readLocation);
  useEffect(() => {
    const onPopState = () => setPathname(readLocation());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);
  const navigate = path => {
    if (path !== window.location.pathname + window.location.search + window.location.hash) window.history.pushState({}, '', path);
    setPathname(readLocation());
    const hash = new URL(path, window.location.origin).hash.slice(1);
    if (hash) requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView());
    else window.scrollTo({ top: 0, behavior: 'auto' });
  };
  const value = useMemo(() => ({ pathname, navigate }), [pathname]);
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}
export const useRouter = () => useContext(RouterContext);
export function Link({ to, onClick, children, ...props }) {
  const { navigate } = useRouter();
  return <a href={to} {...props} onClick={event => {
    onClick?.(event);
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault(); navigate(to);
  }}>{children}</a>;
}
