import React from 'react';
import Header from '../Header';
import Footer from '../Footer';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, className = '' }) => {
  return (
    <div className={`layout ${className}`}>
      <Header />
      <main className="layout__main" id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;