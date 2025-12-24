'use client';

import {
    ref,
    uploadBytes,
    getDownloadURL,
    type FirebaseStorage,
} from 'firebase/storage';

/**
 * Uploads a file to Firebase Storage and returns the download URL.
 * @param storage The Firebase Storage instance.
 * @param path The path where the file should be stored (e.g., 'images/profile.jpg').
 * @param file The file to upload.
 * @returns A promise that resolves with the public download URL of the file.
 */
export async function uploadFile(
    storage: FirebaseStorage,
    path: string,
    file: File
): Promise<string> {
    const storageRef = ref(storage, path);
    
    try {
        // Upload the file to the specified path
        const snapshot = await uploadBytes(storageRef, file);
        
        // Get the download URL
        const downloadURL = await getDownloadURL(snapshot.ref);
        
        return downloadURL;
    } catch (error) {
        console.error("Error uploading file:", error);
        // Depending on your error handling strategy, you might want to re-throw the error
        // or return a specific error message.
        throw new Error(`Failed to upload file: ${(error as Error).message}`);
    }
}
