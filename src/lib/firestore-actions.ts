
'use server';

import { addDoc, collection, type Firestore } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import {
  FirestorePermissionError,
  type SecurityRuleContext,
} from '@/firebase/errors';

type FractionalizedNftData = {
  userId: string;
  nftContract: string;
  tokenId: string;
  createdAt: string;
  shareAmount: number;
};

export async function saveFractionalizedNft(
  db: Firestore,
  data: FractionalizedNftData
) {
  const collectionRef = collection(db, 'fractionalizedNfts');
  
  // Use .catch() for error handling to work with the custom error emitter
  // This avoids a try/catch block and uses the centralized error handling system.
  return addDoc(collectionRef, data).catch(async (serverError) => {
    const permissionError = new FirestorePermissionError({
      path: collectionRef.path,
      operation: 'create',
      requestResourceData: data,
    } satisfies SecurityRuleContext);

    // Emit the error so the FirebaseErrorListener can display it as a toast.
    errorEmitter.emit('permission-error', permissionError);

    // Re-throw the original error to allow the caller to handle the failed promise.
    throw serverError;
  });
}
