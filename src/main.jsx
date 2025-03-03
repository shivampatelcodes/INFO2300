import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "./firebaseConfig";
import App from './App.jsx';

const auth = getAuth(app);

const Root = () => {
  const [loading, setLoading] = useState(true);
  const [, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <StrictMode>
      <App />
    </StrictMode>
  );
};

createRoot(document.getElementById('root')).render(<Root />);
