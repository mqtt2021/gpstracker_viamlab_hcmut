import React, { useEffect, useState, useRef,useContext } from 'react'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css'; 
import axios from 'axios';
import './History.scss'
import { MapContainer, TileLayer,Marker, Popup,useMapEvent,useMap   } from "react-leaflet";
import L from 'leaflet'
import { useMapContext } from './usercontext';
import { ToastContainer } from 'react-toastify';
import {  toast } from 'react-toastify';
import { UserContext } from './usercontext';  
import { url } from './services/UserService'; 

function History() {  
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
        iconAnchor: [28, 50],// nhỏ thì sang phải, xuống     
        popupAnchor: [-5, -45], 
    })   
    const [valueFrom, onChangeFrom] = useState(new Date());
    const [valueTo, onChangeTo] = useState(new Date());
    const [selectedOption, setSelectedOption] = useState('');
    const [selectedLogger, setSelecteLogger] = useState({});
    const [listLoggerStolenHistory, setListLoggerStolenHistory] = useState([]);
    const [listPositionWantToDisplay, setListPositionWantToDisplay] = useState([]);
    const [ZOOM_LEVEL, setZOOM_LEVEL] = useState(9) // độ zoom map
    const [center, setCenter] = useState({lat: 10.780064402624358,lng: 106.64558796192786 }) // center
    const [begin, setBegin ] = useState({}) 
    const [end, setEnd ] = useState({})   
    const [action, setAction] = useState('')
    const mapRef = useRef() 
    const [displayRoutes, setDisplayRoutes] = useState(false)
    const [isConvertDateTimeInPopup, setisConvertDateTimeInPopup] = useState(false)
    
    // const getLogger = async () => {
    //   let success = false;
    //   while (!success) {
    //     try {
    //       const response = await axios.get(`${url}/Logger/GetAllLoggers`);
    //       const LoggerData = response.data;
    
    //       // Kiểm tra nếu dữ liệu nhận được hợp lệ
    //       if (LoggerData && LoggerData.length > 0) {    
    //         const ListStolen = LoggerData.filter((item) => item.stolenLines.length > 0);
    //         setListLoggerStolenHistory(ListStolen);   
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

    useEffect(() => { 
        // getLogger()
        setPercentBattery(0)
        setMakerOpenPopup({})
    }, [])

    

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

    const handleChange = (event) => { // Chọn Logger để xem lịch sử
        const HistoryStolen = listLoggerStolenHistory.find((item,index) => item.id === event.target.value )
        setSelecteLogger(HistoryStolen)
        setSelectedOption(event.target.value);
    };

    useEffect(() => {
         if(action === 'Delete'){
              const HistoryStolen = listLoggerStolenHistory.find((item,index) => item.id === selectedLogger.id )
              setSelecteLogger(HistoryStolen)
         }
         if(action === 'See'){

         }
    },[action,listLoggerStolenHistory])

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

    const executeFunctions = async () => {
      // await  getLogger();       // Cập nhật lại danh sách Logger
      setAction('Delete')      // Sau đó thực hiện hàm tiếp theo
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
                          executeFunctions();
                         
                          
                          
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
  return (   
    <div className='History'> 
      <div className='wrapHistory'>
            <div className='MapTitle'>
                        <div className='MapTitleItem'>
                             Lộ trình di chuyển      
                        </div> 
            </div> 
            <div className='filter'>        
                   <div className='filterItem filterItemSelectLogger'>                      

                                   <select 
                                     className="form-select" 
                                     aria-label="Default select example" 
                                     value={selectedOption}
                                     onChange={handleChange}
                                   >
                                     <option value="">--Chọn--</option>
                                     {listLoggerStolenHistory.map((item) => (
                                       <option key={item.id} value={item.id}>{item.name}</option>
                                     ))}
                                   </select>
                                   
                   </div> 
                   <div className='filterItem filterItemStart'>
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
                                       popperPlacement="bottom-start"
                                   
                                     />

                                   
                                   </div>
                     </div> 
                     <div className='filterItem filterItemEnd'>
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
                                         popperPlacement="bottom-start"
                                     />


                                   </div>
                     </div>
                     <div className='filterItem filterItemButton'>
                                   <button 
                                       type="button" 
                                       class="btn btn-info"
                                       onClick={handleShowRoute}
                                   
                                   >Xem</button>
                                   <button 
                                       type="button" 
                                       class="btn btn-danger"
                                       onClick={handleDeleteRoutes}
                                   >Xóa</button>
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
                                {displayRoutes &&  listPositionWantToDisplay.map((item,index)=>(
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
                                ))} 
                                {displayRoutes && 
                                  <Marker 
                                      className='maker'
                                      position={[begin.latitude , begin.longtitude]}
                                      icon= { beginMarker } 
                                      zIndexOffset={ 1000 } 
                                                                  
                                  >
                                    <Popup>
                                        <div className='div-popup'>
                                        <div>{ isConvertDateTimeInPopup ? convertDateTimeBefore(begin.timestamp) : convertDateTimeAfter(begin.timestamp)}</div>                                                                
                                        </div>                                                                             
                                    </Popup>    
                                </Marker>
                                } 
                                {displayRoutes && 
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
                                } 


                    </MapContainer>
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
                        containerId="History"
                        

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
export default History
