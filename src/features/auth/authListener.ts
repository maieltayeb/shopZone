



import { onAuthStateChanged } from "firebase/auth";
import { auth,db } from "../../firebase/config";
import { setUser, userLogout, setLoading ,setError} from "./authSlice";
import { doc, getDoc,updateDoc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { AppDispatch } from "../../app/store";
import { getUserData, updateUserData } from "../user/user.service";
import type { User as FirebaseUser } from "firebase/auth";

export const startAuthListener = (dispatch: AppDispatch) => {
  dispatch(setLoading());

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      await handleUser(user, dispatch); 
    } else {
      dispatch(userLogout());
    }
  });
};
const handleUser = async (user: FirebaseUser, dispatch: AppDispatch) => {
  try {
   
     await user.reload(); 
const data = await getUserData(user.uid);
   
  
    dispatch(setUser({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      emailVerified: user.emailVerified,
      firstName: data?.firstName ?? "",
      lastName: data?.lastName ?? "",
      phone: data?.phone ?? "",
      address: data?.address ?? "",
      role: data?.role ?? "customer",
      avatar: data?.avatar ?? "",
    }));

  } catch (error:unknown) {
    if (error instanceof FirebaseError) {

    switch (error.code) {
     
     
    
      case "firestore/permission-denied":
        dispatch(setError("No permission to access data"));
           dispatch(userLogout());
        break;

      case "firestore/unavailable":
        dispatch(setError("Network error, try again"));
        break;

      default:
        dispatch(setError("Something went wrong"));
    }

  } else {
    dispatch(setError("Unexpected error"));
  }
   
  }
};







// export const reuser = async (dispatch) => {
//   await auth.currentUser?.reload();
//   const user = auth.currentUser;
  
//   const snap = await getDoc(doc(db, "users", user.uid));
//   const data = snap.data();
  
//   dispatch(setUser({
//     uid: user.uid,
//     email: user.email,
//     emailVerified: user.emailVerified,
//     firstName: data?.firstName ?? "",
//     lastName: data?.lastName ?? "",
//     phone: data?.phone ?? "",
//     address: data?.address ?? "",
//     role: data?.role ?? "customer",
//     avatar: data?.avatar ?? "",
//   }));
// };


// export const startAuthListener = (dispatch) => {
  
//   dispatch(setLoading());

//   onAuthStateChanged(auth, async (user) => {
//       // user logged in
//     if (user) {
//       try {
//         console.log(user.email); // a@gmail.com (قديم)

// await user.reload(); // ← راحت Firebase وجابت أحدث بيانات

// console.log(user.email);
//         // جيب الداتا الزيادة من Firestore
//         const snap = await getDoc(doc(db, "users", user.uid));
        
//         // ✅ لو مش موجود في Firestore
//         if (!snap.exists()) {
//           dispatch(userLogout());
//           return;
//         }
        
//         const data = snap.data();
//         console.log("Firestore data:", data);
        
//         // لو الإيميل في Firebase اتغير، حدّث Firestore
//         if (data?.email !== user.email) {
//           await updateDoc(doc(db, "users", user.uid), {
//             email: user.email,
//           });
//         }
      
      
//       await updateDoc(doc(db, "users", user.uid), {
//         emailVerified: true,
//       });
    
//     //data come from fireStore,and firebase Auth
//         dispatch(setUser({
//           uid: user.uid,
//           email: user.email,
//           displayName: user.displayName,
//           emailVerified: user.emailVerified,
//           firstName: data?.firstName ?? "",
//           lastName: data?.lastName ?? "",
//           phone: data?.phone ?? "",
//           address: data?.address ?? "",
//           role: data?.role ?? "customer",
//           avatar: data?.avatar ?? "",
           
//         }));
        
//       } catch (error) {
//         console.error(error.code, error.message);
//           dispatch(setError(error.message));
//   dispatch(userLogout());
//       }
//     } else {
//       dispatch(userLogout());
//     }
//   });
// };