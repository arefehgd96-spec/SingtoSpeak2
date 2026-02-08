import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import Sidebar from '@/components/navigation/Sidebar';
import MobileNav from '@/components/navigation/MobileNav';
import { TranslationProvider } from '@/components/TranslationProvider';
import { ThemeProvider } from '@/components/ThemeProvider';
import OfflineIndicator from '@/components/offline/OfflineIndicator';

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await base44.auth.me();
        setUser(userData);
      } catch (e) {
        // User not logged in
      }
    };
    loadUser();
  }, []);

  // Pages that don't need layout (full screen)
  const fullScreenPages = ['Player'];
  const isFullScreen = fullScreenPages.includes(currentPageName);

  if (isFullScreen) {
    return (
      <ThemeProvider>
        <TranslationProvider>
          <div className="min-h-screen bg-background">
            <OfflineIndicator />
            {children}
          </div>
        </TranslationProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
    <TranslationProvider>
    <div className="min-h-screen bg-background flex">
      <OfflineIndicator />
      <style>{`
        /* Typography System */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700&display=swap');

        :root {
          /* Latin fonts (English, German) */
          --font-latin: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          /* RTL fonts (Persian, Arabic) */
          --font-rtl: 'Vazirmatn', 'Tahoma', 'Arial', sans-serif;
        }

        /* Apply fonts based on direction */
        body,
        html {
          font-family: var(--font-latin);
        }

        html[dir="rtl"],
        html[dir="rtl"] body,
        html[dir="rtl"] * {
          font-family: var(--font-rtl) !important;
        }

        /* RTL-specific adjustments */
        html[dir="rtl"] {
          text-align: right;
        }

        /* Fix number rendering in RTL */
        html[dir="rtl"] .ltr-numbers {
          direction: ltr;
          display: inline-block;
        }

        /* Logical properties for RTL support */
        html[dir="rtl"] .text-left {
          text-align: right;
        }

        html[dir="rtl"] .text-right {
          text-align: left;
        }


        :root.dark {
          --background: 0 0% 4%;
          --foreground: 0 0% 98%;
          --card: 0 0% 7%;
          --card-foreground: 0 0% 98%;
          --popover: 0 0% 7%;
          --popover-foreground: 0 0% 98%;
          --primary: 0 0% 98%;
          --primary-foreground: 0 0% 9%;
          --secondary: 0 0% 15%;
          --secondary-foreground: 0 0% 98%;
          --muted: 0 0% 15%;
          --muted-foreground: 0 0% 64%;
          --accent: 0 0% 15%;
          --accent-foreground: 0 0% 98%;
          --destructive: 0 62% 30%;
          --destructive-foreground: 0 0% 98%;
          --border: 0 0% 15%;
          --input: 0 0% 15%;
          --ring: 0 0% 98%;
        }

        :root.light {
          --background: 0 0% 25%;
          --foreground: 0 0% 95%;
          --card: 0 0% 30%;
          --card-foreground: 0 0% 95%;
          --popover: 0 0% 30%;
          --popover-foreground: 0 0% 95%;
          --primary: 158 64% 52%;
          --primary-foreground: 0 0% 100%;
          --secondary: 0 0% 35%;
          --secondary-foreground: 0 0% 95%;
          --muted: 0 0% 40%;
          --muted-foreground: 0 0% 70%;
          --accent: 0 0% 35%;
          --accent-foreground: 158 64% 60%;
          --destructive: 0 84% 60%;
          --destructive-foreground: 0 0% 98%;
          --border: 0 0% 45%;
          --input: 0 0% 35%;
          --ring: 158 64% 52%;
        }

        body {
          background-color: hsl(var(--background));
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        :root.dark ::-webkit-scrollbar-thumb {
          background: rgb(63, 63, 70);
          border-radius: 4px;
        }
        :root.dark ::-webkit-scrollbar-thumb:hover {
          background: rgb(82, 82, 91);
        }
        :root.light ::-webkit-scrollbar-thumb {
          background: hsl(45, 30%, 75%);
          border-radius: 4px;
        }
        :root.light ::-webkit-scrollbar-thumb:hover {
          background: hsl(45, 30%, 65%);
        }

        /* Safe area for mobile */
        .pb-safe {
          padding-bottom: env(safe-area-inset-bottom, 0);
        }
      `}</style>

      <Sidebar currentPage={currentPageName} user={user} />
      
      <main className="flex-1 min-h-screen pb-24 lg:pb-0">
        {children}
      </main>

      <MobileNav currentPage={currentPageName} />
    </div>
    </TranslationProvider>
    </ThemeProvider>
  );
}