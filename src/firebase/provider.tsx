'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { type FirebaseApp, type FirebaseOptions } from 'firebase/app';
import { type Auth } from 'firebase/auth';
import { type Firestore } from 'firebase/firestore';

import { initializeFirebase } from '.';

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
    if (typeof window !== 'undefined' && !app && firebaseConfig) {
      const firebase = initializeFirebase(firebaseConfig);
      setApp(firebase.app);
      setAuth(firebase.auth);
      setDb(firebase.db);
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
