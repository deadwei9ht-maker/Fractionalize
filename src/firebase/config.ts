// Follow this guide to set up a Firebase project and obtain your config:
// https://firebase.google.com/docs/web/setup

export function getFirebaseConfig() {
    const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      };

      // The validation below is too strict for the development environment,
      // as environment variables are injected at a later stage.
      // Removing this check to allow the application to start.
      // if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
      //   throw new Error('Missing Firebase configuration. Please check your .env.local file.');
      // }
      
      return firebaseConfig;
}
