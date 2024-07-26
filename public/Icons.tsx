// components/icons.tsx
import React from 'react';

export const HomeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12l2-2m0 0L12 3l7 7-7 7-7-7z" />
    <path d="M12 22V12" />
  </svg>
);

export const SettingsIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19.43 12.98a2 2 0 0 0 0-1.96l1.42-2.44a1.5 1.5 0 0 0-1.3-2.26h-3.34a1.5 1.5 0 0 0-1.42-.95L12.7 2.65a1.5 1.5 0 0 0-2.8 0l-.75 3.72a1.5 1.5 0 0 0-1.42.95H4.37a1.5 1.5 0 0 0-1.3 2.26l1.42 2.44a2 2 0 0 0 0 1.96l-1.42 2.44a1.5 1.5 0 0 0 1.3 2.26h3.34a1.5 1.5 0 0 0 1.42.95l.75 3.72a1.5 1.5 0 0 0 2.8 0l.75-3.72a1.5 1.5 0 0 0 1.42-.95h3.34a1.5 1.5 0 0 0 1.3-2.26l-1.42-2.44z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const LogoutIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 17l5-5-5-5M3 12h13" />
  </svg>
);

export const UserIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="7" r="4" />
    <path d="M16 21v-2a4 4 0 0 0-8 0v2" />
  </svg>
);

export const NotificationIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 10a7 7 0 0 0-14 0v5H5l1.55 1.55A2 2 0 0 0 8 18h8a2 2 0 0 0 1.45-.45L19 15h1V10z" />
    <path d="M14 21h-4a2 2 0 0 0 4 0z" />
  </svg>
);
