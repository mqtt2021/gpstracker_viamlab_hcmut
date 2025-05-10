import { Route,Routes } from 'react-router-dom';
import React,{useContext,useEffect} from 'react'
import Map from './Map';
import History from './History';
import './routes.scss'  
import { UserContext } from './usercontext';
import Devices from './Devices';
import Setting from './Setting';
import Detail from './Detail';
import ObjectTracking from './ObjectTracking';
import AddObjectTracking from './AddObjectTracking';
import Objects from './Objects';
import InforObject from './InforObject';
import PositionDevice from './PositionDevice';
import HistoryDevice from './HistoryDevice ';
import Notification from './Notification';
import PositionObject from './PositionObject';
import EditInforObject from './EditInforObject';
import AddObject from './AddObject';
import SafeArea from './SafeArea';
import HistoryObject from './HistoryObject';  
import DetailObject from './DetailObject';
import SafeAreaAddObject from './SafeAreaAddObject';
function AppRoutes() {

  const { user , loginContext, token, setToken, loginTotalLogin, logoutTotalLogin, LoginTotal } = useContext(UserContext);
  
  useEffect(()=>{
    const emailSessionStorage = sessionStorage.getItem('email');
    const tokenSessionStorage = sessionStorage.getItem('token');
  
    if(emailSessionStorage){
      loginContext(emailSessionStorage,tokenSessionStorage)
      setToken(tokenSessionStorage)
    }
    
  },[])

  return (
    <div className='routes'>
            <Routes>   
                {user && user.auth ? <Route path="/map" element={ <Map/>} /> : '' }
                {user && user.auth ? <Route path="/History" element={ <History/>} /> : '' }
                {user && user.auth ? <Route path="/Devices" element={ <Devices/>} /> : '' }
                {user && user.auth ? <Route path="/Devices/Setting/:id" element={<Setting/>}/> : '' }   
                {user && user.auth ? <Route path="/Devices/Setting/:id/Detail" element={<Detail/>} /> : '' }
                {user && user.auth ? <Route path="/Devices/Setting/:id/ObjectTraking" element={<ObjectTracking/>} /> : '' }
                {user && user.auth ? <Route path="/AddObjectTracking" element={<AddObjectTracking/>} /> : '' }
                {user && user.auth ? <Route path="/Objects" element={<Objects/>} /> : '' }
                {user && user.auth ? <Route path="/Object/Setting/:id" element={<DetailObject/>} /> : '' }
                {user && user.auth ? <Route path="/InforObjects" element={<InforObject/>} /> : '' }
                {user && user.auth ? <Route path="/Devices/Position/:id" element={<PositionDevice/>} /> : '' }
                {user && user.auth ? <Route path="/HistoryDevice/:id" element={<HistoryDevice/>} /> : '' }
                {user && user.auth ? <Route path="/HistoryObject/:id" element={<HistoryObject/>} /> : '' }   
                {user && user.auth ? <Route path="/Notification" element={<Notification/>} /> : '' }    
                {user && user.auth ? <Route path="/PositionObject/:id" element={<PositionObject/>} /> : '' }    
                {user && user.auth ? <Route path="/EditInforObject" element={<EditInforObject/>} /> : '' }    
                {user && user.auth ? <Route path="/AddObject" element={<AddObject/>} /> : '' }   
                {user && user.auth ? <Route path="/SafeArea/:id" element={<SafeArea/>} /> : '' }   
                {user && user.auth ? <Route path="/SafeAreaAddObjet" element={<SafeAreaAddObject/>} /> : '' }   
            </Routes>          
    </div>
  )
}

export default AppRoutes
