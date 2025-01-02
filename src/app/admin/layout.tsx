import React from 'react';
import nav from './nav';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';


interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div>
             <AppRouterCacheProvider>
            <header>
                {nav()}
              
            </header>
            <main>
                {children}
            </main>
            <footer>
                <p>&copy; 2023 Mindfull Connect. All rights reserved.</p>
            </footer>
            </AppRouterCacheProvider>
        </div>
    );
};

export default Layout;