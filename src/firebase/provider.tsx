
'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { type FirebaseApp, type FirebaseOptions, getApps, getApp, initializeApp } from 'firebase/app';
import { type Auth, getAuth } from 'firebase/auth';
import { type Firestore, getFirestore } from 'firebase/firestore';

export interface FirebaseContextValue {
  app: FirebaseApp | null;
  auth: Auth | null;
  db: Firestore | null;
}

export const FirebaseContext = createContext<FirebaseContextValue>({
  app: null,
  auth: null,
  db: null,
});

export interface FirebaseProviderProps {
  children: React.ReactNode;
  firebaseConfig: FirebaseOptions;
}

export function FirebaseProvider({
  children,
  firebaseConfig
}: FirebaseProviderProps) {
  const [app, setApp] = useState<FirebaseApp | null>(null);
  const [auth, setAuth] = useState<Auth | null>(null);
  const [db, setDb] = useState<Firestore | null>(null);

  useEffect(() => {
    // This effect ensures Firebase is initialized only on the client side.
    if (firebaseConfig?.apiKey) {
      const initializedApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
      setApp(initializedApp);
      setAuth(getAuth(initializedApp));
      setDb(getFirestore(initializedApp));
    }
  }, [firebaseConfig]);

  const value = useMemo(
    () => ({
      app,
      auth,
      db,
    }),
    [app, auth, db]
  );

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
}

export function useFirebaseApp() {
  return useFirebase().app;
}

export function useAuth() {
  return useFirebase().auth;
}

export function useFirestore() {
  return useFirebase().db;
}
