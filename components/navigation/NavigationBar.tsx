// components/navigation/NavigationBarComponent.tsx
import React from 'react';
import Link from 'next/link';
import { UserButton, useUser } from '@clerk/nextjs';
import HomeIcon from '/public/icons/home.svg';
import SettingsIcon from '/public/icons/settings.svg';

/**
 * Renders a navigation bar component.
 *
 * This component is a wrapper around the Clerk `UserButton` component.
 *
 * The component renders a navigation bar with links to the home page and the
 * settings page. If the user is signed in, it renders a "Sign Out" button. If
 * the user is not signed in, it renders a "Sign In" button.
 *
 * The component uses the Clerk `useUser` hook to determine if the user is
 * signed in or not. The hook returns an object with the following properties:
 *
 *   - `isLoaded`: A boolean indicating whether the user's sign-in status has
 *     been loaded.
 *   - `isSignedIn`: A boolean indicating whether the user is signed in or not.
 *   - `user`: The user's profile information if the user is signed in.
 *
 * @return {ReactElement} The navigation bar component.
 */
const NavigationBar: React.FC = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  console.log("isLoaded:", isLoaded);
  console.log("isSignedIn:", isSignedIn);
  console.log("user:", user);

  return (
    <nav className="flex items-center justify-between p-4 bg-gradient-to-r from-primary to-primary-light shadow-lg">
      <div className="flex items-center space-x-4">
        <Link href="/" className="flex items-center space-x-2 text-white">
          <HomeIcon className="w-6 h-6" />
          <span>Home</span>
        </Link>
        <Link href="/settings" className="flex items-center space-x-2 text-white">
          <SettingsIcon className="w-6 h-6" />
          <span>Settings</span>
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        {isLoaded && isSignedIn ? (
          <UserButton />
        ) : (
          <Link href="/sign-in" className="text-white">
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default NavigationBar;
