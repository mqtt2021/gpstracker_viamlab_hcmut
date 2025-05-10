import React, { useEffect, useState, useRef,useContext } from 'react'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css'; 
import axios from 'axios';
import './PositionObject.scss'
import { MapContainer, TileLayer,Marker, Popup,useMapEvent,useMap   } from "react-leaflet";
import L from 'leaflet'
import { useMapContext } from './usercontext';
import { ToastContainer } from 'react-toastify';
import {  toast } from 'react-toastify';
import { UserContext } from './usercontext'; 
import { GiPositionMarker } from "react-icons/gi"; 
import { IoMdSettings } from "react-icons/io";
import { RiChatHistoryFill } from "react-icons/ri";
import {Link, useNavigate} from "react-router-dom";
import { useParams } from "react-router-dom";
import { url } from './services/UserService';
import * as signalR from "@microsoft/signalr";
function PositionObject() {       
   
    const {setPercentBattery, makerOpenPopup, setMakerOpenPopup } = useContext(UserContext);
    // const url = 'https://sawacoapi.azurewebsites.net' 
    const positionObject = new L.Icon({ // vị trí GPS khi bị trộm đi qua
        iconUrl: require("./asset/images/position.png" ),
        iconSize: [45,50],
        iconAnchor: [28, 50],// nhỏ thì sang phải, xuống     
        popupAnchor: [3, -40], 
    })   
    
    const [Device, setDevice] = useState({id:'', latitude: 0 , longitude: 0 });

    const [valueFrom, onChangeFrom] = useState(new Date());
    const [valueTo, onChangeTo] = useState(new Date());
    const [selectedOption, setSelectedOption] = useState('');
    const [selectedLogger, setSelecteLogger] = useState({});

    const [Object, setObject] = useState({id:'', latitude: 0 , longitude: 0 });
    const [IDObject, setIDObject] = useState('');  

    const [listPositionWantToDisplay, setListPositionWantToDisplay] = useState([]);
    const [ZOOM_LEVEL, setZOOM_LEVEL] = useState(9)
    const [center, setCenter] = useState({lat: 10.780064402624358,lng: 106.64558796192786 }) // center
    const [begin, setBegin ] = useState({}) 
    const [end, setEnd ] = useState({})   
    const [action, setAction] = useState('')
    const mapRef = useRef() 
    const [displayRoutes, setDisplayRoutes] = useState(false)
    const [isConvertDateTimeInPopup, setisConvertDateTimeInPopup] = useState(false)
    
    const getObjectById = async () => {
      let success = false;
      while (!success) {   
        try {
          const response = await axios.get(`${url}/GPSObject/GetObjectById?id=${id}`);
          const ObjectData = response.data;
    
          // Kiểm tra nếu dữ liệu nhận được hợp lệ
          if (ObjectData) {    
            // const ListStolen = LoggerData.filter((item) => item.stolenLines.length > 0);
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


    const getDeviceById = async () => {
      let success = false;  
      while (!success) {   
        try {
          const response = await axios.get(`${url}/GPSDevice/GetGPSDeviceById?Id=${Object.gpsDeviceId}`);
          const DeviceData = response.data;
    
          // Kiểm tra nếu dữ liệu nhận được hợp lệ
          if (DeviceData) {    
            // const ListStolen = LoggerData.filter((item) => item.stolenLines.length > 0);
            setDevice(DeviceData);     
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

    const {id} = useParams(); // Lấy tham số động từ URL             

    useEffect(() => { 
       
        getObjectById()
        setPercentBattery(0)
        setMakerOpenPopup({})
    }, [])


    useEffect(() => { 
      if(Object.id !== ''){
            getDeviceById();
          
      }   
       
    }, [Object])  

    useEffect(() => { 
      if(Device.id !== ''){
             getAddressFromCoordinates(Device.latitude,  Device.longitude ); 
             
             setCenter({lat: Device.latitude,lng: Device.longitude })
      }
       
    }, [Device])    

    

    useEffect(() => { // Cập nhật bản đồ với giá trị mới của center và ZOOM_LEVEL
        if (mapRef.current) {
              mapRef.current.setView(center, ZOOM_LEVEL);
        }
      }, [center]);

    const currentRoutingRef = useRef(null);
    
    const handleDisplayRoute = (list) => {  // hiển thị đường đi của GPS Tracker
          const lineStolen = list.map((item) => L.latLng(item.latitude, item.longtitude));
  
          currentRoutingRef.current = L.Routing.control({
          waypoints: [
          // L.latLng(ListPositionSafety[0].lat, ListPositionSafety[0].lng),        
              ...lineStolen
          ],
          lineOptions: {
            styles: [
              {
                color: "blue",
                opacity: 1,
                weight: 8
              }
            ]
          },  
          routeWhileDragging: true,   
          addWaypoints: false, 
          draggableWaypoints: false,
          fitSelectedRoutes: false,
          showAlternatives: false,
          show: false,
          createMarker: function() { return null; }        
          });
          currentRoutingRef.current.addTo(mapRef.current);
    }

    const RemoveRoute = () => {   // remove đường đi GPS Tracker
      if (currentRoutingRef.current) {
          currentRoutingRef.current.remove();
          currentRoutingRef.current = null;
      }
    };

    const calculateDistance = (point1, point2) => {
      const latLng1 = L.latLng(point1.latitude, point1.longtitude);
      const latLng2 = L.latLng(point2.latitude, point2.longtitude);
      const distance = latLng1.distanceTo(latLng2);     
      return distance;
    };

    // const handleChange = (event) => { // Chọn Logger để xem lịch sử
    //     const PositionObjectStolen = listLoggerStolenPositionObject.find((item,index) => item.id === event.target.value )
    //     setSelecteLogger(PositionObjectStolen)
    //     setSelectedOption(event.target.value);
    // };

    // useEffect(() => {
    //      if(action === 'Delete'){
    //           const PositionObjectStolen = listLoggerStolenPositionObject.find((item,index) => item.id === selectedLogger.id )
    //           setSelecteLogger(PositionObjectStolen)
    //      }
    //      if(action === 'See'){

    //      }
    // },[action,listLoggerStolenPositionObject])

    useEffect(() => {
         if(action === 'Delete'){
          setListPositionWantToDisplay([]);
          setDisplayRoutes(false);          
         }
         if(action === 'See'){

         }
    },[selectedLogger])



    function changeDateToFixed(timestamp) {
      const parts = timestamp.split('T');
      const part2 = parts[0].split('-');
      const newTimestamp = `${part2[0]}-${part2[2]}-${part2[1]}T${parts[1]}`;
      return newTimestamp;
    }
  
    function findMinMaxTimestamps(filteredLines) {
      let minObj = filteredLines[0];
      let maxObj = filteredLines[0];
      filteredLines.forEach(item => {

        const currentTimestamp = new Date(item.timestamp);

        if (currentTimestamp < new Date(minObj.timestamp)) {
          minObj = item;
        }
    
        if (currentTimestamp > new Date(maxObj.timestamp)) {
          maxObj = item;
        }
      });
    
      return { min: minObj, max: maxObj };
    }
   


    const handleShowRoute = () => { 
        if(selectedOption === ''){
                    toast.error('Bạn chưa chọn trạm cần xem')
        }
        else{
            const startOfDay = new Date(valueFrom);                      
            const endOfDay = new Date(valueTo);

            if(startOfDay < endOfDay){
              if( endOfDay < new Date('2024-10-02T23:59:59') || startOfDay > new Date('2024-10-14T13:30:00')    ){  // giữ nguyên không convert khi lọc nhưng convert ở popup
                
                setisConvertDateTimeInPopup(true)

                const filteredLines = selectedLogger.stolenLines.filter(line => {                                     
                      const timestamp = new Date(line.timestamp);
                      return timestamp >= startOfDay && timestamp <= endOfDay;
                });

                if(filteredLines.length === 0){
                  toast.error('Không có dữ liệu')
                  setListPositionWantToDisplay([])
                  setDisplayRoutes(false);    
                }  
                else{
                    setBegin(findMinMaxTimestamps(filteredLines).min)
                    setEnd(findMinMaxTimestamps(filteredLines).max)
                    const newArr = filteredLines.filter(item => item !== findMinMaxTimestamps(filteredLines).min && item !== findMinMaxTimestamps(filteredLines).max);
                    setListPositionWantToDisplay(newArr);
                    setDisplayRoutes(true); 
                    setCenter({lat: 10.736910478129415 , lng: 106.66432499334259 })
                    setZOOM_LEVEL(9)
                }
              }    

              else{  // convert khi lọc nhưng không convert ở popup
                
                setisConvertDateTimeInPopup(false)
                
                const LineAfterConvert = selectedLogger.stolenLines.map(item => {                                     
                      const newItem = convertDateTimeToFilter(item);
                      return newItem
                });

                const filteredLines = LineAfterConvert.filter(line => {                                     
                      const   timestamp = new Date(line.timestamp);
                      return  timestamp >= startOfDay && timestamp <= endOfDay;
                });

                if(filteredLines.length === 0){
                  toast.error('Không có dữ liệu')
                  setListPositionWantToDisplay([]);
                  setDisplayRoutes(false); 
                }  
                else{
                    setBegin(findMinMaxTimestamps(filteredLines).min)
                    setEnd(findMinMaxTimestamps(filteredLines).max)
                    const newArr = filteredLines.filter(item => item !== findMinMaxTimestamps(filteredLines).min && item !== findMinMaxTimestamps(filteredLines).max);
                    setListPositionWantToDisplay(newArr);
                    setDisplayRoutes(true); 
                    setCenter({lat:10.80896076479404 , lng: 106.68593859151143 })
                    setZOOM_LEVEL(9)
                }
              }
            }
            else{
              toast.error('Thời gian không hợp lệ')
            }                    
        }
    }

      const handleShowRouteAfterDelete = () => { 
      if(selectedOption === ''){
        toast.error('Bạn chưa chọn trạm cần xem')
      }
      else{
          const startOfDay = new Date(valueFrom);         
          const endOfDay = new Date(valueTo);
          const filteredLines = selectedLogger.stolenLines.filter(line => {
                  const timestampformat = changeDateToFixed(line.timestamp) 
                  const timestamp = new Date(timestampformat);
                  return timestamp >= startOfDay && timestamp <= endOfDay;
          });

          if(filteredLines.length === 0){
              window.alert('Không có dữ liệu handleShowRouteAfterDelete')
          }  
          else{
              setBegin( filteredLines[0] )
              setEnd(filteredLines[filteredLines.length-1] )
              const newArr = filteredLines.slice(1, -1);
              setListPositionWantToDisplay(newArr);
              setDisplayRoutes(true); 
              setCenter({lat:filteredLines[0].latitude , lng: filteredLines[0].longtitude })
              setZOOM_LEVEL(18)
          }   
      }
  }

    const handleMapClickGetLocation = (e) => {  // lấy tọa độ khi Click vô Map
      console.log('lat: '+ e.latlng.lat)
      console.log('lng: '+ e.latlng.lng)
    };

    // const executeFunctions = async () => {
    //   await  getLogger();       // Cập nhật lại danh sách Logger
    //   setAction('Delete')      // Sau đó thực hiện hàm tiếp theo
    // };  

    const handleDeleteRoutes = async () => {
    if (selectedOption === '') {
      toast.error('Bạn chưa chọn trạm cần xóa')
    } else {
      
        // Hiển thị cửa sổ xác nhận
        const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa các dữ liệu này không?');

        if (confirmDelete) {

            const startOfDay = new Date(valueFrom);
            const endOfDay = new Date(valueTo);
            if(startOfDay < endOfDay){

                const filteredLines = selectedLogger.stolenLines.filter(line => {
                const timestamp = new Date(line.timestamp);
                return timestamp >= startOfDay && timestamp <= endOfDay;
                }); 

                if(filteredLines.length > 0){
                  const startDate = formatDateTime(valueFrom);
                  const endDate = formatDateTime(valueTo);
                  const loggerId = selectedLogger.id;                             
                  try {
                      // Gọi API để xóa các phần tử trong stolenLine theo ngày
                      const response = await axios.delete(`${url}/StolenLine/DeleteStolenLineByDate/LoggerId=${loggerId}?startDate=${startDate}&endDate=${endDate}`);
                      
                      if (response.status === 200) {
                         
                          toast.success('Xóa thành công!');                                           
                          // executeFunctions();
                         
                          
                          
                      } else {
                          toast.error('Có lỗi xảy ra khi xóa!');
                      }
                  } catch (error) {
                      console.error('Lỗi khi gọi API xóa:', error);
                      toast.error('Có lỗi xảy ra khi xóa!');
                  }
    
                }
                else{
                      toast.error('Không có dữ liệu');
                }
            }
            else{
              toast.error('Thời gian không hợp lệ')
            }
        } else {
     
        }
    }
    }

    function convertDateTimeBefore(inputString) {
      const [date, time] = inputString.split('T');    
      const [year, month, day] = date.split('-');
      return `${day}-${month}-${year} ${time}`;
    }
    
    function convertDateTimeAfter(inputString) {
      const [date, time] = inputString.split(' ');    
      const [year, month, day] = date.split('-');
      return `${day}-${month}-${year} ${time}`;
    }

    function convertDateTimeToFilter(ObjectItem) {
      const [date, time] = ObjectItem.timestamp.split('T');    
      const [year, day, month] = date.split('-');    
      return {...ObjectItem, timestamp : `${year}-${month}-${day} ${time}` };
    }
   

  const formatDateTime = (date) => {
    if (!date) return "No date selected";
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };


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



  useEffect( () => {
        let connection = new signalR.HubConnectionBuilder()   
            .withUrl("https://mygps.runasp.net/NotificationHub")    
            .withAutomaticReconnect()    
            .build();     
        // Bắt đầu kết nối   
        connection.start()   
            .then(() => {  
              console.log("✅ Kết nối SignalR thành công!");     
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
          setTimeout(() => {
            getDeviceById();  
          }, 5000);                   
        });               
  
      }, [] )


  return (   
    <div className='PositionObject'> 
      <div className='wrapPositionObject'>
                <div className='SettingTitle'>   
                    <div className='SettingTitleItem'>
                          {Object.connected ? `Vị trí ${Object.name}` : `Lộ trình ${Object.name}`}  
                    </div> 
                </div>
            
                  <div className='mapStolenLine'>             
              <MapContainer 
                          center={center} 
                          zoom={ZOOM_LEVEL}     
                          ref={mapRef}>




                         {/* Div hiển thị trên bản đồ */}
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
                          </div>

                 
                        <TileLayer
                             attribution ='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            
                        />
                        <MyClickHandlerGetLocation onClick={handleMapClickGetLocation}/>                                                           
                                {/* {displayRoutes &&  listPositionWantToDisplay.map((item,index)=>(
                                  <Marker 
                                      className='maker'
                                      position={[item.latitude , item.longtitude]}
                                      icon= { positionWarning } 
                                      key={ index }                               
                                  >
                                    <Popup>
                                        <div className='div-popup'>  
                                            <div>{ isConvertDateTimeInPopup ? convertDateTimeBefore(item.timestamp) : convertDateTimeAfter(item.timestamp)}</div>                                                                    
                                        </div>                                                                             
                                    </Popup>    
                                  </Marker>
                                ))}  */}
                                
                               
                                  <Marker 
                                      className='maker'
                                      position={[Device.latitude, Device.longitude]}      
                                      icon= { positionObject }     
                                      zIndexOffset={ 1000 } 
                                                                  
                                  >
                                    {/* <Popup>   
                                        <div className='div-popup'>
                                        <div>{ isConvertDateTimeInPopup ? convertDateTimeBefore(begin.timestamp) : convertDateTimeAfter(begin.timestamp)}</div>                                                                
                                        
                                        
                                        </div>                                                                             
                                    </Popup>     */}
                                </Marker>
                               
                                {/* {displayRoutes && 
                                  <Marker 
                                      className='maker'    
                                      position={[end.latitude , end.longtitude]}
                                      icon= { endMarker }
                                      zIndexOffset={  1000 } 
                                                                  
                                  >
                                    <Popup>
                                        <div className='div-popup'>
                                            <div>{ isConvertDateTimeInPopup ? convertDateTimeBefore(end.timestamp) : convertDateTimeAfter(end.timestamp)}</div>                                                                    
                                        </div>                                                                             
                                    </Popup>    
                                </Marker>
                                }  */}


                    </MapContainer>
      </div>
      <div className='filter'>        
                     <div className='filterItem'>  
                                <div className='filterItemdiv'>
                                  <Link to={`/HistoryObject/${id}`}>
                                    <div className = 'itemObjectSecondItem'>
                                      <div>
                                          <RiChatHistoryFill className='itemObjectSecondItemIcon'/>
                                      </div>
                                      <div className='itemObjectSecondItemText'>
                                          Lộ trình    
                                      </div>
                                    </div>
                                  </Link>
                                </div>

                                <div className='filterItemdiv'>   
                                  <Link to={`/SafeArea/${id}`}>        
                                    <div className = 'itemObjectSecondItem'>
                                      <div>
                                          <GiPositionMarker className='itemObjectSecondItemIcon'/>
                                      </div>
                                      <div className='itemObjectSecondItemText'>
                                          Vùng an toàn  
                                      </div>
                                    </div>
                                  </Link>
                                </div>

                                {/* <div className='filterItemdiv'>
                                   <Link to={`/Objects/Setting/${id}`}>        
                                    <div className = 'itemObjectSecondItem'>
                                      <div>
                                          <IoMdSettings className='itemObjectSecondItemIcon'/>
                                      </div>
                                      <div className='itemObjectSecondItemText'>  
                                          Thiết lập thiết bị  
                                      </div>
                                    </div>
                                  </Link>  
                                </div>    */}
                         
                                                            
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
                        containerId="PositionObject"
                        

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
export default PositionObject    
