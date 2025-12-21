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
    if (typeof window !== 'undefined' && !app && firebaseConfig?.apiKey) {
      const existingApp = getApps().length ? getApp() : null;
      if (existingApp) {
        setApp(existingApp);
        setAuth(getAuth(existingApp));
        setDb(getFirestore(existingApp));
      } else {
        const newApp = initializeApp(firebaseConfig);
        setApp(newApp);
        setAuth(getAuth(newApp));
        setDb(getFirestore(newApp));
      }
    }
  }, [app, firebaseConfig]);

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
  return useContext(FirebaseContext);
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
