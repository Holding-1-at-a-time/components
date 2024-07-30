import React, { ReactElement } from 'react';

const layout = ({ children }: { children: React.ReactNode }): ReactElement => {
  return (
    <div>
      {children}
    </div>
  );
};

export default layout;