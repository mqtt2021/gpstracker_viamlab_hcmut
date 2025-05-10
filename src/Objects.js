import React, { useState, useEffect, useRef,useContext } from "react";
import { RiGpsFill } from "react-icons/ri";
import { TiBatteryCharge } from "react-icons/ti";
import './Objects.scss'  
import { GiPositionMarker } from "react-icons/gi";
import { FaBell } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoMdAddCircle } from "react-icons/io";
import {Link,useNavigate} from "react-router-dom";
import { IoIosInformationCircle } from "react-icons/io";
import { TbDeviceComputerCamera } from "react-icons/tb";
import { GrConnect } from "react-icons/gr";
import { RiChatHistoryFill } from "react-icons/ri";
import { url } from './services/UserService';   
import axios from 'axios';
import Connect from "./Connect";  
import { UserContext } from './usercontext';
import { IoIosWarning } from "react-icons/io";

function Object() {    
  const [searchTerm, setSearchTerm] = useState("");
  const {idObjectConnect, setidObjectConnect } = useContext(UserContext); 
  const [listAllObjects,setlistAllObjects] = useState([])  
  const [showModalAddDevice, setshowModalAddDevice] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Thêm state để quản lý trạng thái loading

  // const getAllObjectsByPhoneNumber = async () => {   
  //   let success = false;
  //   while (!success) {
  //     try {
  //       const phoneNumer = sessionStorage.getItem('phoneNumer');
  //       const response = await axios.get(`${url}/GPSObject/GetObjectByPhoneNumber?phoneNumber=${phoneNumer}`);  
  //       const LoggerData = response.data;     
  //       // Kiểm tra nếu dữ liệu nhận được hợp lệ
  //       if (LoggerData && LoggerData.length > 0) {
  //         setlistAllObjects(LoggerData);      
  //         success = true;   
  //       } else {
  //       }
  //     } catch (error) {
  //       console.error('getAllObjectsByPhoneNumber error, retrying...', error);    
  //       await new Promise(resolve => setTimeout(resolve, 1000)); // Đợi 2 giây trước khi thử lại
  //     }
  //   }
  // };


  // const getAllObjectsByPhoneNumber = async () => {   
  //   setIsLoading(true); // Bắt đầu loading
  //   let success = false;
  //   while (!success) {
  //       try {
  //           const phoneNumber = sessionStorage.getItem('phoneNumer');
  //           const response = await axios.get(`${url}/GPSObject/GetObjectByPhoneNumber?phoneNumber=${phoneNumber}`);  
  //           let objectList = response.data; 
  //           if (objectList && objectList.length > 0) {
  //               // Quét qua từng đối tượng để lấy thông tin GPS
  //               const updatedObjects = await Promise.all(
  //                   objectList.map(async (object) => {
  //                       try {
  //                           const gpsResponse = await axios.get(`${url}/GPSDevice/GetGPSDeviceById?Id=${object.gpsDeviceId}`);
  //                           const gpsData = gpsResponse.data;
  //                           return {
  //                               ...object,
  //                               stolen: gpsData?.stolen || false // Thêm thuộc tính stolen vào đối tượng
  //                           };
  //                       } catch (error) {
  //                           console.error(`Lỗi khi lấy GPS cho ${object.gpsDeviceId}`, error);
  //                           return {
  //                               ...object,
  //                               stolen: false // Nếu lỗi, mặc định không bị đánh cắp
  //                           };
  //                       }
  //                   })
  //               );
  //               setlistAllObjects(updatedObjects);      
  //               success = true;   
  //           } 
  //       } catch (error) {
  //           console.error('getAllObjectsByPhoneNumber error, retrying...', error);    
  //           await new Promise(resolve => setTimeout(resolve, 1000)); // Đợi 1 giây trước khi thử lại
  //       }
  //   }
  //   setIsLoading(false); // Kết thúc loading sau khi lấy dữ liệu xong
  // };



  const getAllObjectsByPhoneNumber = async () => {   
    setIsLoading(true); // Bắt đầu loading
    let success = false;

    while (!success) {
        try {
            const phoneNumber = sessionStorage.getItem('phoneNumer');
            const response = await axios.get(`${url}/GPSObject/GetObjectByPhoneNumber?phoneNumber=${phoneNumber}`);  
            let objectList = response.data; 

            if (objectList && objectList.length > 0) {
                // Quét qua từng đối tượng để lấy thông tin GPS nếu connected === true
                const updatedObjects = await Promise.all(
                    objectList.map(async (object) => {
                        if (object.connected) {
                            try {
                                const gpsResponse = await axios.get(`${url}/GPSDevice/GetGPSDeviceById?Id=${object.gpsDeviceId}`);
                                const gpsData = gpsResponse.data;
                                return { ...object, stolen: gpsData?.stolen || false };
                            } catch (error) {
                                console.error(`Lỗi khi lấy GPS cho ${object.gpsDeviceId}`, error);
                                return { ...object, stolen: false }; // Lỗi API thì mặc định không bị đánh cắp
                            }
                        } else {
                            return { ...object, stolen: false }; // Nếu không kết nối thì stolen = false
                        }
                    })
                );

                setlistAllObjects(updatedObjects);
                
            } 

            success = true;
        } catch (error) {
            console.error('getAllObjectsByPhoneNumber error, retrying...', error);    
            await new Promise(resolve => setTimeout(resolve, 1000)); // Đợi 1 giây trước khi thử lại
        }
    }

    setIsLoading(false); // Kết thúc loading sau khi lấy dữ liệu xong
};




  // const CallAPIGetDeviceById = async () => {      
  //   let success = false;               
  //   while (!success) {
  //     try {
  //       const idDevice = sessionStorage.getItem('idDevice')
  //       const response = await axios.get(`${url}/GPSDevice/GetGPSDeviceById?Id=${idDevice}`);     
  //       const LoggerData = response.data;
  
  //       // Kiểm tra nếu dữ liệu nhận được hợp lệ
  //       if (LoggerData) {
          
  //         // setDevice(LoggerData)

  //         success = true; // Dừng vòng lặp khi dữ liệu hợp lệ và được xử lý
          
  //       } else {
          
  //         alert('ReLoad');
  //       }
  //     } catch (error) {
  //       console.error('CallAPIGetDeviceById error, retrying...', error);  
  //       await new Promise(resolve => setTimeout(resolve, 1000)); // Đợi 2 giây trước khi thử lại
  //     }
  //   }
  // };



  
  

  useEffect(() => {  
    getAllObjectsByPhoneNumber()
  }, []); 

  const handleCloseModalAddDeice = () => {
        setshowModalAddDevice(false) 
        getAllObjectsByPhoneNumber()   
  } 
  const handleConnectObjectDevice = (id) => { 
        setidObjectConnect(id)
        setshowModalAddDevice(true)  
  } 

 // Lọc danh sách thiết bị theo searchTerm
 const filteredObjects = listAllObjects.filter((device) =>
  device.name.toLowerCase().includes(searchTerm.toLowerCase()) 
);


  console.log('listAllObjects',listAllObjects)
  return (
    <div className='fatherObject'>
      <div className='wrapperObject'>
              <div className='AddObjectTitle'>
                  <div className='AddObjectTitleItem'>
                        Đối tượng
                  </div> 
              </div>
              <div className='toolObject'>
                  <div className='divInputFindObject'>
                        <input 
                          type="email" class="form-control" id="exampleInputEmail1" placeholder="Tìm đối tượng"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}                  
                        />              
                  </div>   
                  <Link  to="/AddObject">                    
                    <div className='divAddObject'>
                          <IoMdAddCircle className='iconAddObject'/>    
                    </div>                          
                  </Link>                                    
              </div>   



              {
              isLoading ? (
                    <div className="loadingContainer">
                      <div className="spinner"></div> {/* Hiển thị hiệu ứng loading */}
                      <p>Đang tải...</p>
                    </div>
              ) : 
              
              (filteredObjects.map((item , index)=> (                    
                <div className='wrapperContainerObject'>        
                <div className='containerObject'>
                  <div className='itemObject itemObjectFirst'>
                      <div className='divIconObject'>
                          <TbDeviceComputerCamera className='iconObject'/>
                      </div>
                      <div className='divIconNameAndPinObject'>
                         <div className='nameObject'>
                            {item.name}
                         </div>
                         <div className='statusObject'>
                          {item.stolen && (
                              <span className="warning-text">
                                  <IoIosWarning className="warning-icon" /> Cảnh báo kẻ trộm
                              </span>
                          )}
                         </div>

                      </div>
                      <div  
                            className={item.connected ? 'connectedObject' : 'disconnectedObject'}
                           
                      >
                              {item.connected ? 'Đã kết nối' : 'Chưa kết nối'}
                      </div>
                  </div>

                  <div className='itemObject itemObjectecond'>

                  {item.connected ?  
                    <Link to={`/PositionObject/${item.id}`}>     
                      <div className = 'itemObjectecondItem'>  
                        <div>
                          <GiPositionMarker className='itemObjectecondItemIcon'/>  
                        </div>
                        <div className="itemObjectecondItemText" >
                            Vị trí
                        </div>
                      </div>
   
                      </Link> :

                      <Link to={`/HistoryObject/${item.id}`}>     
                        <div className = 'itemObjectecondItem'>  
                          <div>
                            <RiChatHistoryFill className='itemObjectecondItemIcon'/>  
                          </div>
                          <div className="itemObjectecondItemText">
                              Lộ trình
                          </div>
                        </div>
                      </Link> 
                  }
                      {/* <Link to={`/PositionObject/${item.id}`}>     
                      <div className = 'itemObjectecondItem'>  
                        <div>
                          <RiChatHistoryFill className='itemObjectecondItemIcon'/>  
                        </div>
                        <div>
                            Lộ trình
                        </div>
                      </div>
                      </Link>     */}
                      
                      
                        <div 
                              className = 'itemObjectecondItem itemObjectecondItemConnect'
                              onClick={() => handleConnectObjectDevice(item.id)} // Truyền id vào hàm xử lý
                              
                        >
                          <div>
                          <GrConnect className='itemObjectecondItemIconConnect'   />
                          </div>
                          <div className="itemObjectecondItemTextConnect">
                            Kết nối
                          </div>
                        </div>
                       
                      
                      <Link to={`/Object/Setting/${item.id}`}>            
                        <div className = 'itemObjectecondItem'>
                          <div>
                            <IoIosInformationCircle className='itemObjectecondItemIcon'/>
                          </div>
                          <div className="itemObjectecondItemText">
                            Thông tin   
                          </div>
                        </div>
                      </Link>
                      
                      <div>

                      </div>
                  </div>
                </div>
              </div>
              )))
              
              }                                        
      </div>  


                <Connect     
                    show={showModalAddDevice} 
                    handleClose={handleCloseModalAddDeice}
                    
                />     
    </div>
  )
}

export default Object
