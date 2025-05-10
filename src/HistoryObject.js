import React, { useEffect, useState, useRef,useContext } from 'react'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css'; 
import axios from 'axios';
import './HistoryObject.scss' 
import { MapContainer, TileLayer,Marker, Popup,useMapEvent,useMap   } from "react-leaflet";
import L from 'leaflet'
import { useMapContext } from './usercontext';
import { ToastContainer } from 'react-toastify';
import {  toast } from 'react-toastify';
import { UserContext } from './usercontext'; 
import { useParams } from "react-router-dom";
import { url } from './services/UserService';

function HistoryObject() {       
     
    const {id} = useParams(); // Lấy tham số động từ URL   
    const {setPercentBattery, makerOpenPopup, setMakerOpenPopup } = useContext(UserContext);
    //const url = 'https://sawacoapi.azurewebsites.net' 
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
        iconAnchor: [28, 50],// nhỏ thì sang phải, xuống     
        popupAnchor: [-5, -45], 
    })   
    const [valueFrom, onChangeFrom] = useState(new Date());
    const [valueTo, onChangeTo] = useState(new Date());
    const [selectedOption, setSelectedOption] = useState('');
    const [selectedLogger, setSelecteLogger] = useState({});
    const [historyObject, setHistoryObject] = useState([]); 
    const [listPositionWantToDisplay, setListPositionWantToDisplay] = useState([]);
    const [ZOOM_LEVEL, setZOOM_LEVEL] = useState(9) // độ zoom map
    const [center, setCenter] = useState({lat: 10.780064402624358,lng: 106.64558796192786 }) // center
    const [begin, setBegin ] = useState({}) 
    const [end, setEnd ] = useState({})   
    const [action, setAction] = useState('')
    const mapRef = useRef() 
    const [displayRoutes, setDisplayRoutes] = useState(false)
    const [isConvertDateTimeInPopup, setisConvertDateTimeInPopup] = useState(false)
    const [Object, setObject] = useState({id:'', latitude: 0 , longitude: 0 });
    const [isMapLoading, setIsMapLoading] = useState(false);
  
    const getObjectById = async () => {
      let success = false;
      while (!success) {   
        try {
          const response = await axios.get(`${url}/GPSObject/GetObjectById?id=${id}`);
          const ObjectData = response.data;
          console.log(id)
          // Kiểm tra nếu dữ liệu nhận được hợp lệ
          if (ObjectData) {    
            // const ListStolen = LoggerData.filter((item) => item.stolenLines.length > 0);
            setObject(ObjectData);     
            success = true; // Dừng vòng lặp khi dữ liệu hợp lệ và được xử lý
          } else {
            alert('ReLoad');
          }
        } catch (error) {
          console.error('getObjectById error, retrying...', error);
          await new Promise(resolve => setTimeout(resolve, 1000)); // Đợi 2 giây trước khi thử lại
        }
      }
    };

    useEffect(() => { 
        getObjectById()
        
    }, [])

    

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
      setHistoryObject(newLine)
      setBegin(minObj)
      setEnd(maxObj)
      setCenter({lat: minObj.latitude , lng: minObj.longitude })
    }
   
    const getPositionDevice = async (id, startOfDay, endOfDay) => {     
      let success = false;
      while (!success) {   
        try {
          const response = await axios.get(
            `${url}/History/GetObjectPositionHistory/ObjectId=${id}?startDate=${startOfDay}&endDate=${endOfDay}`
          );
          const PositionDeviceData = response.data;
    
          if (PositionDeviceData) {

            
            if(PositionDeviceData.length > 0){
              findMinMaxTimestamps(PositionDeviceData)
            }   
            else{
              setHistoryObject([])
              setDisplayRoutes(false)
            }
            console.log('PositionDeviceData', PositionDeviceData);         
            success = true; 
            toast.success("Đã lấy được lộ trình")  
            setZOOM_LEVEL(9)    
          } else {
            alert('ReLoad');
          }
        } catch (error) {
          console.error('getPositionDevice error, retrying...', error);     
          await new Promise(resolve => setTimeout(resolve, 1000)); 
        }
      }
    };


     const handleShowRoute = () => { 

                const startOfDay = formatDateTime(valueFrom);
                const endOfDay = formatDateTime(valueTo);


                if(startOfDay < endOfDay){
                      setIsMapLoading(true)
                      setisConvertDateTimeInPopup(true)
                      getPositionDevice(id, startOfDay, endOfDay);
                }
                else{
                  toast.error('Thời gian không hợp lệ')
                  setHistoryObject([])
                  setIsMapLoading(false)  
                }    
                  
        }


        const isFirstRender = useRef(true);

        useEffect(() => {
          if (isFirstRender.current) {
            isFirstRender.current = false;
            return; // Ngăn chạy lần đầu
          }
        
          setIsMapLoading(false);
          setDisplayRoutes(true);

          if(historyObject.length === 0){
            toast.success("Chưa ghi nhận lộ trình trong thời gian này")
            setDisplayRoutes(false)
          }

        }, [historyObject]);

 

    const handleMapClickGetLocation = (e) => {  // lấy tọa độ khi Click vô Map
      console.log('lat: '+ e.latlng.lat)
      console.log('lng: '+ e.latlng.lng)
    };

  

  



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


  return (   
    <div className='HistoryObject'>    
      <div className='wrapHistoryObject'>   

            <div className='TitleMobileHistoryObject'>
                       <div className='TitleItemMoblieHistoryObject'>
                             { `Lộ trình ${Object.name}` }    
                        </div> 
            </div>
             
            <div className='filterHistoryObject'>   
            
                                        <div className='divTimeHistoryObject'>
                                        <div className='filterItemHistoryObject filterItemStartHistoryObject'>
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
                                                                   popperPlacement="bottom-end"
                                                                 />
                                                               </div>
                                                 </div> 
                                                 <div className='filterItemHistoryObject filterItemEndHistoryObject'>
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
                                               
            
                                                 <div className='filterItemButtonHistoryObject'>
                                                               <button 
                                                                   type="button" 
                                                                   class="btn btn-info"
                                                                   onClick={handleShowRoute} 
                                                               
                                                               >Xem</button>
                                                               
                                                 </div>
                            
            </div>  

            <div className='mapStolenLineObject'>     

                    <div className='Title'>   
                       <div className='TitleItem'>
                              { `Lộ trình di chuyển của đối tượng ${Object.name}` }     
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
                                {displayRoutes &&  historyObject.map((item,index)=>(
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
                        containerId="HistoryObject"
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
export default HistoryObject      
