const requiredFirebaseStorageConfig = {
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
} as const;

const missingFirebaseStorageKeys = Object.entries(requiredFirebaseStorageConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingFirebaseStorageKeys.length > 0) {
  throw new Error(
    `Missing Firebase public environment variables: ${missingFirebaseStorageKeys.join(", ")}`,
  );
}

export const storageAsset = (name: string): string =>
  `https://firebasestorage.googleapis.com/v0/b/${requiredFirebaseStorageConfig.storageBucket}/o/public%2Fassets%2F${name}?alt=media`;
