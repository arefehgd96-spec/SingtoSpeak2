import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  Home, 
  Search, 
  Library, 
  Heart, 
  BookOpen,
  Music2,
  GraduationCap,
  Settings,
  LogOut,
  User,
  Crown
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { base44 } from '@/api/base44Client';
import { useTranslation } from '@/components/TranslationProvider';
import LanguageSwitcher from '@/components/language/LanguageSwitcher';

export default function Sidebar({ currentPage, user }) {
  const { t } = useTranslation();
  
  const navItems = [
    { icon: Home, label: t('home'), page: 'Home' },
    { icon: Search, label: t('explore'), page: 'Explore' },
    { icon: Library, label: t('library'), page: 'Library' },
    { icon: Heart, label: t('favorites'), page: 'Favorites' },
    { icon: GraduationCap, label: t('learningProgress'), page: 'Progress' },
    { icon: BookOpen, label: t('learningPath'), page: 'LearningPath' },
  ];

  const bottomNavItems = [
    { icon: User, label: t('profile'), page: 'Profile' },
    { icon: Crown, label: t('subscription'), page: 'Subscription' },
    { icon: Settings, label: t('settings'), page: 'Settings' },
  ];
  return (
    <aside className="hidden lg:flex flex-col w-64 bg-background border-r border-border h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg">
            <Music2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-foreground font-bold text-xl tracking-tight">Lyrica</h1>
            <p className="text-muted-foreground text-xs">{t('learnWithMusic')}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = currentPage === item.page;
            return (
              <li key={item.page}>
                <Link
                  to={createPageUrl(item.page)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                    isActive 
                      ? "bg-primary/10 text-primary font-medium shadow-sm" 
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <item.icon className={cn("h-5 w-5")} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Language Switcher */}
        <div className="mt-8 px-4">
          <LanguageSwitcher variant="compact" />
        </div>
      </nav>

      {/* Bottom Navigation */}
      <div className="border-t border-border">
        <div className="px-3 py-2">
          {bottomNavItems.map((item) => {
            const isActive = currentPage === item.page;
            return (
              <Link
                key={item.page}
                to={createPageUrl(item.page)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                  isActive 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* User Section */}
        {user && (
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 px-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg">
                <span className="text-white font-medium text-sm">
                  {user.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-foreground text-sm font-medium truncate">
                  {user.full_name || t('learner')}
                </p>
                <p className="text-muted-foreground text-xs truncate">{user.email}</p>
              </div>
              <button 
                onClick={() => base44.auth.logout()}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}