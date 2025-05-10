import React,{useState,useEffect,useContext} from 'react'
import { useNavigate, useLocation  } from 'react-router-dom';
import { FaUser } from "react-icons/fa";
import {  toast } from 'react-toastify';
import { LoginAPI } from './services/UserService';
import './Register.scss'       
import { url } from './services/UserService';
import { UserContext } from './usercontext';
import { FaLock } from "react-icons/fa";
// import logosawaco from './asset/images/LOGO_SAWACO.png'    
import logosawaco from './asset/images/01_logobachkhoasang.png'     
import { FaPhoneAlt } from "react-icons/fa";
import axios from 'axios';

function Register() {
    const navigate = useNavigate();

    const [userName,setuserName]=useState('')   
    const [password, setpassword]=useState('')         
    const [phone, setPhone]=useState('')
    const [userRegister, setuserRegister] = useState({userName:''})
    const { user, loginContext , setaccessRouteRegister , accessRouteOTP, setaccessRouteOTP } = useContext(UserContext);
    const [loading, setLoading] = useState(false); // Thêm trạng thái loading
    const [ListAllCustomer, setListAllCustomer] = useState([]); 
    
    const GetAllCustomer = async () => {   
      try {
        const response = await axios.get(`${url}/Customer/GetAllCustomers`);
        const res = response.data
        console.log('res',res)  
        setListAllCustomer(response.data)

                // toast.success('Đăng kí thành công')
                // navigate('/')   
      
       
         
      } catch (error) {
        // toast.error('Đăng kí không thành công')
      }
    };

    const Subcribe = async () => {   
      try {
        const response = await axios.post(`${url}/Customer/RegisterNewCustomer`, userRegister );
        console.log(response)  
           
        if(response.data = 'Registered successfully'){
                toast.success('Đăng kí thành công')
                navigate('/')   
        }
        else{
          toast.error('Đăng kí không thành công')
        }
         
      } catch (error) {
        toast.error('Đăng kí không thành công')
      }
    };

    const handleSubcribe = () => {
      if(phone === '' || userName === '' || password === '' ){  
        toast.error('Bạn chưa nhập đủ thông tin')  
        return  
      }

      // Kiểm tra số điện thoại
      const phoneRegex = /^0\d{9}$/; // Bắt đầu bằng 0 và có đúng 10 chữ số
      if (!phoneRegex.test(phone)) {
        toast.error("Số điện thoại không hợp lệ!");
        return;
      }

      if(ListAllCustomer.length > 0){
          const checkPhone = ListAllCustomer.find((item) => item.phoneNumber === phone);
          if(checkPhone){
            toast.error('Số điện thoại đã được dùng')  
            return
          }
          const checkName = ListAllCustomer.find((item) => item.userName === userName);
          if(checkName){  
            toast.error('Tên đăng nhập đã tồn tại')  
            return
          }
     
        setLoading(true); // Bắt đầu trạng thái tải  


        setuserRegister({  
          phoneNumber:phone,
          userName:userName,
          password:password
        })

         // Chuyển hướng sang trang OTP, truyền số điện thoại qua state
        // setaccessRouteRegister(false)
        // sessionStorage.setItem('accessRegister', false);
        // setaccessRouteOTP(true) 
        // navigate('/otp', { state: { phoneNumber: phone } });

      }


      else{
          setLoading(true); // Bắt đầu trạng thái tải

          setuserRegister({    
            phoneNumber:phone,
            userName:userName,
            password:password
          })

           // Chuyển hướng sang trang OTP, truyền số điện thoại qua state
          // setaccessRouteRegister(false)
          // sessionStorage.setItem('accessRegister', false);
          // setaccessRouteOTP(true) 
          // navigate('/otp', { state: { phoneNumber: phone } });
      }
     
     
    }

    useEffect(()=>{
      if(userRegister.userName !==''){
        Subcribe()
      }

    },[userRegister])  

  useEffect(() => {
    GetAllCustomer()
    const accessRegister = sessionStorage.getItem('accessRegister');
    if(accessRegister){
      //  setaccessRouteRegister(accessRegister)   
    }
   
  },[ ])

   useEffect(() => {
      const handleKeyDown = (e) => {
          if (e.key === "Enter") {
            handleSubcribe();
          }
      };
  
      window.addEventListener("keydown", handleKeyDown);
  
      return () => {
          window.removeEventListener("keydown", handleKeyDown);
      };
  
  
  }, [userName, password, phone]);  

  

      return (   
       
        <div class="containerRegister"> 
                    {loading && (
                      <div className="loading-overlay">
                        <div className="loading-spinner"></div>
                      </div>
                    )}  
                <div className='divLogoSawaco'>
                    <img 
                      src={logosawaco} alt="Example" 
                      width="200" 
                      height="150"
                    />
                </div>     
                <div class="wrapperRegister">
                <div class="titleRegister"><span>Đăng ký tài khoản</span></div>  
                  <div className='formRegister'>
                    <div class="rowRegister">
                      <i class="fas fa-user">  
                          <FaUser/>    
                      </i>
                      <input 
                            type="text" placeholder="Tên đăng nhập" 
                            value={userName}
                            onChange={(e)=>setuserName(e.target.value)}
                      />
                    </div>
                    <div class="rowRegister">
                      <i class="fas fa-user">  
                          <FaPhoneAlt/>
                      </i>
                      <input 
                            type="text" placeholder="Số điện thoại" 
                            value={phone}
                            onChange={(e)=>setPhone(e.target.value)}
                      />
                    </div>
                    <div class="rowRegister">
                      <i class="fas fa-lock">
                        <FaLock/>
                      </i>
                      <input 
                                type = 'password' 
                                placeholder="Mật khẩu" 
                                value={password}
                                onChange={(e) => setpassword(e.target.value)}
                      />
                    </div>
                   
                    <div class="rowRegister buttonRegister">

                      <button   
                                className='button-loginRegister'
                                onClick={handleSubcribe}
                                disabled={loading} // Vô hiệu hóa nút khi đang tải
                                >
                          Đăng ký                
                      </button>
                  
                    </div>
                   
                  </div>
                </div>  
        </div>

       
  )   
}

export default Register
   
            
    
    
   
   
   
    
    
    