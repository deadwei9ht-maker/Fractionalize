
'use server';

import {
  addDoc,
  collection,
  doc,
  runTransaction,
  serverTimestamp,
  type Firestore,
} from 'firebase/firestore';
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

type AiNftData = {
    userId: string;
    prompt: string;
    imageUrl: string;
    tokenId: string;
    createdAt: string;
};

type RealWorldAssetData = {
    userId: string;
    description: string;
    ownershipProofUrl: string;
    identityUrl: string;
    tokenId: string;
    createdAt: string;
    extractedName: string;
    extractedAssetDetails: string;
    verificationSummary: string;
};

type WalletConnectionData = {
  walletAddress: string;
  userId: string;
};

const CONNECTION_FLAG_THRESHOLD = 10;

export async function saveFractionalizedNft(
  db: Firestore,
  data: FractionalizedNftData
) {
  const collectionRef = collection(db, 'fractionalizedNfts');

  return addDoc(collectionRef, data).catch(async (serverError) => {
    const permissionError = new FirestorePermissionError({
      path: collectionRef.path,
      operation: 'create',
      requestResourceData: data,
    } satisfies SecurityRuleContext);

    errorEmitter.emit('permission-error', permissionError);
    throw serverError;
  });
}

export async function saveAiNft(db: Firestore, data: AiNftData) {
  const collectionRef = collection(db, 'aiNfts');
  return addDoc(collectionRef, data).catch(async (serverError) => {
    const permissionError = new FirestorePermissionError({
      path: collectionRef.path,
      operation: 'create',
      requestResourceData: data,
    } satisfies SecurityRuleContext);
    errorEmitter.emit('permission-error', permissionError);
    throw serverError;
  });
}

export async function saveRealWorldAsset(
    db: Firestore,
    data: RealWorldAssetData
) {
    const collectionRef = collection(db, 'realWorldAssets');

    return addDoc(collectionRef, data).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: collectionRef.path,
            operation: 'create',
            requestResourceData: data,
        } satisfies SecurityRuleContext);

        errorEmitter.emit('permission-error', permissionError);
        throw serverError;
    });
}


export async function logWalletConnection(
  db: Firestore,
  data: WalletConnectionData
) {
  const activityDocRef = doc(db, 'walletActivity', data.walletAddress);
  const logCollectionRef = collection(db, 'walletConnections');

  try {
    const isFlagged = await runTransaction(db, async (transaction) => {
      // 1. Log the individual connection event
      const logData = {
        ...data,
        connectedAt: serverTimestamp(),
      };
      transaction.set(doc(logCollectionRef), logData);

      // 2. Get the current activity state
      const activityDoc = await transaction.get(activityDocRef);
      const now = new Date().toISOString();
      let newFlaggedState = false;

      if (!activityDoc.exists()) {
        // If it's the first time, create the activity document
        transaction.set(activityDocRef, {
          connectionCount: 1,
          lastConnectionAt: now,
          flagged: false,
        });
      } else {
        // If it exists, increment the count
        const currentCount = activityDoc.data().connectionCount || 0;
        const newCount = currentCount + 1;
        newFlaggedState = newCount > CONNECTION_FLAG_THRESHOLD;
        
        transaction.update(activityDocRef, {
          connectionCount: newCount,
          lastConnectionAt: now,
          flagged: newFlaggedState,
        });
      }
      return newFlaggedState;
    });
    return isFlagged;

  } catch (serverError: any) {
     const permissionError = new FirestorePermissionError({
      path: activityDocRef.path,
      operation: 'write',
      requestResourceData: data,
    } satisfies SecurityRuleContext);

    errorEmitter.emit('permission-error', permissionError);
    // We don't re-throw here because logging failure shouldn't block the UI
    console.error("Failed to log wallet connection:", serverError);
    return false; // Return false as the flagging state is unknown/failed
  }
}
