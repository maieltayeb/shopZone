import { useState,useEffect, useCallback,useRef} from "react";
import { useForm } from "react-hook-form";
import {
  AiOutlineEdit,
  AiOutlineClose,
  AiOutlineCheck,
  AiOutlineDelete,
  AiOutlinePlus,
} from "react-icons/ai";
import { BiDownload } from "react-icons/bi";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import {
  updateProfile,
  
  verifyBeforeUpdateEmail,
  updatePassword, // دالة بتغير كلمة المرور في Firebase Auth
  reauthenticateWithCredential, // بتتحقق من هوية المستخدم من جديد
  EmailAuthProvider,
  sendPasswordResetEmail,
  fetchSignInMethodsForEmail, // بيجهز بيانات المصادقة (إيميل + باسورد)
} from "firebase/auth";

import { db, auth, storage } from "../firebase/config";
import { setUser } from "../features/auth/authSlice";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// ref → بيحدد مكان الملف في الـ Storage، زي العنوان
// uploadBytesResumable → بيرفع الملف ويديك progress أثناء الرفع
// getDownloadURL → بيجيب الـ URL بتاع الملف بعد الرفع
// storage → الـ instance بتاع Firebase Storage
import ReauthModal from "../components/reauthModal";
import { Dialog } from "@headlessui/react";
import {refreshUser}from '../features/auth/authListener';

import  { useAppDispatch, useAppSelector } from "../hooks/useAppStore";
import type {ProfileFormData,ResetPasswordFormData, AddressFormData } from '../types/forms.types'
import { Navigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { Address } from "../types";
export default function Profile() {
  const dispatch = useAppDispatch();

  const [activeTab, setActiveTab] = useState("profile");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  //uploadProgress → بيخزن نسبة الرفع من 0 لـ 100
  // isUploading → بيعرف لو في رفع بيحصل دلوقتي أو لأ
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [wrongAttempts, setWrongAttempts] = useState(0);
 const isReauthedRef = useRef(false);
  const { user } = useAppSelector((state) => state.auth);
  const [showModal, setShowModal] = useState(false);
  
  const Authuser=auth.currentUser;  
if (!Authuser||!user) {  
  return <Navigate to="/login" />;
}
  // Mock orders data
  const [orders] = useState([
    {
      id: 1,
      date: "2024-04-15",
      total: "$149.99",
      status: "Delivered",
      items: 3,
    },
    {
      id: 2,
      date: "2024-03-20",
      total: "$89.99",
      status: "Processing",
      items: 2,
    },
    {
      id: 3,
      date: "2024-02-10",
      total: "$299.99",
      status: "Delivered",
      items: 5,
    },
  ]);

  // Mock addresses data
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
      reset: resetProfile, 
    formState: { isSubmitting: isProfileSubmitting, errors: profileErrors, isDirty:profileDirty },
  } = useForm<ProfileFormData>({
    defaultValues:{
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  },
  });


  
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { isSubmitting: isPasswordSubmitting, errors: passwordErrors },
    reset: resetPassword,
  } = useForm<ResetPasswordFormData>();

  const {
    register: registerAddress,
    handleSubmit: handleAddressSubmit,
    formState: { isSubmitting: isAddressSubmitting, errors: addressErrors },
    reset: resetAddressForm,
    watch: watchAddress,
  } = useForm<AddressFormData>({
    defaultValues: {
      label: "",
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "",
      isDefault: false,
    },
  });

useEffect(() => {
  if (user) {
    resetProfile({
      //use nullish coalescing operator (??) to provide default empty strings if any of the user properties are null or undefined. This ensures that the form fields are always populated with strings, preventing potential issues with uncontrolled components in React Hook Form.
      firstName: user.firstName??"",
      lastName: user.lastName??"",
      email: user.email??"",
      phone: user.phone ??"",
    });
  }
}, [user, resetProfile]);

// Load addresses from Firestore - only on demand
const loadAddresses = useCallback(async () => {
  try {
    const userRef = doc(db, "users", Authuser.uid);
    const userDoc = await getDoc(userRef);
    const addressesData = userDoc.data()?.addresses || [];
    setAddresses(addressesData);
  } catch (error) {
    console.error("Error loading addresses:", error);
  }
}, [Authuser.uid]);



  /******* profile data ********************** */
  
  
 
  //useRef "احفظ البيانات اللي هنكمل عليها بعد التحقق"
 const pendingProfileDataRef = useRef<ProfileFormData | null>(null);
const onProfileSubmit = useCallback(async (data:ProfileFormData) => {
  try {
 
// !make sure authuser is not null (should never be the case here since we redirect if no user, but just to satisfy TypeScript) 
   

    const emailChanged = data.email !== (Authuser.email ?? "");

    const profileChanged =
      data.firstName !== user.firstName ||
      data.lastName !== user.lastName ||
      data.phone !== user.phone;

    // مفيش أي تغييرات
    if (!emailChanged && !profileChanged) {
      toast.info("ℹ️ لا توجد تغييرات للحفظ");
      return;
    }

    // =========================
    // EMAIL UPDATE FLOW
    // =========================
    if (emailChanged) {
   
      console.log("Email changed");

      // لازم يعمل re-auth الأول
      if (!isReauthedRef.current) {
          pendingProfileDataRef.current = data;
        setShowModal(true);
        return;
      }

      

      // تحقق إن الإيميل مش مستخدم
      const methods = await fetchSignInMethodsForEmail(
        auth,
        data.email
      );

      if (methods.length > 0) {
        toast.error("❌ هذا الإيميل مستخدم بالفعل");
        return;
      }

      // ابعت verification للإيميل الجديد
      await verifyBeforeUpdateEmail(Authuser, data.email, {
        url: window.location.origin + "/auth-action",
        handleCodeInApp: true,
      });

isReauthedRef.current = false;
setIsEditingProfile(false);
   
      // لو فيه profile changes حدثها
      if (profileChanged) {
        await updateProfile(Authuser, {
          displayName: `${data.firstName} ${data.lastName}`,
        });

        const userRef = doc(db, "users", Authuser.uid);

        await updateDoc(userRef, {
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
        });

        toast.success(
          "✅ تم تحديث البيانات وإرسال رابط التحقق للإيميل الجديد"
        );
      } else {
        toast.success(
          "✅ تم إرسال رابط التحقق للإيميل الجديد"
        );
      }

      setIsEditingProfile(false);
      isReauthedRef.current = false;

      return;
    }

    // =========================
    // PROFILE ONLY UPDATE
    // =========================
    if (profileChanged) {
      await updateProfile(Authuser, {
        displayName: `${data.firstName} ${data.lastName}`,
      });

      const userRef = doc(db, "users", Authuser.uid);

      await updateDoc(userRef, {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
      });

      toast.success("✅ تم تحديث البيانات بنجاح");
    }
resetProfile({
  ...data,
  email: data.email,
});

    setIsEditingProfile(false);

  } catch (error:unknown){ 
 
if(error instanceof FirebaseError){
    toast.error(error.message);

  } else{
    toast.error("error try again later");
  }
}},[resetProfile, user]);






  /**password update ************************************************/
  const onPasswordSubmit = async (data:ResetPasswordFormData) => {
    // بيقارن الباسورد الجديد بالتأكيد بتاعه
    // لو مش متطابقين → يوقف ويبعت رسالة خطأ
    if (data.newPassword !== data.confirmNewPassword) {
      toast.error("❌ كلمة المرور الجديدة مش متطابقة");
      return; // يوقف الدالة هنا ومتكملش
    }
    try {
  
    
      // EmailAuthProvider.credential() → بيجهز "بطاقة هوية" للمستخدم
      // مش بيتحقق لسه، بس بيجهز البيانات
      const credential = EmailAuthProvider.credential(
        Authuser.email ?? "", // إيميل المستخدم الحالي
        data.currentPassword, // كلمة المرور الحالية اللي كتبها في الـ form
      );

      // دلوقتي بيبعت البطاقة دي لـ Firebase يتأكد منها
      // لو كلمة المرور صح → يكمل
      // لو كلمة المرور غلط → يرمي error ونمسكه في الـ catch
      await reauthenticateWithCredential(Authuser, credential);
      // updatePassword → بيغير كلمة المرور في Firebase Auth فعلاً
      // بياخد: المستخدم + كلمة المرور الجديدة
      // await → بينتظر لحد ما العملية تخلص
      await updatePassword(Authuser, data.newPassword);
      toast.success("✅ تم تغيير كلمة المرور بنجاح");
      // بيظهر رسالة نجاح للمستخدم

      resetPassword();
    } catch (error:unknown) {
      if(error instanceof FirebaseError){
 if (
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential"
      ) {
        const attempts = wrongAttempts + 1;
        setWrongAttempts(attempts);

        if (attempts >= 3) {
          // بعد 3 محاولات غلط → عرض عليه reset
          toast.error("password wrong you finished❌");
          setShowResetModal(true);
        } else {
          // لسه في محاولات
          toast.error(`❌password wrong you have ${3 - attempts} attempts left`);
        }
      }  else {
        // أي خطأ تاني مش متوقع
      
    toast.error(error.message);
      }
        
      } else{
        toast.error("error try again later");
      }
     
    }
  };


  //reset password flow
  const handleSendPasswordResetEmail = async () => {
    try {
          const email = auth.currentUser?.email;

    if (!email) {
      toast.error("❌ لا يوجد إيميل للمستخدم");
      return;
    }
      await sendPasswordResetEmail(
        auth,
       email,
        // window.location.origin → بياخد الـ domain الحالي تلقائياً
        // لو على localhost → http://localhost:5173/reset-password
        // لو على production → https://your-app.com/reset-password
        {
          url: window.location.origin + "/reset-password",

          handleCodeInApp: true,
        },
      );
      toast.success("✅ تم إرسال الرابط على إيميلك");
      setShowResetModal(false);
      setWrongAttempts(0);
      resetPassword();
    } catch (err) {
      console.error(err);
      toast.error("❌ حدث خطأ، حاول مرة تانية");
    }
  };
  /*******************adress***************************************** */
  
  const saveAddressToFirestore = async (updatedAddresses: Address[]) => {
    try {
      const userRef = doc(db, "users", Authuser.uid);
      await updateDoc(userRef, {
        addresses: updatedAddresses,
      });
      setAddresses(updatedAddresses);
      toast.success("✅ تم حفظ العنوان بنجاح");
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error("❌ حدث خطأ أثناء حفظ العنوان");
    }
  };

  const onAddressSubmit = async (data: AddressFormData) => {
    try {
      let updatedAddresses: Address[];

      if (editingAddressId) {
        // تعديل عنوان موجود
        updatedAddresses = addresses.map((addr) =>
          addr.id === editingAddressId
            ? { ...addr, ...data }
            : { ...addr, isDefault: data.isDefault ? false : addr.isDefault }
        );
        setEditingAddressId(null);
      } else {
        // إضافة عنوان جديد
        const newAddress: Address = {
          id: Date.now().toString(),
          ...data,
          isDefault: addresses.length === 0 || data.isDefault,
        };
        
        // لو العنوان الجديد سيكون default، أزل default من باقي العناوين
        updatedAddresses = data.isDefault
          ? addresses.map((addr) => ({ ...addr, isDefault: false }))
          : addresses;
        updatedAddresses = [...updatedAddresses, newAddress];
      }

      await saveAddressToFirestore(updatedAddresses);
      resetAddressForm();
      setIsEditingAddress(false);
    } catch (error) {
      console.error("Error submitting address:", error);
      toast.error("❌ حدث خطأ، حاول مرة تانية");
    }
  };

  const handleDeleteAddress = (id: string) => {
    const updatedAddresses = addresses.filter((addr) => addr.id !== id);
    // لو حذفنا العنوان default، اجعل الأول default
    if (updatedAddresses.length > 0 && !updatedAddresses.some((a) => a.isDefault)) {
      updatedAddresses[0].isDefault = true;
    }
    saveAddressToFirestore(updatedAddresses);
  };

  const handleSetDefaultAddress = (id: string) => {
    const updatedAddresses = addresses.map((addr) => ({
      ...addr,
      isDefault: addr.id === id,
    }));
    saveAddressToFirestore(updatedAddresses);
  };

  const handleEditAddress = (address: Address) => {
    resetAddressForm({
      label: address.label,
      street: address.street,
      city: address.city,
      state: address.state,
      zip: address.zip,
      country: address.country,
      isDefault: address.isDefault,
    });
    setEditingAddressId(address.id);
    setIsEditingAddress(true);
  };

  const handleCancelAddressEdit = () => {
    resetAddressForm();
    setEditingAddressId(null);
    setIsEditingAddress(false);
  };

  const handleAddAddress = () => {
    resetAddressForm();
    setEditingAddressId(null);
    setIsEditingAddress(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Processing":
        return "bg-blue-100 text-blue-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  /**************uplaod image avatar************************************************* */
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // بياخد الملف اللي المستخدم اختاره
    // لو ملقاش ملف بيوقف
    const file = e.target.files?.[0];
    if (!file) return;
    // بيتأكد إن الملف صورة فعلاً مش PDF أو غيره
    if (!file.type.startsWith("image/")) {
      toast.error("❌ من فضلك اختار صورة فقط");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("❌ الصورة لازم تكون أصغر من 2MB");
      return;
    }

    try {
      setIsUploading(true);
       // بيحدد مكان الصورة في الـ Storage
      // المسار هيكون: users/uid_المستخدم/avatar
      const storageRef = ref(storage, `users/${Authuser.uid}/avatar`);
      // بيبدأ الرفع ويرجع task نقدر نتابعه
      const uploadTask = uploadBytesResumable(storageRef, file);
      // state_changed → بيتفعل كل شوية أثناء الرفع
      // bytesTransferred → الجزء اللي اترفع
      // totalBytes → الحجم الكلي
      // بيحسب النسبة المئوية ويحدث الـ state
      // state_changed هو event بيتفعل كل ما يتحول جزء من الملف من جهازك لـ Firebase.
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
          );
          setUploadProgress(progress);
        },
        () => {
          toast.error("❌ حدث خطأ أثناء الرفع");
          setIsUploading(false);
        },

        async () => {
          // لما الرفع يخلص
          const url = await getDownloadURL(uploadTask.snapshot.ref);

          // حدّث Authentication
          await updateProfile(Authuser, { photoURL: url });

          // حدّث Firestore
          await updateDoc(doc(db, "users",Authuser.uid), {
            avatar: url,
          });

          // حدّث Redux
          dispatch(setUser({ ...user, avatar: url }));

          setIsUploading(false);
          setUploadProgress(0);
          toast.success("✅ تم تحديث الصورة بنجاح");
        },
      );
    } catch (err) {
      console.error(err);
      toast.error("❌ حدث خطأ، حاول مرة تانية");
      setIsUploading(false);
    }
  };

  return (
  <>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-600"></div>
          <div className="px-6 sm:px-8 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-16 mb-6">
              {/*الـ label بيفتح الـ file picker لما تضغط عليه
accept="image/*" → بيخلي الـ file picker يعرض الصور بس
hidden → بيخبي الـ input الأصلي ويخلي الـ label ه */}
              <div className="relative w-32 h-32">
                <img
                  src={user.avatar || "https://via.placeholder.com/128"}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
                {/* زرار الـ upload */}
                <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer shadow-lg transition">
                  <AiOutlineEdit size={16} />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                </label>
                {isUploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {uploadProgress}%
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-gray-600 mt-1">{user.email}</p>
              </div>
              <button
                onClick={() =>{    resetProfile({
          firstName: user.firstName??"",
      lastName: user.lastName??"",
      email: user.email??"",
      phone: user.phone ??"",
    });  setIsEditingProfile(!isEditingProfile)}}
                className="flex justify-center items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
              >
                <AiOutlineEdit size={18} />
                <span className=" sm:inline">Edit Profile</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="flex overflow-x-auto border-b border-gray-200">
            {["profile", "orders", "addresses", "settings"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  if (tab === "addresses") {
                    loadAddresses();
                  }
                }}
                className={`px-6 py-4 font-medium text-sm sm:text-base whitespace-nowrap transition ${
                  activeTab === tab
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6 sm:p-8">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div>
                {!isEditingProfile ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name
                        </label>
                        <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-lg">
                          {user.firstName}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name
                        </label>
                        <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-lg">
                          {user.lastName}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-lg">
                          {user.email}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone
                        </label>
                        <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-lg">
                          {user.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => handleProfileSubmit(onProfileSubmit)(e)}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          {...registerProfile("firstName", {
                            required: "First name is required",
                          })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {profileErrors.firstName && (
                          <p className="text-red-500 text-xs mt-1">
                            {profileErrors.firstName.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          {...registerProfile("lastName", {
                            required: "Last name is required",
                          })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {profileErrors.lastName && (
                          <p className="text-red-500 text-xs mt-1">
                            {profileErrors.lastName.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          {...registerProfile("email", {
                            required: "Email is required",
                            pattern: {
                              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                              message: "Invalid email format",
                            },
                          })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {profileErrors.email && (
                          <p className="text-red-500 text-xs mt-1">
                            {profileErrors.email.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          {...registerProfile("phone")}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        type="submit"
                        disabled={!profileDirty||isProfileSubmitting}
                        className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition"
                      >
                        <AiOutlineCheck size={18} />
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() =>{    resetProfile({
          firstName: user.firstName??"",
      lastName: user.lastName??"",
      email: user.email??"",
      phone: user.phone ??"",
    });  setIsEditingProfile(false)}}
                        className="flex items-center gap-2 px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-medium transition"
                      >
                        <AiOutlineClose size={18} />
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-6">
                  Your Orders
                </h3>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
                        <div>
                          <p className="text-xs text-gray-500 uppercase">
                            Order ID
                          </p>
                          <p className="font-semibold text-gray-900">
                            #{order.id}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase">
                            Date
                          </p>
                          <p className="font-semibold text-gray-900">
                            {order.date}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase">
                            Status
                          </p>
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}
                          >
                            {order.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-4">
                          <div>
                            <p className="text-xs text-gray-500 uppercase">
                              Total
                            </p>
                            <p className="font-bold text-lg text-blue-600">
                              {order.total}
                            </p>
                          </div>
                          <button className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition">
                            <BiDownload size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === "addresses" && (
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <h3 className="text-lg font-bold text-gray-900">
                    Saved Addresses
                  </h3>
                  {!isEditingAddress && (
                    <button
                      onClick={handleAddAddress}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition w-full sm:w-auto justify-center sm:justify-start"
                    >
                      <AiOutlinePlus size={18} />
                      Add Address
                    </button>
                  )}
                </div>

                {isEditingAddress && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      {editingAddressId ? "Edit Address" : "Add New Address"}
                    </h4>
                    <form onSubmit={handleAddressSubmit(onAddressSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <input
                            type="text"
                            placeholder="Label (e.g., Home, Office)"
                            {...registerAddress("label", {
                              required: "Label is required",
                            })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          {addressErrors.label && (
                            <p className="text-red-500 text-xs mt-1">{addressErrors.label.message}</p>
                          )}
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="Street Address"
                            {...registerAddress("street", {
                              required: "Street address is required",
                            })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          {addressErrors.street && (
                            <p className="text-red-500 text-xs mt-1">{addressErrors.street.message}</p>
                          )}
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="City"
                            {...registerAddress("city", {
                              required: "City is required",
                            })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          {addressErrors.city && (
                            <p className="text-red-500 text-xs mt-1">{addressErrors.city.message}</p>
                          )}
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="State"
                            {...registerAddress("state", {
                              required: "State is required",
                            })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          {addressErrors.state && (
                            <p className="text-red-500 text-xs mt-1">{addressErrors.state.message}</p>
                          )}
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="ZIP Code"
                            {...registerAddress("zip", {
                              required: "ZIP code is required",
                            })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          {addressErrors.zip && (
                            <p className="text-red-500 text-xs mt-1">{addressErrors.zip.message}</p>
                          )}
                        </div>
       
                      </div>

                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          {...registerAddress("isDefault")}
                          className="w-4 h-4 rounded border-gray-300"
                          id="setDefault"
                        />
                        <label htmlFor="setDefault" className="text-sm text-gray-700">
                          Set as default address
                        </label>
                      </div>

                      <div className="flex gap-4">
                        <button
                          type="submit"
                          disabled={isAddressSubmitting}
                          className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition"
                        >
                          <AiOutlineCheck size={18} />
                          {isAddressSubmitting ? "Saving..." : "Save Address"}
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelAddressEdit}
                          className="flex items-center gap-2 px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-medium transition"
                        >
                          <AiOutlineClose size={18} />
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {addresses.length === 0 && !isEditingAddress ? (
                  <div className="text-center py-12 text-gray-500">
                    <p>No addresses saved yet. Add your first address to get started!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        className={`border-2 rounded-lg p-4 sm:p-6 ${
                          address.isDefault
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-bold text-gray-900">
                              {address.label}
                            </h4>
                            {address.isDefault && (
                              <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                                Default
                              </span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditAddress(address)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                            >
                              <AiOutlineEdit size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteAddress(address.id)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                            >
                              <AiOutlineDelete size={18} />
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-2">{address.street}</p>
                        <p className="text-gray-700 mb-4">
                          {address.city}, {address.state} {address.zip},{" "}
                          {address.country}
                        </p>
                        {!address.isDefault && (
                          <button
                            onClick={() => handleSetDefaultAddress(address.id)}
                            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                          >
                            Set as Default
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="max-w-md">
                <h3 className="text-lg font-bold text-gray-900 mb-6">
                  Change Password
                </h3>
                <form
                  onSubmit={handlePasswordSubmit(onPasswordSubmit)}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      {...registerPassword("currentPassword", {
                        required: "Current password is required",
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter current password"
                    />
                    {passwordErrors.currentPassword && (
                      <p className="text-red-500 text-xs mt-1">
                        {passwordErrors.currentPassword.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      {...registerPassword("newPassword", {
                        required: "New password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter new password"
                    />
                    {passwordErrors.newPassword && (
                      <p className="text-red-500 text-xs mt-1">
                        {passwordErrors.newPassword.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      {...registerPassword("confirmNewPassword", {
                        required: "Please confirm new password",
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Confirm new password"
                    />
                    {passwordErrors.confirmNewPassword && (
                      <p className="text-red-500 text-xs mt-1">
                        {passwordErrors.confirmNewPassword.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isPasswordSubmitting}
                    className="w-full px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition"
                  >
                    {isPasswordSubmitting ? "Updating..." : "Update Password"}
                  </button>
                </form>
                {showResetModal && (
                  <Dialog
                    open={showResetModal}
                    onClose={() => setShowResetModal(false)}
                  >
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <Dialog.Panel className="bg-white rounded-2xl p-8 max-w-sm w-full">
                        <Dialog.Title className="text-xl font-bold text-center mb-2">
                          نسيت كلمة المرور؟
                        </Dialog.Title>
                        <Dialog.Description className="text-gray-500 text-center text-sm mb-6">
                          هنبعت رابط على {Authuser.email}
                        </Dialog.Description>

                        <div className="flex flex-col gap-3">
                          <button
                            onClick={handleSendPasswordResetEmail}
                            className="w-full py-3 bg-blue-600 text-white rounded-xl"
                          >
                            إرسال الرابط
                          </button>
                          <button
                            onClick={() => setShowResetModal(false)}
                            className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl"
                          >
                            حاول مرة تانية
                          </button>
                        </div>
                      </Dialog.Panel>
                    </div>
                  </Dialog>
                )}
                <hr className="my-8" />

                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Danger Zone
                </h3>
                <button className="w-full px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition">
                  Delete Account
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
   { /* 🔐 Reauth Modal */}
    <ReauthModal
      isOpen={showModal}
      onClose={() => {setShowModal(false);}}
      onSuccess={async() => {
            // setIsReauthed(true);
 isReauthedRef.current = true;
if (pendingProfileDataRef.current) {
    await onProfileSubmit(
      pendingProfileDataRef.current
    );

    pendingProfileDataRef.current = null;
  }
      }}
    />
    </>
  );
}
