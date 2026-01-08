
import { getApp, getApps, initializeApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

// Export hooks from their source files to avoid circular dependencies
export {
  useFirebase,
  useFirebaseApp,
  useAuth,
  useFirestore,
  FirebaseProvider,
} from './provider';
export { useUser } from './auth/use-user';
export { useCollection } from './firestore/use-collection';
export { useDoc } from './firestore/use-doc';


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
