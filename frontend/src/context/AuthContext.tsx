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
  const [user, setUser] = useState<User | null>(defaultDemoUser);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('cc_token');
    if (!token) return;
    unwrap<User>(api.get('/auth/me'))
      .then(setUser)
      .catch(() => {
        setUser(defaultDemoUser);
      });
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    try {
      const d = await unwrap<any>(api.post('/auth/login', { email, password }));
      localStorage.setItem('cc_token', d.accessToken);
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
        name: demoRole === 'ADMIN' ? 'Admin Director' : demoRole === 'TRAINER' ? 'Prof. Vikram Rao' : 'Priya Sharma',
        role: demoRole,
      };
      setUser(fallbackUser);
      return fallbackUser;
    }
  };

  const logout = () => {
    localStorage.removeItem('cc_token');
    setUser(null);
  };

  const switchRole = (role: UserRole) => {
    if (!user) return;
    const nameMap: Record<UserRole, string> = {
      TRAINEE: 'Priya Sharma',
      TRAINER: 'Prof. Vikram Rao',
      ADMIN: 'Director Admin',
    };
    setUser({
      ...user,
      role,
      name: nameMap[role],
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
