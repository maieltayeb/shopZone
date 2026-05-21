import { useState } from "react";
import { FirebaseError } from "firebase/app";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { toast } from "react-toastify";
import {getCurrentAuthUser} from '../features/auth/auth.service';

interface ReauthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}
export default function ReauthModal({ isOpen, onClose, onSuccess }: ReauthModalProps) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleReauth = async () => {
    
    try {
      setLoading(true);

const currentUser = getCurrentAuthUser();
  if (!currentUser) {
    toast.error(" no user logged in");
    return;
  }
   
      // EmailAuthProvider credential requires email and password to create a credential object for reauthentication.
     // {
//   providerId: "password",
//   email: "user@example.com",
//   password: "123456"
// }
      const credential = EmailAuthProvider.credential(
        currentUser.email!,
        password
      );

      await reauthenticateWithCredential(currentUser, credential);

      onClose();
      onSuccess();
    

    } catch (error) {
    
if(error instanceof FirebaseError) {
      if (error.code === "auth/invalid-credential") {
        toast.error("pssword wrong😕");
      } else {
        toast.error(" error during reauthentication 😕");
      }

    } }finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-[350px] rounded-xl bg-white p-6 shadow-xl">

        <h2 className="text-lg font-semibold text-gray-800">
          🔐 confirm password
        </h2>

        <p className="mt-2 text-sm text-gray-500">
        please enter your password to confirm this action. This is for your security 🔐
        </p>

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-4 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />

        <div className="mt-5 flex justify-between">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300"
          >
            Cancel
          </button>

          <button
            onClick={handleReauth}
            disabled={loading}
            className="rounded-lg bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Confirming..." : "Confirm"}
          </button>
        </div>

      </div>
    </div>
  );
}