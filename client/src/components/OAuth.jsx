import React from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/user/userSlice.js";
import { useNavigate } from "react-router-dom";

function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });

      const data = await res.json();

      dispatch(loginSuccess(data));
      navigate("/");
    } catch (error) {
      console.log("Could not sign in with Google", error);
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="w-full py-3 px-5 text-lg text-gray-900 bg-gray-50 rounded-lg mt-2 cursor-pointer font-medium border border-gray-300 flex items-center justify-center space-x-2"
    >
      <img src="/google.png" alt="Google Logo" className="w-6 h-6" />{" "}
      {/* โลโก้ Google */}
      <span>เข้าสู่ระบบด้วย Google</span>
    </button>
  );
}

export default OAuth;
