import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../../firebase/config";

export const getUserData= async (uid: string) => {
  const userRef = doc(db, "users", uid);

  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    throw new Error("User data not found");
  }

  return snap.data();
};

export const updateUserData = async (
  uid: string,
  data: Record<string, unknown>
) => {
  const userRef = doc(db, "users", uid);

  await updateDoc(userRef, data);
};