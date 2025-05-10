import React, { useEffect, useState, useRef,useContext } from 'react'
import 'react-datepicker/dist/react-datepicker.css';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css'; 
import axios from 'axios';
import './SafeAreaAddObject.scss'
import { MapContainer, TileLayer,Marker,useMapEvent , Circle    } from "react-leaflet";
import L from 'leaflet'
import { ToastContainer } from 'react-toastify';
import {  toast } from 'react-toastify';
import { UserContext } from './usercontext';  
import { useParams } from "react-router-dom";
import { url } from './services/UserService';    
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import useGeoLocation from "./useGeoLocation"

function SafeAreaAddObject() {                
  const locationUser = useGeoLocation()  // lấy vị trí của người thay pin
    const PositionSafe = new L.Icon({ // vị trí GPS khi bị trộm đi qua
        iconUrl: require("./asset/images/maker_user.png" ),
        iconSize: [50,50],
        iconAnchor: [25, 40],// nhỏ thì sang phải, xuống     
        popupAnchor: [3, -40], 
    })      
    const [isDisplayCircle, setisDisplayCircle] = useState(false); // Thêm trạng thái loading
    const [loading, setLoading] = useState(false); // Thêm trạng thái loading
    const [Object, setObject] = useState({id:'', latitude: 0 , longitude: 0 , safeRadius: 0 });
    const [ObjectClick, setObjectClick] = useState({ latitude: 0 , longitude: 0 });
    const [ZOOM_LEVEL, setZOOM_LEVEL] = useState(17)
    const [center, setCenter] = useState({lat: 10.780064402624358,lng: 106.64558796192786 }) // center
    //const [center, setCenter] = useState({lat: locationUser.coordinates.latitude ,lng: locationUser.coordinates.longtitude }) // center
    const mapRef = useRef()
    const {id} = useParams(); // Lấy tham số động từ URL
    
    const [Device, setDevice] = useState({id:'', latitude: 0 , longitude: 0 });


    useEffect(()=>{
        if(locationUser.coordinates.latitude > 0){
          setCenter({lat: locationUser.coordinates.latitude ,lng: locationUser.coordinates.longtitude })
        }
    },[locationUser])

    const getDeviceById = async (id) => { 
      let success = false;
      while (!success) {   
        try {
          const response = await axios.get(`${url}/GPSDevice/GetGPSDeviceById?Id=${id}`);         
          const DeviceData = response.data;
    
          // Kiểm tra nếu dữ liệu nhận được hợp lệ
          if (DeviceData) {    
            // const ListStolen = LoggerData.filter((item) => item.stolenLines.length > 0);
            setDevice(DeviceData); 
            //console.log(DeviceData)       
            success = true; // Dừng vòng lặp khi dữ liệu hợp lệ và được xử lý
          } else {
            alert('ReLoad');
          }
        } catch (error) {
          console.error('getDeviceById error, retrying...', error);  
          await new Promise(resolve => setTimeout(resolve, 1000)); // Đợi 2 giây trước khi thử lại
        }
      }
    };
    
    
    const getObjectById = async () => {
      let success = false;
      while (!success) {   
        try {
          const response = await axios.get(`${url}/GPSObject/GetObjectById?id=${id}`);
          const ObjectData = response.data;
    
          // Kiểm tra nếu dữ liệu nhận được hợp lệ
          if (ObjectData) {    
            // const ListStolen = LoggerData.filter((item) => item.stolenLines.length > 0);
            
            if(ObjectData.connected){
                await getDeviceById(ObjectData.gpsDeviceId)
            }
            
            setObject(ObjectData);     
            success = true; // Dừng vòng lặp khi dữ liệu hợp lệ và được xử lý
          } else {
            alert('ReLoad');
          }
        } catch (error) {
          console.error('Get All Logger error, retrying...', error);
          await new Promise(resolve => setTimeout(resolve, 1000)); // Đợi 2 giây trước khi thử lại
        }
      }
    };

    const callAPIUpdateObjectById = async () => {
      let success = false;
      while (!success) {   
        try {
          const response = await axios.patch(`${url}/GPSObject/UpdateObjectInformation?ObjectId=${id}`, 

            {
              "Longitude": ObjectClick.longitude,   
              "Latitude": ObjectClick.latitude,  
              "SafeRadius": radius,  
              "CurrentTime": "0001-01-01T00:00:00",   
              "AlarmTime": Device.alarmTime,     
              "BlueTooth": "OFF",                
              "Buzzer": "OFF",    
              "Emergency": Device.emergency,
              "PhoneNumber": Device.customerPhoneNumber 
            }
          );  
          const ObjectData = response.data;
          // Kiểm tra nếu dữ liệu nhận được hợp lệ
          if (ObjectData) {      
            // const ListStolen = LoggerData.filter((item) => item.stolenLines.length > 0);
            setLoading(false)
            setisDisplayCircle(false)
            toast.success('Xác lập vùng an toàn thành công')   

            success = true; // Dừng vòng lặp khi dữ liệu hợp lệ và được xử lý
          } else {  
            toast.error('Xác lập không thành công')      
          }
        } catch (error) {
          console.error('Get All Logger error, retrying...', error);
          await new Promise(resolve => setTimeout(resolve, 1000)); // Đợi 2 giây trước khi thử lại
        }
      }
    };

    useEffect(() => { 
        getObjectById()
    }, [])

    useEffect(() => { 
      if(Object.id !== '' && Object.safeRadius > 0){  
          setObjectClick({ latitude: Object.latitude , longitude: Object.longitude })
          setRadius(Object.safeRadius)  
          setCenter({lat: Object.latitude ,lng: Object.longitude })  
          setisDisplayCircle(true)
      } 
    }, [Object])

    useEffect(() => { // Cập nhật bản đồ với giá trị mới của center và ZOOM_LEVEL
        if (mapRef.current) {
              mapRef.current.setView(center, ZOOM_LEVEL);  
        }
      }, [center]);

  const [circle, setCircle] = useState(null);
  const [radius, setRadius] = useState(10); // Khởi tạo bán kính hình tròn (500m)
  // const [latLng, setLatLng] = useState(null); // Vị trí click trên bản đồ

    const handleMapClickGetLocation = (e) => {  // lấy tọa độ khi Click vô Map

      setObjectClick({  latitude: e.latlng.lat , longitude: e.latlng.lng  })
      

      const { lat, lng } = e.latlng;
      // setLatLng({ lat, lng });
      // setCenter({ lat, lng });
  
      // Xóa hình tròn nếu có
      if (circle) {
        circle.remove();
      }
  
      // Tạo hình tròn mới với bán kính hiện tại
      const newCircle = L.circle([lat, lng], { radius });
      newCircle.addTo(e.target);
      setCircle(newCircle);


      console.log('lat: '+ e.latlng.lat)
      console.log('lng: '+ e.latlng.lng)
    };

    const handleRadiusChange = (e) => {
      const newRadius = e.target.value;
      setRadius(newRadius);
  
      // Cập nhật bán kính của hình tròn
      if (circle) {
        circle.setRadius(newRadius);
      }
    };

    const handleSetRadius = ( ) => {
      setLoading(true); // Bắt đầu trạng thái tải  
      callAPIUpdateObjectById()

    }

  return (   
    <div className='SafeArea'>
                    {loading && (
                      <div className="loading-overlay">
                        <div className="loading-spinner"></div>
                      </div>
                    )} 
      <div className='wrapSafeArea'>
                <div className='TitleSafeArea'>   
                    <div className='TitleSafeAreaItem'>
                          Vùng an toàn {Object.name}   
                    </div> 
                </div>
            
                <div className='mapStolenLine'>             
                  <MapContainer    
                          center={center} 
                          zoom={ZOOM_LEVEL}     
                          ref={mapRef}>
                        <TileLayer
                             attribution ='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"                           
                        />
                        <MyClickHandlerGetLocation onClick={handleMapClickGetLocation}/>             

                        {isDisplayCircle &&                         
                        <Circle
                          center={ {lat: Object.latitude,lng: Object.longitude } }  
                          radius={Object.safeRadius}
                          pathOptions={{ color: "red", fillColor: "pink", fillOpacity: 0.5 }}
                        />}


                        {ObjectClick.latitude > 0 && (
                            <Marker 
                                    position={[ObjectClick.latitude , ObjectClick.longitude]}
                                    icon= { PositionSafe } 
                                    zIndexOffset={ 1000 }   
                            >
                             
                            </Marker>
                        )}
                             
                                                                                                                                       
                  </MapContainer>
      </div>
      <div className='filter'>        
                   
                     <div className='filterItem'>
                            
                                <input
                                      type="range"
                                      id="radiusSlider"
                                      min="0"
                                      max="500"
                                      step="1"
                                      value={radius}
                                      onChange={handleRadiusChange}
                                />
                                    <span>{radius} m</span>


                                    <div className='wrapBatteryItem' >
                                      <button 
                                          type="button" 
                                          class="btn btn-danger"
                                          onClick={handleSetRadius}
                                        
                                      >Xác nhận</button>
                                    </div>                                                                                                                                                     
                     </div>

                  </div>
      </div>                       
     
              

     
      <ToastContainer
                        position="top-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="light"
                        containerId="SafeArea"
                        

                     />
    </div>
  )
}
function MyClickHandlerGetLocation({ onClick }) {
  const map = useMapEvent('click', (e) => {
    onClick(e);
  });
  return null;   
  } 
export default SafeAreaAddObject      
