import React, { useEffect, useState, useRef,useContext } from 'react'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css'; 
import axios from 'axios';
import './HistoryDevice.scss'    
import { MapContainer, TileLayer,Marker, Popup,useMapEvent,useMap   } from "react-leaflet";
import L from 'leaflet'
import { useMapContext } from './usercontext';
import { ToastContainer } from 'react-toastify';
import {  toast } from 'react-toastify';
import { UserContext } from './usercontext';  
import { useParams } from "react-router-dom";
import { url } from './services/UserService';
import { min } from 'moment';


function HistoryDevicesDevice() {  
  const [isMapLoading, setIsMapLoading] = useState(false);
    const [Device, setDevice] = useState({id:'', latitude: 0 , longitude: 0 });     
    const [PositionDevice, setPositionDevice] = useState([]);        
    const {id} = useParams(); // Lấy tham số động từ URL
    const {setPercentBattery, makerOpenPopup, setMakerOpenPopup } = useContext(UserContext);
    // const url = 'https://sawacoapi.azurewebsites.net'   
    const positionWarning = new L.Icon({ // vị trí GPS khi bị trộm đi qua
        iconUrl: require("./asset/images/positionWarning.png" ),
        iconSize: [60,60],
        iconAnchor: [28, 50],// nhỏ thì sang phải, xuống     
        popupAnchor: [3, -40], 
    })   
    const beginMarker = new L.Icon({ // vị trí GPS khi bị trộm đi qua
        iconUrl: require("./asset/images/begin.png" ),
        iconSize: [50,50],
        iconAnchor: [28, 50],// nhỏ thì sang phải, xuống     
        popupAnchor: [-4, -40], 
    })   
    const endMarker = new L.Icon({ // vị trí GPS khi bị trộm đi qua
        iconUrl: require("./asset/images/end.png" ),
        iconSize: [42,50],
        iconAnchor: [23, 50],// nhỏ thì sang phải, xuống     
        popupAnchor: [-5, -45], 
    })   
    const [valueFrom, onChangeFrom] = useState(new Date());  
    const [valueTo, onChangeTo] = useState(new Date());
    const [selectedOption, setSelectedOption] = useState('');
    const [selectedLogger, setSelecteLogger] = useState({});
    const [listLoggerStolenHistoryDevices, setListLoggerStolenHistoryDevices] = useState([]);
    const [listPositionWantToDisplay, setListPositionWantToDisplay] = useState([]);
    const [ZOOM_LEVEL, setZOOM_LEVEL] = useState(9) // độ zoom map
    const [center, setCenter] = useState({lat: 10.780064402624358,lng: 106.64558796192786 }) // center
    const [begin, setBegin ] = useState({latitude: 0, longitude : 0})              
    const [end, setEnd ] = useState({latitude: 0, longitude : 0})      
    const [action, setAction] = useState('')
    const mapRef = useRef() 
    const [displayRoutes, setDisplayRoutes] = useState(false)
    const [isConvertDateTimeInPopup, setisConvertDateTimeInPopup] = useState(false)
    const [getPositionDone, setgetPositionDone] = useState(false)
    
    // const getLogger = async () => {
    //   let success = false;
    //   while (!success) {
    //     try {
    //       const response = await axios.get(`${url}/Logger/GetAllLoggers`);
    //       const LoggerData = response.data;
    
    //       // Kiểm tra nếu dữ liệu nhận được hợp lệ
    //       if (LoggerData && LoggerData.length > 0) {    
    //         const ListStolen = LoggerData.filter((item) => item.stolenLines.length > 0);
    //         setListLoggerStolenHistoryDevices(ListStolen);   
    //         success = true; // Dừng vòng lặp khi dữ liệu hợp lệ và được xử lý
    //       } else {
    //         alert('ReLoad');
    //       }
    //     } catch (error) {
    //       console.error('Get All Logger error, retrying...', error);
    //       await new Promise(resolve => setTimeout(resolve, 1000)); // Đợi 2 giây trước khi thử lại
    //     }
    //   }
    // };


    const getDeviceById = async () => {     
      let success = false;
      while (!success) {   
        try {
          const response = await axios.get(`${url}/GPSDevice/GetGPSDeviceById?Id=${id}`);
          const DeviceData = response.data;
    
          // Kiểm tra nếu dữ liệu nhận được hợp lệ
          if (DeviceData) {    
            // const ListStolen = LoggerData.filter((item) => item.stolenLines.length > 0);
            setDevice(DeviceData); 
            console.log(DeviceData)       
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




    const isFirstRender = useRef(true);
    useEffect(() => { 

      if (isFirstRender.current) {
        isFirstRender.current = false;
        return; // Ngăn chạy lần đầu
      }

      setIsMapLoading(false);

      if(PositionDevice.length > 0){  
          setDisplayRoutes(true); 
      }
      
        if(PositionDevice.length === 0){
          toast.success("Chưa ghi nhận lộ trình của thiết bị") 
        }


    }, [PositionDevice])
       
    useEffect(() => { 
        getDeviceById()
        setPercentBattery(0)
        setMakerOpenPopup({})
    }, [])    

    // useEffect(() => { 
    //     // getLogger()
    //     setPercentBattery(0)
    //     setMakerOpenPopup({})
    // }, [])

    
   
    useEffect(() => { // Cập nhật bản đồ với giá trị mới của center và ZOOM_LEVEL
        if (mapRef.current) {
              mapRef.current.setView(center, ZOOM_LEVEL);
        }
      }, [center, ZOOM_LEVEL]);  

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

    const handleChange = (event) => { // Chọn Logger để xem lịch sử
        const HistoryDevicesStolen = listLoggerStolenHistoryDevices.find((item,index) => item.id === event.target.value )
        setSelecteLogger(HistoryDevicesStolen)
        setSelectedOption(event.target.value);
    };

    useEffect(() => {
         if(action === 'Delete'){
              const HistoryDevicesStolen = listLoggerStolenHistoryDevices.find((item,index) => item.id === selectedLogger.id )
              setSelecteLogger(HistoryDevicesStolen)
         }
         if(action === 'See'){

         }
    },[action,listLoggerStolenHistoryDevices])

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
      // Lọc ra những phần tử không phải min hoặc max
      const newLine = filteredLines.filter(item => item.timestamp !== minObj.timestamp && item.timestamp !== maxObj.timestamp);
      setPositionDevice(newLine)
      setBegin(minObj)
      setEnd(maxObj)
      setCenter({lat: minObj.latitude , lng: minObj.longitude })
    }
   
    const getPositionDevice = async (id, startOfDay, endOfDay) => {     
      let success = false;
      while (!success) {   
        try {
          const response = await axios.get(
            `${url}/History/GetDevicePositionHistory/DeviceId=${id}?startDate=${startOfDay}&endDate=${endOfDay}`
          );
          const PositionDeviceData = response.data;
    
          if (PositionDeviceData) {
            // setPositionDevice(PositionDeviceData); 
            console.log('PositionDeviceData', PositionDeviceData);
            
            setZOOM_LEVEL(9)             
            success = true;
            if(PositionDeviceData.length > 0){
              findMinMaxTimestamps(PositionDeviceData)
            }   
            else{
              setPositionDevice([])
              setDisplayRoutes(false)
            }
           
            toast.success("Đã lấy được lộ trình thiết bị")

          } else {
            alert('ReLoad');
          }
        } catch (error) {
              toast.error("Không lấy được lộ trình thiết bị")   
          await new Promise(resolve => setTimeout(resolve, 1000)); 
        }
      }

      setgetPositionDone(true)


    };


    

    const handleShowRoute = () => { 
           
            const startOfDay = formatDateTime(valueFrom);
            const endOfDay = formatDateTime(valueTo);

            if(startOfDay < endOfDay){
              setIsMapLoading(true)
              getPositionDevice(id, startOfDay, endOfDay);
            }
            else{
              toast.error('Thời gian không hợp lệ')
            
              setPositionDevice([])
              setDisplayRoutes(false)
              setIsMapLoading(false)  

              return;
            }  
            console.log('startOfDay', startOfDay)                  
            console.log('endOfDay', endOfDay)    
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
  
  console.log('PositionDevice', PositionDevice)
                                      
  return (   
    <div className='HistoryDevices'> 
      <div className='wrapHistoryDevices'>
            <div className='HistoryDevicesDeviceTitleMobile'>
                      <div className='HistoryDevicesDeviceTitleItem'>
                             { `Lộ trình ${Device.name}` }  
                      </div> 
            </div> 
             <div className='filterHistoryDevice'>   
                        
                              <div className='divTimeHistoryDevice'>
                              <div className='filterItemHistoryDevice filterItemStartHistoryDevice'>
                                  <div>    
                                        Bắt đầu
                                  </div>
                                  <div>

                                     <DatePicker
                                       selected={valueFrom}
                                       onChange={onChangeFrom}
                                       showTimeSelect
                                       timeIntervals={1}
                                       timeFormat="HH:mm:ss"     
                                       dateFormat="dd/MM/yyyy - HH:mm:ss"   
                                       popperPlacement="bottom-end"  // Hiển thị dưới input (bắt đầu)
                                       
                                     />  
                                  </div>
                              </div> 
                                  <div className='filterItemHistoryDevice filterItemEndHistoryDevice'>
                                      <div>
                                        Kết thúc
                                      </div>
                                      <div>  
                                      
                                      <DatePicker
                                            selected={valueTo}
                                            onChange={onChangeTo}
                                            showTimeSelect
                                            timeIntervals={1}
                                            timeFormat="HH:mm:ss"
                                            dateFormat="dd/MM/yyyy - HH:mm:ss"
                                            popperPlacement="bottom-end"
                                        />
                                      </div>
                                  </div>
                              </div>                     
                                                               
                              <div className='filterItemButtonHistoryDevice'>
                                <button 
                                    type="button" 
                                      class="btn btn-info"
                                    onClick={handleShowRoute}
                                
                                >Xem</button>                                           
                              </div>                                       
                        </div>

                  <div className='mapStolenLineDevice'> 
                    <div className='HistoryDevicesDeviceTitle'>
                        <div className='HistoryDevicesDeviceTitleItem'>
                              { `Lộ trình di chuyển ${Device.name}` }     
                        </div> 
                    </div> 

                    { isMapLoading ? ( 
                    <div className="loadingContainer">
                            <div className="spinner"></div> {/* Hiển thị hiệu ứng loading */}
                            <p>Đang tải...</p>
                    </div>
                    ) : (
                      <MapContainer 
                          center={center} 
                          zoom={ZOOM_LEVEL}     
                          ref={mapRef}>
                        <TileLayer
                             attribution ='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            
                        />
                        <MyClickHandlerGetLocation onClick={handleMapClickGetLocation}/>                                                           
                                {displayRoutes &&  PositionDevice.map((item,index)=>(
                                  <Marker 
                                      className='maker'
                                      position={[item.latitude , item.longitude]}
                                      icon= { positionWarning } 
                                      key={ index }                               
                                  >
                                    <Popup>
                                        <div className='div-popup'>  
                                            <div>{ convertDateTimeBefore(item.timestamp) }</div>                                                                    
                                        </div>                                                                             
                                    </Popup>    
                                  </Marker>
                                ))} 


  
                                  {displayRoutes && 
                                    <Marker 
                                        className='maker'
                                        position={[begin.latitude , begin.longitude]} 
                                        icon= { beginMarker } 
                                        zIndexOffset={ 1000 } 
                                                                    
                                    >
                                      <Popup>
                                          <div className='div-popup'>
                                          <div>{convertDateTimeBefore(begin.timestamp)}</div>                                                                
                                          </div>                                                                             
                                      </Popup>    
                                  </Marker>} 
                                  


                                  {displayRoutes && 
                                    <Marker 
                                        className='maker'    
                                        position={[end.latitude , end.longitude]}
                                        icon= { endMarker }
                                        zIndexOffset={  1000 } 
                                                                    
                                    >
                                      <Popup>
                                          <div className='div-popup'>
                                              <div>{convertDateTimeBefore(end.timestamp)}</div>                                                                    
                                          </div>                                                                             
                                      </Popup>    
                                  </Marker>}
                                 


                    </MapContainer>

                    )}         
                    
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
                        containerId="HistoryDevices"
                        

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
export default HistoryDevicesDevice   
