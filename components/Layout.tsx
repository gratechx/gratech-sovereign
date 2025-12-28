import React, { useState, useEffect } from 'react';
import { Menu, X, Globe, MessageSquare, LayoutDashboard, Home, Server, Zap, Image, Link as LinkIcon, Share2, Download, Sun, Moon, HardDrive } from 'lucide-react';
import { Language, NavItem, Theme } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentLang: Language;
  onToggleLang: () => void;
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  currentLang,
  onToggleLang,
  currentPage,
  onNavigate
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showInviteToast, setShowInviteToast] = useState(false);
  const [theme, setTheme] = useState<Theme>('dark');

  // Initialize Theme from LocalStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('gratech-theme') as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('gratech-theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const navItems: NavItem[] = [
    { id: 'generator', labelEn: 'Builder', labelAr: 'المصمم', icon: <Zap size={18} /> },
    { id: 'chat', labelEn: 'Chat', labelAr: 'المحادثة', icon: <MessageSquare size={18} /> },
    { id: 'files', labelEn: 'File System', labelAr: 'مدير الملفات', icon: <HardDrive size={18} /> },
    { id: 'home', labelEn: 'Infrastructure', labelAr: 'البنية التحتية', icon: <LayoutDashboard size={18} /> },
    { id: 'images', labelEn: 'Images', labelAr: 'الصور', icon: <Image size={18} /> },
    { id: 'system', labelEn: 'System', labelAr: 'النظام', icon: <Server size={18} /> },
    { id: 'downloads', labelEn: 'Foundry', labelAr: 'المصنع', icon: <Download size={18} /> },
  ];

  const handleInvite = () => {
    navigator.clipboard.writeText('https://gratech.sa');
    setShowInviteToast(true);
    setTimeout(() => setShowInviteToast(false), 2000);
  };

  const dir = currentLang === 'ar' ? 'rtl' : 'ltr';

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-zinc-100 font-sans ${dir} selection:bg-gratech-primary/30 transition-colors duration-300`} dir={dir}>
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-gray-200 dark:border-white/5" role="navigation" aria-label="Main Navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <button 
              className="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-gratech-primary rounded-lg p-1 group" 
              onClick={() => onNavigate('home')}
              aria-label="Go to Homepage"
            >
               <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-zinc-900 flex items-center justify-center border border-gray-300 dark:border-white/10 group-hover:border-gratech-primary/50 transition-colors">
                 <Zap className="text-gratech-primary fill-gratech-primary/20" size={16} />
               </div>
               <span className="font-bold text-xl tracking-tight hidden sm:block bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-zinc-400">GraTech X</span>
            </button>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-4">
              <div className="flex bg-white dark:bg-zinc-900/50 rounded-full p-1 border border-gray-200 dark:border-white/5 backdrop-blur-md shadow-sm">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-gratech-primary ${
                      currentPage === item.id
                        ? 'bg-gray-900 dark:bg-zinc-800 text-white shadow-sm ring-1 ring-white/10'
                        : 'text-gray-500 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                    }`}
                    aria-current={currentPage === item.id ? 'page' : undefined}
                  >
                    {item.icon}
                    {currentLang === 'en' ? item.labelEn : item.labelAr}
                  </button>
                ))}
              </div>

              <div className="h-6 w-px bg-gray-300 dark:bg-white/10"></div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-gray-500 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gratech-primary"
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* Invite Button */}
              <button
                onClick={handleInvite}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors border border-gray-200 dark:border-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-gratech-primary"
                aria-label="Copy Invite Link"
              >
                <Share2 size={16} />
              </button>

              <div className="h-6 w-px bg-gray-300 dark:bg-white/10"></div>

              {/* Language Toggle */}
              <button
                onClick={onToggleLang} // Simplified for now, could be a dropdown
                className="text-gray-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-gratech-primary rounded-lg p-1"
                aria-label="Switch Language"
              >
                <Globe size={18} />
                <span className="text-xs font-mono">{currentLang.toUpperCase()}</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden items-center gap-3">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-500 dark:text-zinc-400 hover:text-black dark:hover:text-white rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-gratech-primary"
                aria-label="Toggle Mobile Menu"
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-zinc-950 border-b border-gray-200 dark:border-white/5 absolute w-full shadow-2xl z-50">
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`block px-4 py-3 rounded-lg text-base font-medium w-full text-start flex items-center gap-3 ${
                    currentPage === item.id
                      ? 'bg-gray-100 dark:bg-zinc-800 text-black dark:text-white'
                      : 'text-gray-500 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-white/5'
                  }`}
                >
                  {item.icon}
                  {currentLang === 'en' ? item.labelEn : item.labelAr}
                </button>
              ))}
               <div className="flex gap-2 px-4 py-2 border-t border-gray-200 dark:border-white/5 mt-2 pt-4">
                 <button
                  onClick={() => {
                     toggleTheme();
                     setIsMobileMenuOpen(false);
                  }}
                  className="flex-1 px-4 py-3 rounded-lg text-base font-medium flex items-center justify-center gap-2 bg-gray-100 dark:bg-zinc-900 text-black dark:text-white"
                >
                  {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                  Theme
                </button>
                 <button
                  onClick={() => {
                     onToggleLang();
                     setIsMobileMenuOpen(false);
                  }}
                  className="flex-1 px-4 py-3 rounded-lg text-base font-medium flex items-center justify-center gap-2 bg-gray-100 dark:bg-zinc-900 text-black dark:text-white"
                >
                  <Globe size={18} />
                  {currentLang.toUpperCase()}
                </button>
               </div>
            </div>
          </div>
        )}
      </nav>
      
      {/* Invite Toast */}
      {showInviteToast && (
         <div className="fixed top-20 right-1/2 translate-x-1/2 z-[60] bg-zinc-800 text-white px-4 py-2 rounded-full shadow-lg border border-white/10 flex items-center gap-2 animate-fade-in">
            <Share2 size={14} />
            <span className="text-sm font-bold">{currentLang === 'en' ? 'Link Copied!' : 'تم نسخ الرابط!'}</span>
         </div>
      )}

      {/* Main Content */}
      <main className="pt-16 min-h-screen bg-[size:20px_20px] bg-subtle-grid">
        {children}
      </main>
    </div>
  );
};

export default Layout;