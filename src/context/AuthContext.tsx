import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  loginWithEmail: (email: string, pass: string, name?: string) => Promise<boolean>;
  signupWithEmail: (email: string, pass: string, name: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  loginAsDemoUser: (persona?: 'founder' | 'student') => void;
  logout: () => void;
  allUsers: User[];
  switchUser: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'daily_discipline_registered_users';
const CURRENT_USER_KEY = 'daily_discipline_active_user_id';

const DEMO_USERS: User[] = [
  {
    id: 'user_alex',
    name: 'Alex Rivera',
    email: 'alex.rivera@discipline.io',
    avatar: 'AR',
    joinedDate: '2026-08-15',
  },
  {
    id: 'user_tariq',
    name: 'Tariq Mansour',
    email: 'tariq.m@discipline.io',
    avatar: 'TM',
    joinedDate: '2026-09-01',
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>(DEMO_USERS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load persisted users
    try {
      const storedUsersRaw = localStorage.getItem(USERS_STORAGE_KEY);
      let usersList = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];
      if (!usersList || usersList.length === 0) {
        usersList = DEMO_USERS;
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEMO_USERS));
      }
      setAllUsers(usersList);

      const activeUserId = localStorage.getItem(CURRENT_USER_KEY);
      if (activeUserId) {
        const found = usersList.find((u: User) => u.id === activeUserId);
        if (found) {
          setUser(found);
        } else {
          setUser(usersList[0]);
          localStorage.setItem(CURRENT_USER_KEY, usersList[0].id);
        }
      } else {
        // Default to first demo user for instant frictionless preview
        setUser(usersList[0]);
        localStorage.setItem(CURRENT_USER_KEY, usersList[0].id);
      }
    } catch {
      setUser(DEMO_USERS[0]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginWithEmail = async (email: string, _pass: string, name?: string): Promise<boolean> => {
    const existing = allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      setUser(existing);
      localStorage.setItem(CURRENT_USER_KEY, existing.id);
      return true;
    }

    // Auto-create if not exists
    const newUser: User = {
      id: `user_${Date.now()}`,
      name: name || email.split('@')[0],
      email: email,
      avatar: (name || email)[0].toUpperCase(),
      joinedDate: new Date().toISOString().split('T')[0],
    };

    const updated = [...allUsers, newUser];
    setAllUsers(updated);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updated));
    setUser(newUser);
    localStorage.setItem(CURRENT_USER_KEY, newUser.id);
    return true;
  };

  const signupWithEmail = async (email: string, _pass: string, name: string): Promise<boolean> => {
    return loginWithEmail(email, _pass, name);
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    // Google OAuth sign-in flow simulation
    const googleUser: User = {
      id: 'user_google_disc',
      name: 'Google User',
      email: 'account@gmail.com',
      avatar: 'G',
      joinedDate: new Date().toISOString().split('T')[0],
    };
    const exists = allUsers.some((u) => u.id === googleUser.id);
    const updated = exists ? allUsers : [...allUsers, googleUser];
    setAllUsers(updated);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updated));
    setUser(googleUser);
    localStorage.setItem(CURRENT_USER_KEY, googleUser.id);
    return true;
  };

  const loginAsDemoUser = (persona: 'founder' | 'student' = 'founder') => {
    const target = persona === 'founder' ? DEMO_USERS[0] : DEMO_USERS[1];
    setUser(target);
    localStorage.setItem(CURRENT_USER_KEY, target.id);
  };

  const switchUser = (userId: string) => {
    const found = allUsers.find((u) => u.id === userId);
    if (found) {
      setUser(found);
      localStorage.setItem(CURRENT_USER_KEY, found.id);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        loginWithEmail,
        signupWithEmail,
        loginWithGoogle,
        loginAsDemoUser,
        logout,
        allUsers,
        switchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
