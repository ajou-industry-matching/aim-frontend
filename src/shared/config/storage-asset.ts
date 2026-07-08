export const storageAsset = (name: string): string =>
  `https://firebasestorage.googleapis.com/v0/b/${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}/o/public%2Fassets%2F${name}?alt=media`;
