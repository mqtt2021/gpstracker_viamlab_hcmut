import React, { useEffect, useState, useRef,useContext } from 'react'
import 'react-datepicker/dist/react-datepicker.css';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css'; 
import axios from 'axios';
import './SafeArea.scss'
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
import * as signalR from "@microsoft/signalr";


function SafeArea() {                   
  const locationUser = useGeoLocation()  // lấy vị trí của người thay pin
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);    
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
    const timeoutRef = useRef(null);   
    const [DeviceMaker, setDeviceMaker] = useState({id:'', latitude: 0 , longitude: 0 });
    // useEffect(() => {
    //   if (!locationUser.loaded) {
    //     toast.warn("Vui lòng bật vị trí để tiếp tục.");
    //     return; // Chờ đến khi locationUser cập nhật
    //   }
    //   // Xóa timeout cũ trước khi tạo mới
    //   if (timeoutRef.current) {
    //       clearTimeout(timeoutRef.current);
    //   }
  
    //   // Hàm này sẽ được gọi nếu không có vị trí trong 10 giây
    //   const onTimeout = () => {
    //       console.log("Không có vị trí trong 10 giây, thực hiện hành động mặc định");
    //       setCenter({ lat: 10.88456, lng: 106.7818 });
    //       setZOOM_LEVEL(9);
    //   };
  
    //   // Tạo timeout mới
    //   timeoutRef.current = setTimeout(onTimeout, 10000);
  
    //   // ✅ Kiểm tra trước khi truy cập tọa độ
    //   if (locationUser.coordinates && locationUser.coordinates.latitude) {
    //       setCenter({
    //           lat: locationUser.coordinates.latitude,
    //           lng: locationUser.coordinates.longtitude,
    //       });
    //       clearTimeout(timeoutRef.current); // Hủy timeout nếu có vị trí
    //       toast.success("Lấy được vị trí");
    //   } else {
    //       console.log("Trình duyệt không hỗ trợ geolocation hoặc bị chặn");
    //       toast.warn("Vui lòng bật vị trí để tiếp tục.");
    //   }
  
    //   return () => clearTimeout(timeoutRef.current);
    // }, [locationUser]);
  
  

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
              "BlueTooth": Device.bluetooth,                
              "Buzzer": "OFF",        
              "Sleep": false,   
              "Threshold": 50,     
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


     // Hàm được gọi nếu sau 10 giây không có vị trí
  const onTimeout = () => {
    console.log("Không có vị trí trong 10 giây, thực hiện hành động mặc định");
    // Thực hiện hành động mặc định khi không có vị trí
    // Ví dụ: setCenter một vị trí mặc định   
    setCenter({lat: 10.780064402624358,lng: 106.64558796192786 });
    setZOOM_LEVEL(9)
  };

  // Hàm được gọi nếu có vị trí
  const onLocationSuccess = (position) => {
    console.log("Vị trí đã được bật:", position);
    setCenter({ lat: position.coords.latitude, lng: position.coords.longitude });
    
  };

  const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

    useEffect(() => { 
      if(Object.id !== '' && Object.latitude !==  23.4){  
          setObjectClick({ latitude: Object.latitude , longitude: Object.longitude })
          setRadius(Object.safeRadius)  
          setCenter({lat: Object.latitude ,lng: Object.longitude })  
          setisDisplayCircle(true)

      } 
      if(Object.id !== '' && Object.latitude ===  23.4){

        // Sử dụng
        delay(5000).then(() => {
          console.log('Đã chờ 5 giây');
        });

        console.log('locationUser.loaded',locationUser.loaded)

        if(locationUser.loaded){

        }
        else{
         
        }

        // Nếu Object không hợp lệ, hiển thị thông báo yêu cầu bật vị trí
           

            // Kiểm tra vị trí sau 10 giây
            const timeout = setTimeout(() => {
              // Nếu sau 10 giây không có vị trí, gọi hàm timeout
              onTimeout();
            }, 10000); // 10 giây
          
            // Kiểm tra xem người dùng có bật vị trí không
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  // Nếu có vị trí, hủy timeout và gọi hàm success
                  clearTimeout(timeout);
                  onLocationSuccess(position);
                },
                (error) => {
                  // Nếu có lỗi khi lấy vị trí, hủy timeout và gọi hàm timeout
                  clearTimeout(timeout);
                  console.error("Lỗi khi lấy vị trí:", error);
                  toast.warn('Hãy bật vị trí của bạn');
                  onTimeout();
                }
              );
            } else {
              console.log("Trình duyệt không hỗ trợ geolocation");
              onTimeout();
            }

      }
    }, [Object, locationUser]) 

 

    

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


    function extractCoordinates(message) {
      const match = message.match(/Longitude:\s*([\d.-]+);\s*Latitude:\s*([\d.-]+)/);
      if (match) {

        setDevice(pre => ({   
          ...pre, // Giữ nguyên các giá trị cũ
          latitude: parseFloat(match[2]), 
          longitude: parseFloat(match[1])
        }));  

        setCenter({lat: parseFloat(match[2]),lng: parseFloat(match[1]) })
        setZOOM_LEVEL(18)   
      }
    }


     useEffect( () => {
    
          let connection = new signalR.HubConnectionBuilder()   
          .withUrl("https://mygps.runasp.net/NotificationHub")       
          .withAutomaticReconnect()    
          .build(); 
    
              // Bắt đầu kết nối   
              connection.start()   
                  .then(() => {  
                    console.log("✅ Kết nối SignalR Position Device thành công!");     
                               // Lắng nghe các sự kiện cho từng thiết bị
                  })
                  .catch(err => {
                      console.error('Kết nối thất bại: ', err);
                  });
              // Lắng nghe sự kiện kết nối lại
              connection.onreconnected(connectionId => {
                  console.log(`Kết nối lại thành công. Connection ID: ${connectionId}`);
              });
              // Lắng nghe sự kiện đang kết nối lại
              connection.onreconnecting(error => {
                  console.warn('Kết nối đang được thử lại...', error);
              });
        
          
    
          connection.on(`SendNotification${Device.id}`, data => {
            const obj = JSON.parse(data);
            console.log(`📡 Dữ liệu từ thiết bị ${Device.id}:`, obj);
             // Đợi 2 giây trước khi gọi getNotification
    
             extractCoordinates(obj.Description)          
          });
          
          // Cleanup khi component unmount hoặc khi Device thay đổi
        return () => {
          console.log("🔴 Ngắt kết nối SignalR...");
          connection.stop();
        };
    
        }, [Device] )



      const [address, setAddress] = useState("");
      const getAddressFromCoordinates = async (lat, lon) => {
      try {   
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
        );
        const data = response.data;
        setAddress(data.display_name || "Không tìm thấy địa chỉ");
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        setAddress("Đang xác định vị trí");      
      }    
    };



        useEffect(() => { 
              setCenter({lat: DeviceMaker.latitude,lng: DeviceMaker.longitude })
              getAddressFromCoordinates(DeviceMaker.latitude,  DeviceMaker.longitude );   
            }, [DeviceMaker])

  
  console.log(Object)  
  console.log(Device)
  
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

                           {/* Div hiển thị trên bản đồ
                          <div style={{
                            position: "absolute",
                            top: "10px",  
                            left: "50%",
                            transform: "translateX(-50%)",
                            background: "rgba(255, 255, 255, 0.9)",
                            padding: "10px 20px",
                            borderRadius: "8px",
                            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
                            zIndex: 1000,
                            fontWeight: "bold",
                             width: "75%",  // Tự mở rộng theo nội dung
                            textAlign: "center"
                          }}>
                            {Device.latitude > 0 ? `Vị trí: ${address}` : `Chưa ghi nhận vị trí`}
                          </div> */}


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


                            <Marker 
                                    position={[Device.latitude , Device.longitude]}
                                    icon= { PositionSafe } 
                                    zIndexOffset={ 1000 }      
                            >   
                             
                            </Marker>  


                        {/* {ObjectClick.latitude > 0 && (
                            <Marker 
                                    position={[ObjectClick.latitude , ObjectClick.longitude]}
                                    icon= { PositionSafe } 
                                    zIndexOffset={ 1000 }   
                            >
                             
                            </Marker>
                        )} */}
                               
                                                                                                                                       
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
export default SafeArea    
