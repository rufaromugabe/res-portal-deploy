import { useState, useEffect, useCallback } from 'react';
import { Models, ID, Permission, Role } from 'appwrite'; // Import Models, ID, Permission, Role
import { account, databases } from '@/lib/appwrite'; // Import from new appwrite.ts
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

// Ensure these environment variables are set in your .env.local
const APPWRITE_DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'DB_ID_PLACEHOLDER';
const APPWRITE_USERS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID || 'USERS_COLLECTION_ID_PLACEHOLDER';
const ADMIN_TEAM_ID = process.env.NEXT_PUBLIC_APPWRITE_ADMIN_TEAM_ID || 'admins'; // Used for document permissions

type UserRole = 'user' | 'admin' | null;

// Define a more specific type for Appwrite user, if needed, or use Models.User
type AppwriteUser = Models.User<Models.Preferences>;

export function useAuth() {
  const [user, setUser] = useState<AppwriteUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<UserRole>(null);
  const router = useRouter();

  const fetchUserRoleAndData = useCallback(async (loggedInUser: AppwriteUser) => {
    setLoading(true); // Set loading true at the beginning of fetch
    try {
      const userDocument = await databases.getDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_USERS_COLLECTION_ID,
        loggedInUser.$id
      );
      setRole(userDocument.role as UserRole);
      // Optionally, update user state with combined data if needed
      // setUser(prevUser => ({ ...prevUser, ...userDocument }));
    } catch (e: any) {
      // If document not found, create it
      // Appwrite error for document not found is typically e.code === 404 and e.type === 'document_not_found'
      if (e.code === 404 || (e.type && (e.type === 'document_not_found' || e.type === 'database_collection_not_found'))) {
        try {
          const newUserDocumentData = {
            email: loggedInUser.email,
            displayName: loggedInUser.name || '', // Appwrite user object has 'name'
            role: 'user', // Default role
            createdAt: new Date().toISOString(),
            userId: loggedInUser.$id // Store userId explicitly
          };
          const newUserDocument = await databases.createDocument(
            APPWRITE_DATABASE_ID,
            APPWRITE_USERS_COLLECTION_ID,
            loggedInUser.$id, // Use Appwrite user ID as document ID
            newUserDocumentData,
            [ // Document-level permissions
              Permission.read(Role.user(loggedInUser.$id)),
              Permission.update(Role.user(loggedInUser.$id)),
              Permission.delete(Role.user(loggedInUser.$id)),
              Permission.read(Role.team(ADMIN_TEAM_ID)),
              Permission.update(Role.team(ADMIN_TEAM_ID)),
              Permission.delete(Role.team(ADMIN_TEAM_ID)),
            ]
          );
          setRole(newUserDocument.role as UserRole);
          // Optionally, update user state with combined data
          // setUser(prevUser => ({ ...prevUser, ...newUserDocumentData }));
          toast.success('Welcome! Your user profile has been created.');
        } catch (dbError: any) {
          console.error('Error creating user document in Appwrite DB:', dbError);
          toast.error(`Error setting up user account details: ${dbError.message}`);
          setRole(null);
        }
      } else {
        console.error('Error fetching user document from Appwrite DB:', e);
        toast.error(`Error fetching user account details: ${e.message}`);
        setRole(null);
      }
    } finally {
        // setLoading(false); // Loading false moved to checkSession's finally block
    }
  }, [router]); // Removed APPWRITE_DATABASE_ID and APPWRITE_USERS_COLLECTION_ID as they are module-level constants

  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);
      try {
        const loggedInUser = await account.get();
        setUser(loggedInUser);
        await fetchUserRoleAndData(loggedInUser);
      } catch (error: any) {
        setUser(null);
        setRole(null);
        // Avoid toast for common "not logged in" scenarios on initial load
        const unauthorizedCodes = [401]; // Appwrite general unauthorized
        const unauthorizedTypes = ['user_unauthorized', 'general_unauthorized_scope', 'user_jwt_invalid']; // Appwrite specific types
        if (!unauthorizedCodes.includes(error.code) && !unauthorizedTypes.includes(error.type)) {
            // Only log/toast if it's an unexpected error, not just "no session"
            // console.error('No active session or unexpected error during session check:', error);
            // toast.error('Could not verify session.'); // Optional: inform user about unexpected errors
        }
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, [fetchUserRoleAndData]);

  const signIn = async () => {
    try {
      // These URLs must be registered in your Appwrite console OAuth provider settings for Google
      const successUrl = `${window.location.origin}/`; // Or a specific dashboard/callback page
      const failureUrl = `${window.location.origin}/login`; // Or an error page

      await account.createOAuth2Session('google', successUrl, failureUrl);
      // Appwrite handles the redirect. After successful login and redirect back to successUrl,
      // the useEffect hook will run, call account.get(), and then fetchUserRoleAndData.
    } catch (error: any) {
      console.error('Error initiating Google Sign-In (Appwrite):', error);
      toast.error(`Google Sign-In failed: ${error.message}. Ensure redirect URIs are configured in Appwrite.`);
    }
  };

  const signOutUser = async () => {
    setLoading(true);
    try {
      await account.deleteSession('current');
      setUser(null);
      setRole(null);
      router.push('/'); // Navigate to home page after sign out
      toast.success('Successfully signed out');
    } catch (error: any) {
      console.error('Error signing out (Appwrite):', error);
      toast.error(`Sign out failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, role, signIn, signOut: signOutUser };
}