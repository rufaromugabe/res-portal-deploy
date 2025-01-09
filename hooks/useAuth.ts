import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

type UserRole = 'user' | 'admin' | null;

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<UserRole>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        try {
          const userRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const userRole = userSnap.data().role as UserRole;
            setRole(userRole);
          } else {
            await setDoc(userRef, {
              displayName: user.displayName,
              email: user.email,
              role: 'user',
              createdAt: new Date().toISOString(),
            });
            setRole('user');
            toast.success('Welcome to your new account!');
          }
        } catch (error) {
          console.error('Error fetching or creating user:', error);
          setRole(null);
          toast.error('Error setting up user account');
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  const signIn = async () => {
    const provider = new GoogleAuthProvider();
  
    // List of allowed domains
    const allowedDomains = ['hit.ac.zw', 'gmail.com'];
  
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
  
      if (user) {
        // Check if the user's email matches any allowed domain
        if (user.email && allowedDomains.some((domain) => user.email?.endsWith(`@${domain}`) ?? false)) {
          const userRef = doc(db, 'users', user.uid);
          let userRole: UserRole = 'user';
  
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            userRole = userSnap.data().role as UserRole;
          } else {
            await setDoc(userRef, {
              displayName: user.displayName,
              email: user.email,
              role: 'user',
              createdAt: new Date().toISOString(),
            });
            toast.success('Welcome to your new account!');
          }
  
          setRole(userRole);
          if (userRole === 'admin') {
            router.push('/admin');
          } else {
            router.push('/student/profile');
          }
        } else {
          // If the email does not match any allowed domain, sign out and show error
          await signOut(auth);
          toast.error('Sign-in is restricted to specific domains');
        }
      }
    } catch (error) {
      console.error('Error signing in with Google', error);
      toast.error('Failed to sign in with Google');
    }
  };
  
  const signOutUser = async () => {
    try {
      await signOut(auth);
      setRole(null);
      router.push('/');
      toast.success('Successfully signed out');
    } catch (error) {
      console.error('Error signing out', error);
      toast.error('Failed to sign out');
    }
  };

  return { user, loading, role, signIn, signOut: signOutUser };
}
