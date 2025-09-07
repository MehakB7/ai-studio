import React from 'react';
import ThemeButton from '@/components/ui/molecules/themeButton';
import Link from 'next/link';


const Header = () => {
  return (
    <header className="flex items-center justify-between p-4 border-b border-border bg-card/50 backdrop-blur-sm">
      
      <div className="flex items-center space-x-3">
        <Link href="/" data-testid="link-home">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
         ⚡
        </div>
        </Link>
        <div>

          <h1 className="text-lg font-semibold" data-testid="text-app-title">AI Studio</h1>
          <p className="text-xs text-muted-foreground" data-testid="text-app-subtitle">Create amazing visuals with AI</p>
        </div>
      </div>
      <ThemeButton/>
    </header>
  );
};

export default Header;