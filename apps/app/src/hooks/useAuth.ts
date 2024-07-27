import { useState, useEffect } from 'react';
import { supabase } from '../SupabaseClient';
import { Provider, User } from '@supabase/supabase-js';
import useNotifications from './useNotifications';

const useAuth = () => {
  const [user, setUser] = useState(null as any);
  const [jwtToken, setJwtToken] = useState('');
  const showNotification = useNotifications();

  useEffect(() => {
    const getUserAndToken = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error fetching user:', error);
        return;
      }
      setUser(data?.session?.user);
      setJwtToken(data.session?.access_token || '');
    };

    getUserAndToken();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setJwtToken(session?.access_token || '');
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const signInWithEmail = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      console.error('Error signing in:', error);
      showNotification('Error', 'Error signing in', 'error');
    } else {
      showNotification('Check your email', 'We sent you a login link', 'info');
    }
  };

  const signInWithProvider = async (provider: Provider) => {
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) {
      console.error(`Error signing in with ${provider}:`, error);
      showNotification('Error', `Error signing in with ${provider}`, 'error');
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      showNotification('Error', 'Error signing out', 'error');
    } else {
      setUser(null);
      setJwtToken('');
      showNotification('Success', 'Signed out successfully', 'success');
    }
  };

  return {
    user,
    jwtToken,
    signInWithEmail,
    signInWithProvider,
    signOut,
  };
};

export default useAuth;
