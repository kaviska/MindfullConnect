import React from 'react';
import Nav from './nav';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import PatientDetailsForm from './PatientDetailsForm';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div>
            <AppRouterCacheProvider>
                <header>
                    <Nav />
                </header>
                <main>
                    {children}
                    <PatientDetailsForm />  {/* Render as a component, not a function */}
                </main>
                <footer>
                    <p>&copy; 2023 Mindfull Connect. All rights reserved.</p>
                </footer>
            </AppRouterCacheProvider>
        </div>
    );
};

export default Layout;