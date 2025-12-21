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
  app?: FirebaseApp;
  auth?: Auth;
  db?: Firestore;
  firebaseConfig?: FirebaseOptions;
}

export function FirebaseProvider({
  children,
  ...props
}: FirebaseProviderProps) {
  const [app, setApp] = useState<FirebaseApp | null>(props.app ?? null);
  const [auth, setAuth] = useState<Auth | null>(props.auth ?? null);
  const [db, setDb] = useState<Firestore | null>(props.db ?? null);

  useEffect(() => {
    if (typeof window !== 'undefined' && !app && props.firebaseConfig) {
      const firebase = initializeFirebase(props.firebaseConfig);
      setApp(firebase.app);
      setAuth(firebase.auth);
      setDb(firebase.db);
    }
  }, [app, props.firebaseConfig]);

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
