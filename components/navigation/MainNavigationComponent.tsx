// components/navigation/MainNavigation.tsx
import React from 'react';
import Link from 'next/link';
import { UserIcon, HomeIcon, SettingsIcon, LogoutIcon, NotificationIcon } from '@/public/Icons';

/**
 * Renders the main navigation component with links to different pages and icons for notifications, user profile, and logout.
 *
 * @return {ReactElement} The main navigation component.
 */
export const MainNavigation: React.FC = () => {
  return (
    <nav className="flex justify-between items-center p-4 bg-gradient-to-r from-primary to-secondary shadow-3d-dark">
      <div className="flex items-center gap-4">
        <Link href="/" passHref>
          <a className="text-2xl font-bold text-primary-foreground transform hover:scale-105 transition-transform duration-300">
            MyApp
          </a>
        </Link>
        <div className="hidden md:flex gap-4 text-primary-foreground">
          <Link href="/dashboard" passHref>
            <a className="flex items-center gap-2 transform hover:scale-110 transition-transform duration-300">
              <HomeIcon className="w-5 h-5" />
              <span>Dashboard</span>
            </a>
          </Link>
          <Link href="/settings" passHref>
            <a className="flex items-center gap-2 transform hover:scale-110 transition-transform duration-300">
              <SettingsIcon className="w-5 h-5" />
              <span>Settings</span>
            </a>
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <NotificationIcon className="w-6 h-6 text-primary-foreground cursor-pointer transform hover:scale-125 transition-transform duration-300" />
        <UserIcon className="w-8 h-8 rounded-full border-2 border-primary-foreground cursor-pointer transform hover:scale-125 transition-transform duration-300" />
        <Link href="/logout" passHref>
          <a className="flex items-center gap-2 transform hover:scale-110 transition-transform duration-300 text-primary-foreground">
            <LogoutIcon className="w-5 h-5" />
            <span>Logout</span>
          </a>
        </Link>
      </div>
    </nav>
  );
};
