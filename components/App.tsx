import React, { useState, Suspense, lazy, useCallback, useEffect, ReactNode, Component, ErrorInfo } from 'react';
import Layout from './Layout';
import { Language } from '../types';
import LoadingScreen from './LoadingScreen';
import GraTechLandingPage from './GraTechLandingPage';

// 1. Definition of lazy load factories for preloading
const componentFactories = {
  overview: () => import('./Overview'),
  generator: () => import('./CodeGenerator'),
  chat: () => import('./AIChat'),
  images: () => import('./ImageGen'),
  dashboard: () => import('./Compute'),
  downloads: () => import('./DownloadsHub'),
  system: () => Promise.all([
    import('./AIServices'),
    import('./NetworkStorage')
  ]),
  resources: () => import('./ResourceGroups'),
  files: () => import('./FileManager')
};

// 2. Lazy components
const Overview = lazy(componentFactories.overview);
const CodeGenerator = lazy(componentFactories.generator);
const AIChat = lazy(componentFactories.chat);
const ImageGen = lazy(componentFactories.images);
const Compute = lazy(componentFactories.dashboard);
const DownloadsHub = lazy(componentFactories.downloads);
const AIServices = lazy(() => import('./AIServices'));
const NetworkStorage = lazy(() => import('./NetworkStorage'));
const ResourceGroups = lazy(componentFactories.resources);
const FileManager = lazy(componentFactories.files);

// 3. Error Boundary Component
interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) { 
    console.error("GraTech System Fault:", error, errorInfo); 
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-red-500 p-10 bg-zinc-900/50 rounded-2xl border border-red-900/30 m-4">
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2">⚠️ System Anomaly Detected</h2>
          <p className="text-zinc-500 mb-6 text-sm">The kernel encountered a critical rendering fault.</p>
          <button 
            onClick={() => { this.setState({ hasError: false }); window.location.reload(); }} 
            className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-all shadow-lg shadow-red-900/20 font-mono text-sm"
          >
            REBOOT_SYSTEM()
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const App: React.FC = () => {
  const [showLanding, setShowLanding] = useState(true);
  const [currentPage, setCurrentPage] = useState('generator');
  const [lang, setLang] = useState<Language>('en');
  const [isNavigating, setIsNavigating] = useState(false);

  // 4. Preload capability
  const preloadPage = (pageKey: keyof typeof componentFactories) => {
    const factory = componentFactories[pageKey];
    if (factory) {
      factory(); // This triggers the import
    }
  };

  useEffect(() => {
    // Initial preload of critical components
    preloadPage('chat');
    preloadPage('overview');
  }, []);

  const handleToggleLang = useCallback(() => {
    setLang(prev => prev === 'en' ? 'ar' : 'en');
  }, []);

  const handleNavigate = useCallback((page: string) => {
    if (page === currentPage) return;
    
    // Start transition
    setIsNavigating(true);
    
    // Preload target
    if (page in componentFactories) {
      preloadPage(page as keyof typeof componentFactories);
    }

    // Smooth transition delay
    setTimeout(() => {
      setCurrentPage(page);
      setIsNavigating(false);
      window.scrollTo(0, 0);
    }, 150); 
  }, [currentPage]);

  const renderContent = () => {
    switch (currentPage) {
      case 'home': return <Overview />;
      case 'generator': return <div className="p-4 h-full"><CodeGenerator /></div>;
      case 'chat': return <div className="p-4 md:p-8 max-w-7xl mx-auto h-full"><AIChat mode="full" lang={lang} apiKey={process.env.API_KEY} /></div>;
      case 'images': return <ImageGen lang={lang} />;
      case 'dashboard': return <div className="p-4 md:p-8 max-w-7xl mx-auto"><Compute /></div>;
      case 'downloads': return <DownloadsHub />;
      case 'system': return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
          <AIServices />
          <NetworkStorage />
        </div>
      );
      case 'resources': return <div className="p-4 md:p-8 max-w-7xl mx-auto"><ResourceGroups /></div>;
      case 'files': return <div className="p-4 md:p-8 max-w-7xl mx-auto h-full"><FileManager /></div>; // New Route
      default: return <Overview />;
    }
  };

  if (showLanding) {
    return (
      <ErrorBoundary>
        <GraTechLandingPage 
          onEnterApp={() => setShowLanding(false)} 
          onNavigate={handleNavigate}
        />
      </ErrorBoundary>
    );
  }

  return (
    <Layout 
      currentLang={lang} 
      onToggleLang={handleToggleLang}
      currentPage={currentPage}
      onNavigate={handleNavigate}
    >
      <div className={`h-full relative transition-opacity duration-300 ${isNavigating ? 'opacity-50' : 'opacity-100'}`}>
        <ErrorBoundary>
          <Suspense fallback={<LoadingScreen message={`BOOTING ${currentPage.toUpperCase()}...`} />}>
            {renderContent()}
          </Suspense>
        </ErrorBoundary>
      </div>
      
      {/* Global AI Assistant Popup (optimized to not mount if on chat page) */}
      {!['chat', 'generator'].includes(currentPage) && (
        <Suspense fallback={null}>
          <div className="fixed bottom-4 right-4 z-50">
             <AIChat 
                apiKey={process.env.API_KEY} 
                mode="popup" 
                lang={lang} 
                onOpen={() => handleNavigate('chat')} 
              />
          </div>
        </Suspense>
      )}
    </Layout>
  );
};

export default React.memo(App);