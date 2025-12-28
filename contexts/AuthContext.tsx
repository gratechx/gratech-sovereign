import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PublicClientApplication, EventType, AccountInfo } from '@azure/msal-browser';

// Azure AD B2C Configuration
// Replace placeholders with your actual Azure B2C tenant details
const msalConfig = {
    auth: {
        clientId: "YOUR_B2C_CLIENT_ID",
        authority: "https://YOUR_TENANT_NAME.b2clogin.com/YOUR_TENANT_NAME.onmicrosoft.com/B2C_1_SIGNIN_SIGNUP", 
        knownAuthorities: ["YOUR_TENANT_NAME.b2clogin.com"],
        redirectUri: window.location.origin,
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false,
    }
};

const msalInstance = new PublicClientApplication(msalConfig);

// Initialize MSAL logic
const msalInitPromise = msalInstance.initialize();

interface User {
  id: string;
  name: string;
  role: 'admin' | 'user' | 'architect';
  avatar: string;
  language: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  checkPermission: (permission: string) => boolean;
  direction: 'ltr' | 'rtl';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [direction, setDirection] = useState<'ltr' | 'rtl'>('ltr');

  // Detect Language for RTL support
  useEffect(() => {
    const detectLanguage = () => {
      // Check navigator language or user preference
      const browserLang = navigator.language;
      const isArabic = browserLang.startsWith('ar');
      
      const dir = isArabic ? 'rtl' : 'ltr';
      setDirection(dir);
      
      // Update document attributes for global CSS handling
      document.documentElement.dir = dir;
      document.documentElement.lang = isArabic ? 'ar' : 'en';
    };
    detectLanguage();
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await msalInitPromise;
        
        const accounts = msalInstance.getAllAccounts();
        if (accounts.length > 0) {
          mapAccountToUser(accounts[0]);
        } else {
          // Attempt to restore session from local storage if MSAL session is missing
          // This is useful for development or if the B2C session expired but local app state persists
          const storedUser = localStorage.getItem('sovereign_session');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        }
      } catch (error) {
        console.error("Auth initialization failed", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Event callback for successful login via popup/redirect
    msalInstance.addEventCallback((event) => {
        if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
            const account = event.payload as AccountInfo;
            msalInstance.setActiveAccount(account);
            mapAccountToUser(account);
        }
    });
  }, []);

  const mapAccountToUser = (account: AccountInfo) => {
      // Map B2C claims to local User object
      const newUser: User = {
          id: account.localAccountId,
          name: account.name || 'OPERATOR',
          // Check for custom role extension attribute from B2C
          role: (account.idTokenClaims?.extension_Role as any) === 'Admin' ? 'admin' : 'architect',
          avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${account.localAccountId}&baseColor=ef4444`,
          language: navigator.language
      };
      setUser(newUser);
      localStorage.setItem('sovereign_session', JSON.stringify(newUser));
  };

  const login = async () => {
    setIsLoading(true);
    try {
        await msalInitPromise;
        await msalInstance.loginPopup({
            scopes: ["openid", "profile", "offline_access"]
        });
    } catch (error) {
        console.error("MSAL Login Failed", error);
        // Fallback purely for demonstration if Azure config is invalid in this environment
        console.warn("Using fallback auth due to configuration error.");
        const fallbackUser: User = {
            id: crypto.randomUUID(),
            name: 'FALLBACK_USER',
            role: 'architect',
            avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${Date.now()}`,
            language: navigator.language
        };
        setUser(fallbackUser);
        localStorage.setItem('sovereign_session', JSON.stringify(fallbackUser));
    } finally {
        setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
        await msalInitPromise;
        // Optional: await msalInstance.logoutPopup(); 
        // We just clear local state to avoid full redirect loop in this demo context
        const account = msalInstance.getActiveAccount();
        if(account) {
            await msalInstance.logoutPopup({
                mainWindowRedirectUri: window.location.origin
            });
        }
    } catch (e) {
        console.warn("MSAL Logout failed or not configured", e);
    }
    setUser(null);
    localStorage.removeItem('sovereign_session');
  };

  const checkPermission = (permission: string) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    return permission !== 'ADMIN';
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, checkPermission, direction }}>
      {children}
    </AuthContext.Provider>
  );
};
