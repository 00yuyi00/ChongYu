import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
  bio?: string;
}

interface AuthContextType {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. 初始化时获取 session
    const initSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (session?.user) {
          await handleSessionUser(session.user);
        } else {
          setIsLoading(false);
        }
      } catch (err) {
        console.warn('Get session failed, skipping auth initialization', err);
        setIsLoading(false);
      }
    };

    // 设置一个终极降级定时器：如果超过了3秒 SDK 还没有响应，强制解锁 UI
    const fallbackTimer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    initSession().finally(() => {
      clearTimeout(fallbackTimer);
    });

    // 2. 监听 Auth 变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await handleSessionUser(session.user);
        } else {
          setUser(null);
          setSupabaseUser(null);
          setIsLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSessionUser = async (auth_user: SupabaseUser) => {
    setSupabaseUser(auth_user);
    try {
      // 尝试获取 profile 信息
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', auth_user.id)
        .single();

      if (error) {
        console.warn("Table profiles not found or other error, fetching default metadata:", error);
        // 走后备方案
        setUser({
          id: auth_user.id,
          email: auth_user.email || '',
          name: auth_user.user_metadata?.name || auth_user.email?.split('@')[0] || 'User',
          avatar: auth_user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${auth_user.email?.split('@')[0] || 'U'}&background=random`,
        });
      } else {
        setUser({
          id: auth_user.id,
          email: auth_user.email || '',
          name: profile?.name || auth_user.user_metadata?.name || auth_user.email?.split('@')[0] || 'User',
          avatar: profile?.avatar_url || auth_user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${auth_user.email?.split('@')[0] || 'U'}&background=random`,
          bio: profile?.bio || '热爱生活，热爱宠物。',
        });
      }
    } catch (e) {
      console.error('Error fetching profile system crash:', e);
      // 后备方案
      setUser({
        id: auth_user.id,
        email: auth_user.email || '',
        name: auth_user.user_metadata?.name || auth_user.email?.split('@')[0] || 'User',
        avatar: auth_user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${auth_user.email?.split('@')[0] || 'U'}&background=random`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSupabaseUser(null);
  };

  // 避免在判断登录态时发生白屏闪烁
  if (isLoading) {
    return <div className="h-screen w-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-900"><div className="w-8 h-8 rounded-full border-4 border-amber-500 border-t-transparent animate-spin"></div></div>;
  }

  return (
    <AuthContext.Provider value={{ user, supabaseUser, isAuthenticated: !!user, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
