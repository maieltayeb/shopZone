// pages/ResetPassword.jsx
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { confirmPasswordReset, verifyPasswordResetCode, signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { useDispatch } from "react-redux";
import { userLogout } from "../features/auth/authSlice";
import { toast } from "react-toastify";
import { logout } from "../features/auth/auth.service";
import type { ResetPasswordFormData } from "../types/forms.types";
import { FirebaseError } from "firebase/app";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [isValidCode, setIsValidCode] = useState<boolean | null>(null);
  // null = لسه بيتحقق | true = كود صح | false = كود غلط أو منتهي
  
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>();

  // استخرج الـ oobCode من الـ URL
  const oobCode = searchParams.get("oobCode");

  useEffect(() => {

     if (!oobCode) {
 
    navigate("/login");
    return;
  }
 
    // verify of code 
    const verifyCode = async () => {
      try {
        const email = await verifyPasswordResetCode(auth, oobCode);
  
        setUserEmail(email);
        setIsValidCode(true);
      } catch (error) {
 
        setIsValidCode(false);
      }
    };

    verifyCode();
  }, [oobCode]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!oobCode) {
      toast.error("  invalid link"); 
      return;
    }
    try {
      // reset password
      await confirmPasswordReset(auth, oobCode, data.newPassword);

  
      await logout();

      // reset redux
      dispatch(userLogout());

    
      toast.success("✅ password changed successfully, please login again");
      navigate("/login", {
        state: { message: "✅ password changed successfully, please login again" },
      });
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/expired-action-code":
            toast.error("Link expired 😕");
            setIsValidCode(false);
            break;
          case "auth/weak-password":
            toast.error("❌ password is too weak, please use at least 6 characters");
            break;
          default:
            toast.error("❌ an error occurred, please try again");
        }
    
    }else{
      toast.error("❌ an error occurred, please try again");
    }
  };}

  // loading during verify
  if (isValidCode === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent 
                          rounded-full animate-spin mx-auto mb-4"/>
          <p className="text-gray-500"> verifying link... </p>
        </div>
      </div>
    );
  }
//code error 
  if (isValidCode === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full text-center">
          
          <div className="bg-red-100 p-4 rounded-full w-fit mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" 
                 stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-2">
     link invalid or expired
          </h2>
          <p className="text-gray-500 text-sm mb-6">
    link invalid or expired 😕. Please request a new password reset if you still need it.
          </p>

          <button
            onClick={() => navigate("/login")}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 
                       text-white rounded-xl font-medium transition"
          >
          back to login
          </button>

        </div>
      </div>
    );
  }

  
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-blue-100 p-4 rounded-full w-fit mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" 
                 stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">كلمة مرور جديدة</h2>
          <p className="text-gray-500 text-sm mt-1">{userEmail}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              كلمة المرور الجديدة
            </label>
            <input
              type="password"
              {...register("newPassword", {
                required: "كلمة المرور مطلوبة",
                minLength: { value: 6, message: "6 أحرف على الأقل" },
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl 
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="أدخل كلمة المرور الجديدة"
            />
            {errors.newPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              تأكيد كلمة المرور
            </label>
            <input
              type="password"
              {...register("confirmNewPassword", {
                required: "تأكيد كلمة المرور مطلوب",
                validate: (value) =>
                  value === watch("newPassword") || "كلمة المرور مش متطابقة",
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl 
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="أكد كلمة المرور"
            />
            {errors.confirmNewPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmNewPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 
                       disabled:bg-blue-400 text-white rounded-xl 
                       font-medium transition mt-2"
          >
            {isSubmitting ? "جاري التغيير..." : "تغيير كلمة المرور"}
          </button>

        </form>
      </div>
    </div>
  );
}