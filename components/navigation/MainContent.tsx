import React from 'react';

/**
 * Renders the main content of the application.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {React.ReactNode} props.children - The content to be rendered inside the main container.
 * @return {JSX.Element} The main container with the provided children.
 */
const MainContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <main className='flex-grow p-4'>{children}</main>;
};

export default MainContent;
