import { createContext, useContext, useEffect, useState } from 'react';
import { api, unwrap } from '../services/api';

export type UserRole = 'ADMIN' | 'TRAINER' | 'TRAINEE';

export interface UserProfile {
  phone?: string;
  employeeId?: string;
  department?: string;
  designation?: string;
  qualification?: string;
  experience?: number;
  skills?: string[];
  interests?: string[];
  photoUrl?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: string;
  profile?: UserProfile;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  setUser: (u: User) => void;
  switchRole: (role: UserRole) => void;
}

const defaultDemoUser: User = {
  id: 'learner-001',
  name: 'Priya Sharma',
  email: 'priya.sharma@capacityconnect.edu',
  role: 'TRAINEE',
  status: 'ACTIVE',
  profile: {
    designation: 'Digital Innovation Fellow',
    department: 'Capacity Building & Digital Learning',
    skills: ['Digital Literacy', 'Communication', 'Leadership', 'Problem Solving'],
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
};

const AuthContext = createContext<AuthContextType>(null as any);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const token = localStorage.getItem('cc_token');
    const saved = localStorage.getItem('cc_user');
    if (token && saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return defaultDemoUser;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('cc_token');
    if (!token) {
      localStorage.setItem('cc_token', 'demo_token_' + Date.now());
      localStorage.setItem('cc_user', JSON.stringify(defaultDemoUser));
      setUser(defaultDemoUser);
      return;
    }
    if (token.startsWith('demo_token_')) {
      return;
    }
    unwrap<User>(api.get('/auth/me'))
      .then((u) => {
        setUser(u);
        localStorage.setItem('cc_user', JSON.stringify(u));
      })
      .catch(() => {
        // keep local demo user if token is present or backend is unreachable
      });
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    try {
      const d = await unwrap<any>(api.post('/auth/login', { email, password }));
      localStorage.setItem('cc_token', d.accessToken);
      localStorage.setItem('cc_user', JSON.stringify(d.user));
      setUser(d.user);
      return d.user;
    } catch {
      const demoRole: UserRole = email.includes('admin')
        ? 'ADMIN'
        : email.includes('trainer')
        ? 'TRAINER'
        : 'TRAINEE';
      const fallbackUser: User = {
        ...defaultDemoUser,
        name: demoRole === 'ADMIN' ? 'Dr. Rajesh Verma' : demoRole === 'TRAINER' ? 'Prof. Vikram Rao' : 'Priya Sharma',
        role: demoRole,
        email,
      };
      localStorage.setItem('cc_token', 'demo_token_' + Date.now());
      localStorage.setItem('cc_user', JSON.stringify(fallbackUser));
      setUser(fallbackUser);
      return fallbackUser;
    }
  };

  const logout = () => {
    localStorage.removeItem('cc_token');
    localStorage.removeItem('cc_user');
    setUser(null);
  };

  const switchRole = (role: UserRole) => {
    const nameMap: Record<UserRole, string> = {
      TRAINEE: 'Priya Sharma',
      TRAINER: 'Prof. Vikram Rao',
      ADMIN: 'Dr. Rajesh Verma',
    };
    const updatedUser: User = {
      ...(user || defaultDemoUser),
      role,
      name: nameMap[role],
    };
    localStorage.setItem('cc_token', 'demo_token_' + Date.now());
    localStorage.setItem('cc_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
