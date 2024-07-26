import React from 'react';

const MainContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <main className="flex-grow p-4">{children}</main>;
};

export default MainContent;
