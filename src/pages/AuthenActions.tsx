import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { applyActionCode } from "firebase/auth";
import { auth } from "../firebase/config";
import { toast } from "react-toastify";

export default function AuthAction() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const mode = searchParams.get("mode");
    const oobCode = searchParams.get("oobCode");

    if (!mode || !oobCode) {
      navigate("/");
      return;
    }

    const handleAction = async () => {
      switch (mode) {
        case "resetPassword":
          navigate(`/reset-password?oobCode=${oobCode}`, { replace: true });
          break;

        case "verifyAndChangeEmail":
          try {
            await applyActionCode(auth, oobCode);


            await auth.signOut();
              navigate("/login", {
  state: { emailChanged: true }
});
            // navigate("/login?emailChanged=true", { replace: true });
          } catch (err) {
            console.log(err);

            if (err.code === "auth/invalid-action-code") {
              toast.error("❌ اللينك انتهت صلاحيته أو اتستخدم قبل كده");
            } else {
              toast.error("❌ حدث خطأ، حاول مرة تانية");
            }

            navigate("/login", { replace: true });
          }
          break;

        default:
          navigate("/", { replace: true });
      }
    };

    handleAction();
  }, [searchParams, navigate]);

  return <p>جاري المعالجة...</p>;
}