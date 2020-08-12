import { useEffect, useState } from 'react';

const useAuth = (auth: any): [boolean, any, () => Promise<void>] => {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogout = async () => {
    const isAuthenticated = await auth.isAuthenticated();
    if (isAuthenticated) {
      auth.logout('/');
    } else {
      document.location.href = '/';
    }
  };

  useEffect(() => {
    auth.isAuthenticated().then((isAuthenticated: any) => {
      if (isAuthenticated !== authenticated) {
        setAuthenticated(isAuthenticated);
      }
    });
  });

  useEffect(() => {
    if (authenticated) {
      auth.getUser().then(setUser);
    } else {
      setUser(null);
    }
  }, [auth, authenticated]);

  return [authenticated, user, handleLogout];
};

export default useAuth;
