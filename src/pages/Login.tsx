import { useState, useEffect,useRef } from 'react';
import { FirebaseError } from "firebase/app"
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useNavigate,useSearchParams ,useLocation,Link} from 'react-router-dom';
import{useDispatch, useSelector}from 'react-redux'
import { useForm } from "react-hook-form";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {auth, db} from '../firebase/config'
import {  setError,setUser } from "../features/auth/authSlice";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify"; 
import{ useAppSelector } from '../hooks/useAppStore';
import type {   LoginFormData}from '../types/forms.types'
import {userlogin} from '../features/auth/auth.service'
export default function Login() {
  const navigate = useNavigate();
  // const [searchParams] = useSearchParams();
  // const emailChanged = searchParams.get("emailChanged");  
  const dispatch=useDispatch()
  const { error } = useAppSelector((state) => state.auth);

const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting ,errors },
  } = useForm<LoginFormData>();

  const [showPassword, setShowPassword] = useState(false);
 const [success, setSuccess] = useState(false);
  const location = useLocation();
const emailChanged = location.state?.emailChanged;
  // Clear error when component mounts
  const shown = useRef(false);
useEffect(() => {
  dispatch(setError(null));
console.log("emailChanged", emailChanged);  
  if (emailChanged && !shown.current) {
    shown.current = true;
    toast.success(
      "✓ Email changed successfully! Please log in with your new email."
    );

   
  }
}, [dispatch, emailChanged]);



  const onSubmit =async (formData: LoginFormData) => {
   
    try {
      const userCredential = await userlogin(formData.email, formData.password);
      const currentUser = userCredential;
      
      // Get user data from Firestore
      const snap = await getDoc(doc(db, "users", currentUser.uid));
      const data = snap.data();
      
      // If email changed (user verified new email), update Firestore
      if (data?.email !== currentUser.email) {
        console.log("📧 Email changed detected - updating Firestore from", data?.email, "to", currentUser.email);
        await updateDoc(doc(db, "users", currentUser.uid), {
          email: currentUser.email,
        });
      }
      
      // Dispatch user to Redux store BEFORE navigating
      dispatch(setUser({
        uid: currentUser.uid,
        email: currentUser.email,
        displayName: currentUser.displayName,
        firstName: data?.firstName ?? "",
        lastName: data?.lastName ?? "",
        phone: data?.phone ?? "",
        address: data?.address ?? "",
        avatar: data?.avatar ?? "",
        role: data?.role ?? "customer"
      }));
      
      setSuccess(true);
      setTimeout(() => {
  navigate("/profile");
}, 1000)
    
    } catch (error) {
     
       const msgs: Record<string, string> = {
        
        "auth/invalid-credential": "invalid email or password",
      };
      
  
  if (error instanceof FirebaseError) {
    dispatch(setError(msgs[error.code] || "error, try again"));
  } else {
    dispatch(setError("error, try again"));
  }
}  
    //  dispatch(setError(msgs[error.code] || "error ,try agian"));
      
}
    
  

 

  return (
  
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 sm:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600 text-sm sm:text-base">Sign in to your account</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-sm font-medium">✓ Login successful! Redirecting...</p>
          </div>
        )}
{error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm font-medium"> {error}  retry</p>
          </div>
        )}
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
         
            <input
              type="email"
              id="email"
       
        {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email format",
            },
          })} 
autoComplete="email"
            //   value={formData.email}
            //   onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm sm:text-base ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>
            )}
          </div>
   
      
     
    
          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                
 autoComplete="current-password"
          {...register("password", {
            required: "Password is required",
         
          })}

                // value={formData.password}
                // onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm sm:text-base ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1.5">{errors.password.message}</p>
            )}
          </div>

          {/* Remember Me 
          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
                type="checkbox"
          {...register("rememberMe")}
         
            
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700 cursor-pointer">
              Remember me
            </label>
          </div>
*/}
          {/* Submit Error */}
          {/* {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )} */}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 rounded-lg transition duration-200 mt-6 text-sm sm:text-base"
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>

       
        </form>

        {/* Register Link */}
        <p className="text-center text-gray-600 mt-6 text-sm sm:text-base">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
            Register here
          </Link>
        </p>
      </div>
    </div>
     
  );
}
   {/* Social Buttons */}
        //   <div className="grid grid-cols-2 gap-3">
        //     <button
        //       type="button"
        //       className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-sm"
        //     >
        //       Google
        //     </button>
        //     <button
        //       type="button"
        //       className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-sm"
        //     >
        //       GitHub
        //     </button>
        //   </div>
        
          {/* Divider */}
        //   <div className="relative my-6">
        //     <div className="absolute inset-0 flex items-center">
        //       <div className="w-full border-t border-gray-300"></div>
        //     </div>
        //     <div className="relative flex justify-center text-sm">
        //       <span className="px-2 bg-white text-gray-500">Or continue with</span>
        //     </div>
        //   </div>
