import React,{useState,useEffect, useContext} from 'react'
import { RiGpsFill } from "react-icons/ri";
import { TiBatteryCharge } from "react-icons/ti";
import './Devices.scss'
import { GiPositionMarker } from "react-icons/gi";
import { FaBell } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoMdAddCircle } from "react-icons/io";
import {Link, useNavigate} from "react-router-dom";
import ModalAddDevice from './settingDevice/AddDevice';
import axios from 'axios';
import { url } from './services/UserService';  
import { toast } from 'react-toastify';
import { UserContext } from './usercontext';   
function Devices() {
  const [isLoading, setIsLoading] = useState(true); // Thêm state để quản lý trạng thái loading
  const { center, zoomLevel, setZoomLevel,
            percentBattery, getPositionUser, setCenter,       
            makerOpenPopup, pressPositionWarning,    
            setChangeNameFromMapToHeader, setMakerOpenPopup,   
            pressPercentBattery, setgetLoggerStolen, displayNav, setDisplayNav, displayRoutesTwoPoint, setDisplayRoutesTwoPoint,
            isButtonDisabled, setIsButtonDisabled , accessRouteRegister, listAllDevices, setlistAllDevices,
            inforCustomer, setInforCustomer, phoneNumberCustomer, setPhoneNumberCustomer, listObject, setlistObject    
          } =  useContext(UserContext);  

  // const [listAllDevices,setlistAllDevices] = useState([]) 
  const [showModalAddDevice, setshowModalAddDevice] = useState(false);
  const [Device, setDevice] = useState({id:'', name: '', timeStamp:  "2025-01-01T00:00:00"});
  const [searchTerm, setSearchTerm] = useState("");
  const handleshowModalAddDevice= ()=> {   
        setshowModalAddDevice(true)       
  }
  const CallAPIGetDeviceById = async () => {      
    let success = false;  
    while (!success) {
      try {
        const idDevice = sessionStorage.getItem('idDevice')
        const response = await axios.get(`${url}/GPSDevice/GetGPSDeviceById?Id=${idDevice}`);     
        const LoggerData = response.data;
  
        // Kiểm tra nếu dữ liệu nhận được hợp lệ
        if (LoggerData) {
          
          setDevice(LoggerData)

          success = true; // Dừng vòng lặp khi dữ liệu hợp lệ và được xử lý
          
        } else {
          
          alert('ReLoad');
        }
      } catch (error) {
        toast.error("Lỗi khi lấy thông tin thiết bị")  
        await new Promise(resolve => setTimeout(resolve, 1000)); // Đợi 2 giây trước khi thử lại
      }
    }
  };

  const CallAPIUpdateDeviceById = async () => { 
    console.log('cc')
         
    let success = false;  
    while (!success) {
      try {
        const phoneNumer = sessionStorage.getItem('phoneNumer');
        const response = await axios.patch(`${url}/GPSDevice/UpdateGPSDeviceStatus?GPSDeviceId=${Device.id}`, {...Device, customerPhoneNumber:phoneNumer }    );       
        const LoggerData = response.data;
  
        // Kiểm tra nếu dữ liệu nhận được hợp lệ
        if (LoggerData === 'Update successful!') {
          getAllDevices()
          success = true; // Dừng vòng lặp khi dữ liệu hợp lệ và được xử lý
          
        } else {
          toast.error('Nhuw cc')
          alert('ReLoad');
        }
      } catch (error) {  
        toast.error("Lỗi khi cập nhật thông tin thiết bị") 
        await new Promise(resolve => setTimeout(resolve, 1000)); // Đợi 2 giây trước khi thử lại
      }
    }
  };


  useEffect(()=>{
    if(Device.id !==''){ 
      CallAPIUpdateDeviceById()  
    }
  },[Device]) 

  const handleCloseModalAddDeice = () => {
        setshowModalAddDevice(false)  
        //CallAPIGetDeviceById()
         getAllDevices()
  } 

  const getAllDevices = async () => {   
    setIsLoading(true); // Bắt đầu loading
    let success = false;
    while (!success) {
      try {
        const response = await axios.get(`${url}/GPSDevice/GetAllGPSDevices`);  
        const LoggerData = response.data;
  
        // Kiểm tra nếu dữ liệu nhận được hợp lệ
        if (LoggerData && LoggerData.length > 0) {

          const phoneNumer = sessionStorage.getItem('phoneNumer');
          const listDevice = LoggerData.filter((item) => item.customerPhoneNumber === phoneNumer);
          setlistAllDevices(listDevice);      
          success = true; 
        } else {   

        }
      } catch (error) {
        toast.error("Lỗi khi lấy thông tin tất cả thiết bị")  
        await new Promise(resolve => setTimeout(resolve, 1000)); // Đợi 2 giây trước khi thử lại
      }
    }
    setIsLoading(false); // Bắt đầu loading
  };

  useEffect(() => { 

    getAllDevices()   

  }, [])

   // Lọc danh sách thiết bị theo searchTerm
   const filteredDevices = listAllDevices.filter((device) =>
    device.name.toLowerCase().includes(searchTerm.toLowerCase()) 
  );


  function convertDateTimeBefore(inputString) {
    const [date, time] = inputString.split('T');    
    const [year, month, day] = date.split('-');
    return `${day}-${month}-${year} ${time}`;
  }

  return (
    <div className='fatherDevices'>
      <div className='wrapperDevices'>
              <div className='MapTitle'>
                        <div className='MapTitleItem'>
                             Thiết bị        
                        </div>   
              </div>
              <div className='toolDevices'>
                  <div className='divInputFindDevices'>
                        <input 
                          type="email" class="form-control" id="exampleInputEmail1" placeholder="Tìm kiếm thiết bị"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}                     
                        />              
                  </div>                     
                  <div 
                        className='divAddDevices'
                        onClick={handleshowModalAddDevice}
                  >
                        <IoMdAddCircle className='iconAddDevices'/>    
                  </div>   
              </div>

              {
              isLoading ? (
                    <div className="loadingContainer">
                            <div className="spinner"></div> {/* Hiển thị hiệu ứng loading */}
                            <p>Đang tải...</p>  
                    </div>
              ) : 

              (filteredDevices.length > 0 && filteredDevices.map((item , index)=>(
                <div   
                  className='wrapperContainerDevices'  
              >        
                <div className='containerDevice'>
                  <div className='itemDevice itemDeviceFirst'>
                      <div className='divIconDevice'>
                          <RiGpsFill className='iconDevice'/>
                      </div>
                      <div className='divIconNameAndPin'>
                          <div className='name'>
                            {item.name} 
                          </div>
                          <div className='divIconPin'>
                            <TiBatteryCharge className='iconPin'/>
                            <div>
                              {/* {`${item.battery} %`} */}           
                              {convertDateTimeBefore(item.timeStamp) !== '01-01-2025 00:00:00' ? `${item.battery} %` : `Chưa cập nhật lần đầu`}
                            </div>      
                          </div>          
                      </div>
                  </div>
                  <div className='itemDevice itemDeviceSecond'>
                      <Link to={`/Devices/Position/${item.id}`}>   
                          <div className = 'itemDeviceSecondItem'>  
                            <div>
                              <GiPositionMarker className='itemDeviceSecondItemIcon'/>  
                            </div>
                            <div>
                              Vị trí                                               
                            </div>
                          </div>
                      </Link>  
                      
                      <Link to={`/Devices/Setting/${item.id}`}>         
                        <div className = 'itemDeviceSecondItem'>
                          <div>
                            <IoMdSettings className='itemDeviceSecondItemIcon'/>
                          </div>
                          <div>
                            Thiết lập     
                          </div>
                        </div>
                      </Link>
                      
                      
                  </div>
                </div>
              </div>
                                               
              )))
              }

             
              
      </div>   
                <ModalAddDevice   
                            show={showModalAddDevice} 
                            handleClose={handleCloseModalAddDeice}  
                />  
    </div>
  )
}

export default Devices
