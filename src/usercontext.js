import React,{useState} from "react";
import { createContext } from "react";
import axios from 'axios';
export const UserContext =createContext({ email: '', auth: false });
    
const UserProvider = ({ children }) => {

  const [center, setCenter] = useState({ lat: 10.81993366729437,lng: 106.69843395240606  });
  const [zoomLevel, setZoomLevel] = useState(18);
  const [percentBattery, setPercentBattery] = useState(0);   
  const [getPositionUser, setGetPositionUser] = useState(false);
  const [makerOpenPopup, setMakerOpenPopup] = useState({});
  const [pressPositionWarning, setPressPositionWarning] = useState(false); 
  const [pressPercentBattery, setPressPercentBattery] = useState(false); 
  const [changeNameFromMapToHeader, setChangeNameFromMapToHeader] = useState(false); 
  const [getLoggerStolen, setgetLoggerStolen] = useState(false); 
  const [displayNav, setDisplayNav] = useState(false); 
  const [displayRoutesTwoPoint, setDisplayRoutesTwoPoint] = useState(false); 
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const [listNotifications, setListNotifications] = useState([]);
    const [listAllDevices,setlistAllDevices] = useState([]) ;     
    const [inforCustomer, setInforCustomer] = useState({})   ;
    const [phoneNumberCustomer, setPhoneNumberCustomer] = useState('')   ;
    const [listObject, setlistObject] = useState([]) ;

    const [unreadCount, setUnreadCount] = useState(0);

  const [user, setUser] = React.useState({ email: '', auth: false });
  const [displayRouteRepair, setdisplayRouteRepair] = useState(false);
  const [displayRouteFull, setdisplayRouteFull] = useState(false);
  const [UserLogin, setUserLogin] = useState({});
  const [token, setToken] = useState('');
  const [AllBins, setAllBins] = useState([]);
  const [LoginTotal, setLoginTotal] = useState(null);
  const [accessRouteRegister, setaccessRouteRegister] = useState(false);
  const [accessRouteOTP, setaccessRouteOTP] = useState(false);

  const [idObjectConnect, setidObjectConnect] = useState('');
  



  const loginTotalLogin = (people) => {
    sessionStorage.setItem('totalLogin', people);
    setLoginTotal(people)
  };
  const logoutTotalLogin = () => {
    sessionStorage.removeItem('totalLogin');
    setLoginTotal(null)
  };

  const loginContext = (userName, res) => {
    sessionStorage.setItem('email', userName);
    sessionStorage.setItem('token', res);
    setToken(res)
    setUser((user) => ({
      email: userName,
      auth: true,
    }));
    
  };

  const logout = () => {
    sessionStorage.removeItem('email');
    setUser((user) => ({
      email: '',
      auth: false,
    }));
  };

  const handelRepair=()=>{
    setdisplayRouteRepair(pre=>!pre)
  }
  const handleFull=()=>{
    setdisplayRouteFull(pre=>!pre)
  }

  return (
    <UserContext.Provider value={{ user, loginContext, logout, 
    displayRouteFull, displayRouteRepair, handelRepair, handleFull, 
    UserLogin, setUserLogin, token, setToken, AllBins, setAllBins, loginTotalLogin, logoutTotalLogin, LoginTotal, setLoginTotal,
    center,setCenter, zoomLevel, setZoomLevel ,percentBattery, setPercentBattery,
    getPositionUser, setGetPositionUser,makerOpenPopup, setMakerOpenPopup,pressPositionWarning, setPressPositionWarning,
    pressPercentBattery, setPressPercentBattery,changeNameFromMapToHeader, setChangeNameFromMapToHeader,getLoggerStolen, setgetLoggerStolen,
    displayNav, setDisplayNav, displayRoutesTwoPoint, setDisplayRoutesTwoPoint,isButtonDisabled, setIsButtonDisabled,
    accessRouteRegister, setaccessRouteRegister, idObjectConnect, setidObjectConnect, listAllDevices,setlistAllDevices,
    inforCustomer, setInforCustomer, phoneNumberCustomer, setPhoneNumberCustomer, listObject, setlistObject ,
    unreadCount, setUnreadCount, accessRouteOTP, setaccessRouteOTP, listNotifications, setListNotifications
     }}>
      {children}    
    </UserContext.Provider>
  );
};
export default UserProvider


