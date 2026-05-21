import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  type User as FirebaseUser,
} from "firebase/auth";

import { auth } from "../../firebase/config";

export const userlogin = async (
  email: string,
  password: string
) => {
  const credential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  return credential.user;
};

export const userRegister = async (
  email: string,
  password: string
) => {
  const credential =
    await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

  return credential.user;
};

export const logout = async () => {
  await signOut(auth);
};

export const getCurrentAuthUser = (): FirebaseUser | null => {
  return auth.currentUser;
};