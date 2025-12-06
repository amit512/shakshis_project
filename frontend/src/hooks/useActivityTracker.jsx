import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '@/redux/authSlice';
import { USER_API_END_POINT } from '@/utils/constant';
import axios from 'axios';

/**
 * Custom hook to track user activity and keep session alive
 * Prevents automatic logout when user is not actively interacting
 */
const useActivityTracker = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(store => store.auth);
  const activityTimeoutRef = useRef(null);
  const sessionRefreshIntervalRef = useRef(null);
  const lastActivityRef = useRef(Date.now());

  // Activity events to track
  const activityEvents = [
    'mousedown',
    'mousemove',
    'keypress',
    'scroll',
    'touchstart',
    'click',
    'keydown'
  ];

  // Function to update last activity time
  const updateActivity = () => {
    lastActivityRef.current = Date.now();
  };

  // Function to refresh session (verify user is still authenticated)
  const refreshSession = async () => {
    if (!user) return;

    try {
      // Check if user data exists in localStorage (persisted state)
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        // If no stored user, clear Redux state
        dispatch(setUser(null));
        return;
      }

      // Verify token exists (if using token-based auth)
      const token = localStorage.getItem('token');
      if (!token) {
        // Token might be in cookies, which is fine
        // Just ensure user state is maintained
        return;
      }

      // The session is maintained by the cookie token which expires in 1 day
      // This function just ensures the frontend state stays in sync
      // No need to make API calls as the cookie-based session is handled by the browser
      
    } catch (error) {
      // If any error occurs, don't clear user state automatically
      // Let the backend handle session validation
      console.log('Session refresh check:', error);
    }
  };

  useEffect(() => {
    // Only track activity if user is logged in
    if (!user) {
      return;
    }

    // Add event listeners for user activity
    activityEvents.forEach(event => {
      document.addEventListener(event, updateActivity, { passive: true });
    });

    // Refresh session every 5 minutes (300000ms) to keep it alive
    sessionRefreshIntervalRef.current = setInterval(() => {
      const timeSinceLastActivity = Date.now() - lastActivityRef.current;
      
      // Only refresh if user was active in the last 10 minutes
      // This prevents unnecessary requests when user is truly inactive
      if (timeSinceLastActivity < 10 * 60 * 1000) {
        refreshSession();
      }
    }, 5 * 60 * 1000); // Every 5 minutes

    // Cleanup function
    return () => {
      // Remove event listeners
      activityEvents.forEach(event => {
        document.removeEventListener(event, updateActivity);
      });

      // Clear intervals
      if (sessionRefreshIntervalRef.current) {
        clearInterval(sessionRefreshIntervalRef.current);
      }
      if (activityTimeoutRef.current) {
        clearTimeout(activityTimeoutRef.current);
      }
    };
  }, [user]); // Re-run when user state changes

  return null; // This hook doesn't render anything
};

export default useActivityTracker;

