import React,{useState,useEffect,useContext} from 'react'
import { useNavigate, useLocation  } from 'react-router-dom';
import { FaUser } from "react-icons/fa";
import {  toast } from 'react-toastify';
import { LoginAPI } from './services/UserService';
import './Login.scss'
import { url } from './services/UserService';
import { UserContext } from './usercontext';
import { FaLock } from "react-icons/fa";
// import logosawaco from './asset/images/LOGO_SAWACO.png'    
import logosawaco from './asset/images/01_logobachkhoasang.png'    
import { FaPhoneAlt } from "react-icons/fa"; 
import {Link} from "react-router-dom";  
import axios from 'axios';

function Login() {
  
    const navigate = useNavigate();
    const [userName,setuserName]=useState('')   
    const [password,setpassword]=useState('')      
    const { user,loginContext, accessRouteRegister, setaccessRouteRegister } = useContext(UserContext);
    const [loading, setLoading] = useState(false); // Thêm trạng thái loading
    const [ListAllCustomer, setListAllCustomer] = useState([]); // Thêm trạng thái loading
      
    const getAllCustomer = async () => {      
      let success = false;
      while (!success) {
        try {
          const response = await axios.get(`${url}/Customer/GetAllCustomers`);    
          const res = response.data;
    
          // Kiểm tra nếu dữ liệu nhận được hợp lệ
          if (res && res.length > 0) {
            setListAllCustomer(res);
            
            // const ListStolen = LoggerData.filter((item) => item.stolen === true);
            // setlistLoggerStolen(ListStolen);
    
            success = true; // Dừng vòng lặp khi dữ liệu hợp lệ và được xử lý
          } else {
  
          }
        } catch (error) {
          console.error('Get All Devices error, retrying...', error);  
          await new Promise(resolve => setTimeout(resolve, 1000)); // Đợi 2 giây trước khi thử lại
        }
      }
    };

    useEffect(()=>{
      getAllCustomer()
    },[])
    
    const handleLogin =  async () => {
           
      if(!userName || !password ){
          toast.error('Bạn chưa nhập mật khẩu')
          return
      }
      setLoading(true); // Bắt đầu trạng thái tải

      let res = await LoginAPI(userName, password)
      console.log('res' , res )
      
      if(Object.keys(res).length === 0){
          toast.error('Đăng nhập không thành công')
          setLoading(false); // Off trạng thái tải   
      }
      else{
            if(user.auth){
              return
            } 

            
      else{     


        const checkName = ListAllCustomer.find((item) => item.userName === userName);
        console.log('checkName',checkName)
        if(checkName){
          sessionStorage.setItem('phoneNumer', checkName.phoneNumber);
          
        }


          loginContext(userName,res)
          sessionStorage.removeItem('accessRegister');  
          setaccessRouteRegister(false)
          toast.success('Đăng nhập thành công')
          navigate('/map')   
      }
      }    
  }

  const handleAccessRouteRegister = () => {
        sessionStorage.setItem('accessRegister', true);
        setaccessRouteRegister(true)
        navigate('/Register');   
  }

  console.log('ListAllCustomer', ListAllCustomer)


  useEffect(() => {
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
           handleLogin();
        }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
        window.removeEventListener("keydown", handleKeyDown);
    };


}, [userName, password]);   


      return (
        <div class="containerLogin">
                    {loading && (
                      <div className="loading-overlay">
                        <div className="loading-spinner"></div>
                      </div>
                    )}    
                  <div className='divLogoSawacoLogin'>
                      <img 
                        src={logosawaco} alt="Example" 
                        width="200" 
                        height="150"    
                      />
                  </div>
                <div class="wrapperLogin">
                  
                  <div class="titleLogin"><span>Đăng nhập tài khoản</span></div>  
                  <div className='formLogin'>
                    <div class="rowLogin">
                      <i class="fas fa-user">
                          <FaUser/>  
                      </i>
                      <input 
                            type="text" placeholder="Tên đăng nhập"          
                            value={userName}
                            onChange={(e)=>setuserName(e.target.value)}
                      />
                    </div>
                    <div class="rowLogin">
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
                    <div class="rowLogin divbutton">
                      <button   
                                className='button-login'
                                onClick={handleLogin}
                                 
                                >
                                
                          Đăng nhập
                      </button>
                  
                    </div>
                    <div class="wrapregisterLogin">    
                        <div className='containerRegisterLogin'>
                          <div className='textDonotRegister'>
                              Bạn chưa đăng ký?  
                          </div>  
                          <Link to="/Register"> 
                            <div        
                                className='buttonRegister'
                                onClick={handleAccessRouteRegister}
                                disabled={loading} // Vô hiệu hóa nút khi đang tải
                                 
                            >
                                Đăng ký ngay  
                            </div> 
                          </Link>
                          
                        </div>
                       
                  
                    </div>

                   
                    
                    
                  </div>
                </div>  
        </div>
        

       
  )
}

export default Login



// import React, { useState, useEffect, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
// import { toast } from 'react-toastify';
// import { LoginAPI } from './services/UserService';
// import './Login.scss';
// import { url } from './services/UserService';
// import { UserContext } from './usercontext';
// import logosawaco from './asset/images/LOGO_SAWACO.png';    
// import { Link } from "react-router-dom";  
// import axios from 'axios';

// function Login() {
//     const navigate = useNavigate();
//     const [userName, setuserName] = useState('');   
//     const [password, setpassword] = useState('');      
//     const { user, loginContext, accessRouteRegister, setaccessRouteRegister } = useContext(UserContext);
//     const [loading, setLoading] = useState(false);
//     const [ListAllCustomer, setListAllCustomer] = useState([]);
//     const [showPassword, setShowPassword] = useState(false);

//     const getAllCustomer = async () => {      
//         let success = false;
//         while (!success) {
//             try {
//                 const response = await axios.get(`${url}/Customer/GetAllCustomers`);    
//                 const res = response.data;
//                 if (res && res.length > 0) {
//                     setListAllCustomer(res);
//                     success = true;
//                 }
//             } catch (error) {
//                 console.error('Get All Devices error, retrying...', error);  
//                 await new Promise(resolve => setTimeout(resolve, 1000));
//             }
//         }
//     };

//     useEffect(() => {
//         getAllCustomer();
//     }, []);
    
//     const handleLogin = async () => {
//         if (!userName || !password) {
//             toast.error('Bạn chưa nhập mật khẩu');
//             return;
//         }
//         setLoading(true);
//         let res = await LoginAPI(userName, password);
//         if (Object.keys(res).length === 0) {
//             toast.error('Đăng nhập không thành công');
//             setLoading(false);
//         } else {
//             const checkName = ListAllCustomer.find((item) => item.userName === userName);
//             if (checkName) {
//                 sessionStorage.setItem('phoneNumer', checkName.phoneNumber);
//             }
//             loginContext(userName, res);
//             sessionStorage.removeItem('accessRegister');  
//             setaccessRouteRegister(false);
//             toast.success('Đăng nhập thành công');
//             navigate('/map');   
//         }
//     };

//     return (
//         <div className="containerLogin">
//             {loading && (
//                 <div className="loading-overlay">
//                     <div className="loading-spinner"></div>
//                 </div>
//             )}  
//             <div className='divLogoSawacoLogin'>
//                 <img src={logosawaco} alt="Example" width="200" height="150" />
//             </div>
//             <div className="wrapperLogin">
//                 <div className="titleLogin"><span>Xí Nghiệp Truyền Dẫn Nước Sạch</span></div>  
//                 <div className='formLogin'>
//                     <div className="rowLogin">
//                         <i className="fas fa-user">
//                             <FaUser/>  
//                         </i>
//                         <input 
//                             type="text" placeholder="Tên đăng nhập"          
//                             value={userName}
//                             onChange={(e) => setuserName(e.target.value)}
//                         />
//                     </div>
//                     <div className="rowLogin">
//                         <i className="fas fa-lock">
//                             <FaLock/>
//                         </i>
//                         <input 
//                             type={showPassword ? "text" : "password"} 
//                             placeholder="Mật khẩu" 
//                             value={password}
//                             onChange={(e) => setpassword(e.target.value)}
//                         />
//                         <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
//                             {showPassword ? <FaEyeSlash /> : <FaEye />}
//                         </span>
//                     </div>
//                     <div className="rowLogin divbutton">
//                         <button className='button-login' onClick={handleLogin}>
//                             Đăng nhập
//                         </button>
//                     </div>
//                     <div className="wrapregisterLogin">    
//                         <div className='containerRegisterLogin'>
//                             <div className='textDonotRegister'>
//                                 Bạn chưa đăng ký?  
//                             </div>  
//                             <Link to="/Register"> 
//                                 <div className='buttonRegister' onClick={() => navigate('/Register')} disabled={loading}>
//                                     Đăng ký ngay  
//                                 </div> 
//                             </Link>
//                         </div>
//                     </div>
//                 </div>
//             </div>  
//         </div>
//     );
// }

// export default Login;

            
    
    
   
   
   
    
    
    