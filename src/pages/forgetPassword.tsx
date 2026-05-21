// pages/ForgotPassword.jsx
import { useForm } from "react-hook-form";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase/config";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await sendPasswordResetEmail(auth, data.email, {
        url: window.location.origin + "/reset-password",
        handleCodeInApp: true,
      });
      toast.success("✅ Password reset link has been sent to your email");
      navigate("/login");
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        toast.error(" email is not existed ❌");
      } else {
        toast.error(" error ❌ try again ");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-blue-100 p-4 rounded-full w-fit mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none"
              stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">نسيت كلمة المرور؟</h2>
          <p className="text-gray-500 text-sm mt-1">
Enter your email address to receive a password reset link
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
          Email
            </label>
            <input
              type="email"
              {...register("email", {
                required: "email required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "invalid email",
                },
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="example@email.com"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700
                       disabled:bg-blue-400 text-white rounded-xl
                       font-medium transition"
          >
            {isSubmitting ? "sending ..." : "send link" }
          </button>

          <Link
            to="/login"
            className="block text-center text-sm text-gray-500 
                       hover:text-gray-700 transition"
          >
return to login 
          </Link>
        </form>

      </div>
    </div>
  );
}