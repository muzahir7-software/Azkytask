"use client"; // Ensure this is at the top of the file

"use client";

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

interface RouteLoggerProps {
  children: React.ReactNode;
}

const RouteLogger: React.FC<RouteLoggerProps> = ({ children }) => {
  const pathname = usePathname();

  useEffect(() => {
    console.log("Current route (from RouteLogger):", pathname);
  }, [pathname]);

  return <>{children}</>;
};

export default RouteLogger;