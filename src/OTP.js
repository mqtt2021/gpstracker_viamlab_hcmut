import { RecaptchaVerifier, signInWithPhoneNumber, getAuth } from "firebase/auth";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { auth } from "./firebase.config";
import { BsFillShieldLockFill } from "react-icons/bs";
import PhoneInput from "react-phone-input-2";
import OtpInput from "otp-input-react";
import { CgSpinner } from "react-icons/cg";
import { BsTelephoneFill } from "react-icons/bs";


const OTP = () => {
  // const auth = getAuth();
  const location = useLocation();  
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [phone, setPhone] = useState(location.state?.phoneNumber || "");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [canResendOTP, setCanResendOTP] = useState(false);
  const [showOTP, setShowOTP] = useState(false);

  // function onCaptchVerify() {
  //   if (!window.recaptchaVerifier) {
  //     window.recaptchaVerifier = new RecaptchaVerifier(
  //       auth,  
  //       'recaptcha-container',
  //       {
  //         size: 'invisible',
  //         callback: (response) => {
  //           console.log('reCAPTCHA verified');
  //           onSignup(); // Gọi hàm gửi OTP
  //         }
  //       }
  //     );
  //   }
  // }



  function onCaptchVerify() {
    if (!window.recaptchaVerifier) {
      // 🔥 Tắt reCAPTCHA Enterprise để tránh lỗi
      auth.settings.appVerificationDisabledForTesting = false;

      console.log("👉 Bắt đầu tạo reCAPTCHA...");
      
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth, // ✅ Đối tượng Firebase Authentication
        'recaptcha-container', // ✅ ID của phần tử HTML chứa reCAPTCHA
        {
          size: 'invisible',
          callback: (response) => {
            console.log("✅ reCAPTCHA xác minh thành công! Response:", response);
            onSignup(); // Gửi OTP sau khi reCAPTCHA xác nhận
          },
          "expired-callback": () => {
            console.warn("⚠️ reCAPTCHA đã hết hạn. Hãy thử lại.");
          }
        }
        
      );
  
      // Kiểm tra xem `recaptchaVerifier` đã được tạo chưa
      if (window.recaptchaVerifier) {
        console.log("✅ reCAPTCHA đã được khởi tạo.");
      } else {
        console.error("❌ Lỗi: Không thể khởi tạo reCAPTCHA.");
        return;
      }
  
      // Gọi render() để đảm bảo reCAPTCHA hoạt động
      window.recaptchaVerifier.render().then((widgetId) => {
        window.recaptchaWidgetId = widgetId;
        console.log("✅ reCAPTCHA render thành công! Widget ID:", widgetId);
      }).catch((error) => {
        console.error("❌ Lỗi khi render reCAPTCHA:", error);
      });
    } else {
      console.log("🔄 reCAPTCHA đã tồn tại, không cần khởi tạo lại.");
    }
  }
  
  


  function onSignup() {
    setLoading(true);
    onCaptchVerify();

    const appVerifier = window.recaptchaVerifier;

    const formatPh =  "+84" + phone.replace(/^0/, "");
    console.log('formatPh',formatPh)

    signInWithPhoneNumber(auth, formatPh, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setLoading(false);
        setShowOTP(true);
        toast.success("OTP sended successfully!");
      })
      .catch((error) => {
        console.log('OTP send error: ',error);
        setLoading(false);
      });
  }

  useEffect(() => {
    console.log("Firebase Auth:", auth);
    if (!auth) {
      console.error("Lỗi: Firebase Authentication chưa được khởi tạo!");
    }

    // Chuyển việc khởi tạo RecaptchaVerifier ra ngoài useEffect
    if (!phone) {
      toast.error("Không có số điện thoại để xác thực");
      navigate("/register");
    }
  }, [phone, navigate]);

  function onOTPVerify() {
    setLoading(true);
    window.confirmationResult
      .confirm(otp)
      .then(async (res) => {
        console.log(res);
        setUser(res.user);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }

 
         console.log('showOTP',showOTP)
  return (
    <div className="containerOTP">
      <div>
       
        <div id="recaptcha-container"></div>
        {user ? (
          <h2 className="text-center text-white font-medium text-2xl">
            👍Login Success
          </h2>
        ) : (
          <div className="w-80 flex flex-col gap-4 rounded-lg p-4">
            <h1 className="text-center leading-normal text-white font-medium text-3xl mb-6">
              Welcome to <br /> CODE A PROGRAM
            </h1>
            {showOTP ? (
              <>
                <div className="bg-white text-emerald-500 w-fit mx-auto p-4 rounded-full">
                  <BsFillShieldLockFill size={30} />
                </div>
                <label
                  htmlFor="otp"
                  className="font-bold text-xl text-white text-center"
                >
                  Enter your OTP
                </label>  
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  OTPLength={6}
                  otpType="number"
                  disabled={false}
                  autoFocus
                  className="opt-container "
                ></OtpInput>
                <button
                  onClick={onOTPVerify}
                  className="bg-emerald-600 w-full flex gap-1 items-center justify-center py-2.5 text-white rounded"
                >
                  {loading && (  
                    <CgSpinner size={20} className="mt-1 animate-spin" />
                  )}
                  <span>Verify OTP</span>
                </button>
              </>
            ) : (
              <>
                <div className="bg-white text-emerald-500 w-fit mx-auto p-4 rounded-full">
                  <BsTelephoneFill size={30} />
                </div>
                <label
                  // htmlFor=""
                  // className="font-bold text-xl text-white text-center"
                >
                  Verify your phone number  
                </label>
                <PhoneInput country={"vn"} value={phone} onChange={setPhone} />
                <button
                  onClick={onSignup}
                  className="bg-emerald-600 w-full flex gap-1 items-center justify-center py-2.5 text-white rounded"
                >
                  {loading && (
                    <CgSpinner size={20} className="mt-1 animate-spin" />
                  )}
                  <span>Send code via SMS</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>                         
    </div> 
  ); 
}; 
 
export default OTP;                         
