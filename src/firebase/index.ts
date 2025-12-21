import { getApp, getApps, initializeApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

export function initializeFirebase(config: FirebaseOptions): {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
} {
  const app = getApps().length ? getApp() : initializeApp(config);
  const auth = getAuth(app);
  const db = getFirestore(app);

  return { app, auth, db };
}

export {
  useUser,
  useCollection,
  useDoc,
  useFirebase,
  useFirebaseApp,
  useAuth,
  useFirestore,
  FirebaseProvider,
};

import {
  useFirebase,
  useFirebaseApp,
  useAuth,
  useFirestore,
  FirebaseProvider,
} from './provider';
import { useUser } from './auth/use-user';
import { useCollection } from './firestore/use-collection';
import { useDoc } from './firestore/use-doc';
