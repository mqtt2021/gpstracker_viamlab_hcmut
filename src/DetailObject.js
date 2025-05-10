import React,{useState, useEffect, useRef  } from 'react'
import './DetailObject.scss'
import {Link, useNavigate} from "react-router-dom";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { url } from './services/UserService';
import { useParams } from 'react-router-dom';                 
import axios from 'axios';
import { FaBluetooth } from "react-icons/fa";
import {useLocation}  from "react-router-dom";
import { LuAlarmClock } from "react-icons/lu";
import { GrConnect } from "react-icons/gr";
import { ToastContainer } from 'react-toastify';
import {  toast } from 'react-toastify';
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import { AiFillWarning } from "react-icons/ai";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import moment from "moment";
import { SlCheck } from "react-icons/sl";
import { MdOutlineStickyNote2 } from "react-icons/md";
import { MdPhotoCamera } from "react-icons/md";
function DetailObject() {    
    const [image, setImage] = useState(null);
    const [isPressed, setIsPressed] = useState(false);
    const [isOn, setIsOn] = useState(false);
    const [isEmergency, setIsEmergency] = useState(false);
    const location = useLocation();     
    const [time, setTime] = useState("00:00:00"); // Giá trị mặc định
    const [ObjectIsConnect, setObjectIsConnect] = useState({}) ;     
    const [devices, setDevices] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const { id } = useParams(); // Lấy id từ URL
    const [isLoading, setIsLoading] = useState(true); // Thêm state để quản lý trạng thái loading
    const [idDevice, setIdDevice] = useState('');
    const [phone, setPhone] = useState('');
    const [valueFrom, onChangeFrom] = useState(new Date());    
    const [valueTo, onChangeTo] = useState(new Date());
    const [showModalUpdateFirmware, setshowModalUpdateFỉmware] = useState(false);                 
    const [Object, setObject] = useState({id:'', latitude: 0 , longitude: 0 });   
    const [DeviceConnectObject, setDeviceConnectObject] = useState({id:'', latitude: 0 , longitude: 0 });   
    const [listHistorBattery, setListHistorBattery] = useState([]);   
    const [choseImage, setchoseImage] = useState(false);
    const [imageURL, setImageURL] = useState('');
          const navigate = useNavigate();       
    const getDeviceById = async (idDevice) => {               
      let success = false;
      while (!success) {   
        try {
          const response = await axios.get(`${url}/GPSDevice/GetGPSDeviceById?Id=${idDevice}`);         
          const DeviceData = response.data;
    
          // Kiểm tra nếu dữ liệu nhận được hợp lệ
          if (DeviceData) {    
            // const ListStolen = LoggerData.filter((item) => item.stolenLines.length > 0);
            setDeviceConnectObject(DeviceData); 
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

      setIsLoading(false)

     
    };
                           
    const CallAPIUpdateImgObjectById = async (linkImage) => {                                  
      console.log('Object', Object)                              
      let success = false;  
      while (!success) {
        try {
          const response = await axios.patch(`${url}/GPSObject/UpdateObjectInformation?ObjectId=${Object.id}`, Object);       
          const LoggerData = response.data;
    
          // Kiểm tra nếu dữ liệu nhận được hợp lệ
          if (LoggerData === 'Update successfully!') {         
            toast.success('Thay đổi ảnh đối tượng thành công')
            success = true; // Dừng vòng lặp khi dữ liệu hợp lệ và được xử lý
            
          } else {
            toast.error('Thay đổi ảnh đối tượng không thành công')
            alert('ReLoad');
          }
        } catch (error) {
          console.error('CallAPIUpdateImgObjectById error, retrying...', error);  
          await new Promise(resolve => setTimeout(resolve, 1000)); // Đợi 2 giây trước khi thử lại
        }
      }

      await getObjectById()  

    };

    
    useEffect(() => {                  
      if(Object.id !== ''){                   
        CallAPIUpdateImgObjectById()                   
      }
    },[choseImage])      
    
    
    useEffect(() => {                  
      if(Object.id !== ''){                   
        setObject((prevDevice) => ({
                ...prevDevice, // Giữ lại các thuộc tính cũ
                imagePath: imageURL     
        }))    
        setchoseImage(pre => !pre)          
      }
    },[imageURL])                 
    
    const getObjectById = async () => { 
      
     
      let success = false;  

      while (!success) {   
        try {
          const response = await axios.get(`${url}/GPSObject/GetObjectById?id=${id}`);         
          const DeviceData = response.data;
    
          // Kiểm tra nếu dữ liệu nhận được hợp lệ
          if (DeviceData) {    
            // const ListStolen = LoggerData.filter((item) => item.stolenLines.length > 0);
            setObject(DeviceData); 
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


    const getDeviceIdFromURL = () => {
      
      const pathSegments = location.pathname.split('/'); 
      return pathSegments[3]; // "G001" ở vị trí thứ 3 trong mảng
    };


    useEffect(() => {  
      if(idDevice !== ''){
        getObjectById()   
      }
      
    }, [idDevice]) 


    useEffect(() => {  
      if(Object.id !== ''){
              if(Object.gpsDeviceId !== ''){
                getDeviceById(Object.gpsDeviceId)   
              }
              else{  
                setIsLoading(false)
              }

              setImage(Object.imagePath)
      }
      
    }, [Object])    

    // useEffect(() => {  
    //   if(Device.id !== ''){
    //     setTime(extractTime(Device.alarmTime))  
    //     if(Device.emergency){
    //       setIsEmergency(true)
    //     }
    //     else{
    //       setIsEmergency(false)
    //     }
  

    //     if(Device.bluetooth === "True"){
    //       setIsOn(true)
    //     }
    //     else{
    //       setIsOn(false)  
    //     }

    //     setIsLoading(false); // Kết thúc loading sau khi lấy dữ liệu xong
        
  
    //   }
      
    // }, [Device]) 

    const getAllObject = async () => {   
      let success = false;
      while (!success) {
        try {
          const response = await axios.get(`${url}/GPSObject/GetObjectByPhoneNumber?phoneNumber=${phone}`);    
          const DevicesData = response.data; 
          console.log(DevicesData)   
          // Kiểm tra nếu dữ liệu nhận được hợp lệ
          if (DevicesData && DevicesData.length > 0) {      
            const Devices = DevicesData.find((item) => item.connected === true && item.gpsDeviceId === idDevice);
            setObjectIsConnect(Devices);         
            success = true; 
          } else {
          }
        } catch (error) {
          console.error('getAllDevice error, retrying...', error);  
          await new Promise(resolve => setTimeout(resolve, 1000)); // Đợi 2 giây trước khi thử lại
        }
      }
    };


    useEffect(() => {  
      if(phone !== ''){
        getAllObject()   
      }
         
    }, [phone])   

    // useEffect(() => {  
    //   if(listHistorBattery.length > 0){  
    //     setIsdisplayChart(true)
    //   }
         
    // }, [listHistorBattery]) 

    
    useEffect(() => {  
        const deviceId = getDeviceIdFromURL();
        setIdDevice(deviceId)

        const phoneNumer = sessionStorage.getItem('phoneNumer');  
        setPhone(phoneNumer)
        
    }, [])   

    const handleshowModalUpdateFirmware= ()=> {   
      setshowModalUpdateFỉmware(true)     
    }

    const handleCloseModalUpdateFirmware=()=>{
      setshowModalUpdateFỉmware(false)   
    }  

    function convertDateTimeBefore(inputString) {
      const [date, time] = inputString.split('T');    
      const [year, month, day] = date.split('-');
      return `${day}-${month}-${year} ${time}`;
    }

    const [fileName, setFileName] = useState("");
    
    // const handleFileChange = (event) => {
    //     const file = event.target.files[0];
    //     if (file) {
    //       setFileName(file.name);
    //     } else {
    //       setFileName("");
    //     }
    // };


    const sortByTimestamp = (data) => {
      return data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    };


    const getHistoryBatteryDevice = async (id, startOfDay, endOfDay) => {     
      let success = false;
      while (!success) {   
        try {
          const response = await axios.get(
            `${url}/History/GetBatteryHistory/DeviceId=${id}?startDate=${startOfDay}&endDate=${endOfDay}`  
          );
          const PositionDeviceData = response.data;
    
          if (PositionDeviceData) {


             // Gọi hàm sắp xếp
            const sortedData = sortByTimestamp(PositionDeviceData);

            setListHistorBattery(sortedData); 
            console.log('PositionDeviceData', PositionDeviceData);         
            success = true;   
          } else {
            alert('ReLoad');
          }
        } catch (error) {
          console.error('getPositionDevice error, retrying...', error);     
          await new Promise(resolve => setTimeout(resolve, 1000)); 
        }
      }
    };


    
const scanBluetoothDevices = async () => {
  try {
      const device = await navigator.bluetooth.requestDevice({
          acceptAllDevices: true,
          optionalServices: ['battery_service']
      });

      console.log(device)

      if (device) {
          setDevices(prevDevices => [...prevDevices, device.name || 'Không có tên']);
      }
  } catch (error) {
      console.error('Lỗi khi quét thiết bị Bluetooth:', error);
  }
};

const handleScanAndShow = async () => {
  setIsVisible(true);
  await scanBluetoothDevices();
};

    const callAPIUpdateObjectById = async (bluetoothStatus) => {
      let success = false;
      while (!success) {   
        try {
          const response = await axios.patch(`${url}/GPSObject/UpdateObjectInformation?ObjectId=${ObjectIsConnect.id}`, 
            {
              "Longitude": ObjectIsConnect.longitude,
              "Latitude": ObjectIsConnect.latitude,
              "SafeRadius": ObjectIsConnect.safeRadius,
              "CurrentTime": "0001-01-01T00:00:00",   
              "AlarmTime": `0001-01-01T${time}`,
              "BlueTooth": bluetoothStatus,  // ✅ Nhận giá trị "ON" hoặc "OFF"
              "Emergency": true,
              "PhoneNumber": "0888927971"
            }
          );

          const ObjectData = response.data;
          if (ObjectData === 'Update successfully!') { 
            toast.success(`Bluetooth đã được ${bluetoothStatus === "ON" ? "bật" : "tắt"} thành công`);
            success = true;
          } else {  
            toast.error("Xác lập không thành công");
          }
        } catch (error) {
          console.error("Get All Logger error, retrying...", error);
          await new Promise(resolve => setTimeout(resolve, 1000)); 
        }
      }
    };

   

    // const callAPIUpdateObjecEmergencytById = async (StatusEmergency) => {
    //   console.log('StatusEmergency',StatusEmergency)
    //   let success = false;
    //   while (!success) {   
    //     try {
    //       const response = await axios.patch(`${url}/GPSObject/UpdateObjectInformation?ObjectId=${ObjectIsConnect.id}`, 
    //         {
    //           "Longitude": ObjectIsConnect.longitude,
    //           "Latitude": ObjectIsConnect.latitude,
    //           "SafeRadius": ObjectIsConnect.safeRadius,
    //           "CurrentTime": "0001-01-01T00:00:00",   
    //           "AlarmTime": `0001-01-01T${time}`,
    //           "BlueTooth": isOn ? "ON" : "OFF",  // ✅ Nhận giá trị "ON" hoặc "OFF"
    //           "Emergency": StatusEmergency,
    //           "PhoneNumber": "0888927971"
    //         }
    //       );
    //       const ObjectData = response.data;
    //       console.log(response.data)
    //       if (ObjectData === 'Update successfully!') { 
    //         toast.success(`Trạng thái cảnh báo là ${StatusEmergency ? "Khẩn cấp" : "Bình thường"}`);
    //         success = true;
    //       } else {  
    //         toast.error("Xác lập không thành công");
    //       }
    //     } catch (error) {
    //       console.error("callAPIUpdateObjecEmergencytById error, retrying...", error);
    //       await new Promise(resolve => setTimeout(resolve, 1000)); 
    //     }
    //   }
    // };


    // const callAPIUpdateObjecAlarmTimetById = async (timeObject) => {
    //   let success = false;
    //   while (!success) {      
    //     try {
    //       const response = await axios.patch(`${url}/GPSObject/UpdateObjectInformation?ObjectId=${ObjectIsConnect.id}`, 
    //         {
    //           "Longitude": ObjectIsConnect.longitude,
    //           "Latitude": ObjectIsConnect.latitude,
    //           "SafeRadius": ObjectIsConnect.safeRadius,
    //           "CurrentTime": "0001-01-01T00:00:00",   
    //           "AlarmTime": `0001-01-01T${timeObject}`,
    //           "BlueTooth": isOn ? "ON" : "OFF",  // ✅ Nhận giá trị "ON" hoặc "OFF"
    //           "Emergency": isEmergency,    
    //           "PhoneNumber": "0888927971"
    //         }
    //       );

    //       const ObjectData = response.data;
    //       console.log(response.data)
    //       if (ObjectData === 'Update successfully!') { 
    //         toast.success(`Thời gian báo thức là ${timeObject} hàng ngày`);
    //         success = true;
    //       } else {  
    //         toast.error("Xác lập không thành công");
    //       }
    //     } catch (error) {
    //       console.error("callAPIUpdateObjecEmergencytById error, retrying...", error);
    //       await new Promise(resolve => setTimeout(resolve, 1000)); 
    //     }
    //   }
    // };


    // const handleClickAlarmTime = async () => {
    //   setIsPressed(true);
    //   await callAPIUpdateObjecAlarmTimetById(time);
    //   setTimeout(() => setIsPressed(false), 200); // Giữ hiệu ứng 200ms
    // };



    
    //const firstRender = useRef(true); // Biến cờ để kiểm tra lần đầu render


    // useEffect(() => {
    //   if (firstRender.current) {
    //     firstRender.current = false; // Đánh dấu lần đầu đã render
    //     return; // Ngăn không chạy lần đầu
    //   }
  
    //   console.log("Đã chọn xong giờ:", time);
    //   // Có thể gọi API hoặc xử lý dữ liệu tại đây
    // }, [time]); // Chạy khi `time` thay đổi, nhưng bỏ qua lần đầu tiên



    // const formatDateTime = (date) => {
    //   if (!date) return "No date selected";
    //   const hours = date.getHours().toString().padStart(2, '0');
    //   const minutes = date.getMinutes().toString().padStart(2, '0');
    //   const seconds = date.getSeconds().toString().padStart(2, '0');
    //   const day = date.getDate().toString().padStart(2, '0');
    //   const month = (date.getMonth() + 1).toString().padStart(2, '0');
    //   const year = date.getFullYear();
    //   return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    // };

    // const handleShowRoute = () => {    
    //         const startOfDay = formatDateTime(valueFrom);
    //         const endOfDay = formatDateTime(valueTo);
    //         getHistoryBatteryDevice(idDevice, startOfDay, endOfDay);  
    //         if(startOfDay < endOfDay){
    //         }
    //         else{
    //           toast.error('Thời gian không hợp lệ')
    //         }                    
    // }

// const formattedData = listHistorBattery.map((item) => ({  
//   time: moment(item.timestamp).format("HH:mm"), // Hiển thị giờ phút trên trục X
//   timestamp: item.timestamp, // Giữ nguyên timestamp để hiển thị tooltip
//   value: item.value,
// }));

// const CustomTooltip = ({ active, payload }) => {
//   if (active && payload && payload.length) {
//     const dateTime = moment(payload[0].payload.timestamp).format("DD/MM/YYYY HH:mm:ss");
//     return (
//       <div className="bg-white p-2 border border-gray-300 shadow-md rounded">
//         <p className="text-xs text-gray-700">{dateTime}</p>
//         <p className="text-sm font-semibold">{`Pin: ${payload[0].value}%`}</p>
//       </div>
//     );
//   }
//   return null;
// };

    // const extractTime = (dateTimeString) => {
    //   return dateTimeString.split("T")[1]; // Lấy phần sau "T"
    // };


  

    // const toggleSwitch = () => {
    //   const newStatus = !isOn;  
    //   setIsOn(newStatus);
    //   callAPIUpdateObjectById(newStatus ? "ON" : "OFF");
    // };

    // const toggleSwitchWarning = () => {   
    //   const newStatus = !isEmergency;        
    //   setIsEmergency(newStatus);        
    //   callAPIUpdateObjecEmergencytById(newStatus);
          
    // };

    // const [file, setFile] = useState(null);
    // const [message, setMessage] = useState("");

    // const handleFileChange = (event) => {   
    //   setFile(event.target.files[0]);
    // };


    // const handleUpload = async () => {
    //   if (!file) {
    //     setMessage("Vui lòng chọn một file .bin");
    //     return;
    //   }   
  
    //   const formData = new FormData();
    //   formData.append("firmware", file);
  
    //   try {
    //     const response = await axios.post(
    //       "https://mygps.runasp.net/Firmware/upload/version=1", // API của bạn
    //       formData,
    //       {
    //         headers: {
    //           "Content-Type": "multipart/form-data",
    //         },
    //       }
    //     );
  
    //     if (response.status === 200) {
    //       setMessage("Tải lên thành công!");
    //     } else {
    //       setMessage("Lỗi khi tải lên!");
    //     }
    //   } catch (error) {
    //     setMessage(`Lỗi: ${error.message}`);
    //   }
    // };


    


    // const handleImageUpload = (event) => {
    //   const file = event.target.files[0];
    //   if (file) {
    //     const imageUrl = URL.createObjectURL(file); // Chuyển ảnh thành URL
    
       
    //     const response = await axios.post(`${url}/Image/upload` , imageUrl );  

    //     console.log(response)  



           
    //     if(response.data){

    //       CallAPIUpdateImgObjectById(response.data)  
    //       toast.success('Thêm đối tượng thành công')  
    //       navigate('/Objects')    
                               
    //     }
    //     else{
    //       toast.error('Thêm thiết bị không thành công')
    //     }
        
    //     setImage(imageUrl);

    //     setObject((prevDevice) => ({
    //       ...prevDevice, // Giữ lại các thuộc tính cũ
    //       imagePath: imageUrl 
    //     }))  
    //     setchoseImage(pre=>!pre)
    //   }
    // };


    // const handleImageUpload = async (event) => { // Thêm async ở đây
    //   const file = event.target.files[0];
    //   if (file) {
    //     const imageUrl = URL.createObjectURL(file); // Chuyển ảnh thành URL
    //     try {
    //       const response = await axios.post(`${url}/Image/upload`, imageUrl);  
    
    //       console.log('URL IMAGE', response);  
    
    //       if (response.data) {
    //         setObject((prevDevice) => ({
    //           ...prevDevice, // Giữ lại các thuộc tính cũ
    //           imagePath: response.data
    //         })); 
    //         setImage(response.data);
    //         setchoseImage(pre => !pre);
    //       } else {
    //         toast.error('Lỗi');
    //       }
        
    //     } catch (error) {
    //       console.error("Lỗi khi tải ảnh lên:", error);
    //       toast.error("Có lỗi xảy ra khi tải ảnh lên");
    //     }
    //   }
    // };



    const handleImageUpload = async (event) => {
      const file = event.target.files[0];
      if (!file) return;
  
      const reader = new FileReader();
          reader.onload = (e) => {
            setImage(e.target.result);
          };
          reader.readAsDataURL(file);
      const formData = new FormData();
      formData.append("file", file);
      try {
          const response = await axios.post("https://mygps.runasp.net/Image/upload", formData, {
              headers: { "Content-Type": "multipart/form-data" }
          });
          console.log(response)
          setImageURL(response.data.url)
      } catch (error) {
          console.error("Lỗi upload:", error);
          alert("Lỗi upload!");
      } finally {                        
          
      }
    };

    const CallAPIDeleteDevice = async () => {      
      let success = false;  
      while (!success) {
        try {
          const response = await axios.delete(`${url}/GPSObject/DeleteObjectById?objectId=${Object.id}`);     
          const LoggerData = response.data;
    
          // Kiểm tra nếu dữ liệu nhận được hợp lệ
          if (LoggerData) {
            
    
            success = true; // Dừng vòng lặp khi dữ liệu hợp lệ và được xử lý
            toast.success('Xóa đối tượng thành công')
            navigate('/Objects')      
          } else {   
            toast.error('Xóa thiết bị không thành công')
            alert('ReLoad');
          }
        } catch (error) {
          console.error('Get All Devices error, retrying...', error);  
          await new Promise(resolve => setTimeout(resolve, 1000)); // Đợi 2 giây trước khi thử lại
        }
      }
    };


    const handleDeleteDevice=() => {
      const ConfirmdeleteDevice = window.confirm("Bạn có chắc chắn muốn xóa đối tượng này không?");
      if (ConfirmdeleteDevice) {
        CallAPIDeleteDevice()
       
      } else {
        console.log("Action canceled.");
      }
          
    }
    


return (
    <div className='fatherInforDetailObject'>    
      <div className='wrapperInforDetailObject'>   

              <div className='InforDetailObjectTitle'>  
                  <div className='InforDetailObjectTitleItem'>
                      Thông tin đối tượng
                  </div>  
              </div>     
                
              <div className='imgObject'>    
              
                                 <div
                                      className="image-containerDetailObject"                  
                                 >
                                  {image ? ( 
                                             <img src={image} alt="Uploaded" className="uploaded-imageDevice" 
                                                
                                             />
                                           ) : (
                                             <span className="placeholder-text">Chưa chọn ảnh</span>
                                           )}
                                  </div>
                                  <div
                                       className='buttonUploadDetailObject'
                                       onClick={() => document.getElementById("fileInput").click()}
                                     >
                                       <MdPhotoCamera className='IconButtonUploadDetailObject'/>
                                  </div>   
                                 
              </div>
              <input
                      type="file"
                      id="fileInput"
                      style={{ display: "none" }}
                      accept="image/*"
                      onChange={handleImageUpload}
                    />

              {isVisible && (
                <div className="absolute left-1/2 transform -translate-x-1/2 w-[400px] max-h-[500px] overflow-auto bg-white border rounded-2xl shadow-xl p-6 z-50">
                    <button 
                        onClick={() => setIsVisible(false)} 
                        className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-xl font-bold">×
                    </button>
                    <h2 className="text-xl font-bold text-center text-gray-700 mb-4">🔍 Danh sách thiết bị Bluetooth</h2>
                    <div className="border-t mt-4 pt-3">
                        {devices.length > 0 ? (
                            <ul className="list-none space-y-2">
                                {devices.map((device, index) => (
                                    <li key={index} className="px-4 py-2 bg-gray-100 rounded-lg shadow-sm flex items-center gap-2">
                                        <span className="text-blue-500 text-lg">🔹</span>
                                        <span className="text-gray-800 font-medium">{device}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-center text-gray-500">Chưa có thiết bị nào được tìm thấy.</p>
                        )}
                    </div>
                </div>
              )}


          {isLoading ?  (  
                    <div className="loadingContainer">
                      <div className="spinner"></div> {/* Hiển thị hiệu ứng loading */}
                      <p>Đang tải dữ liệu...</p>
                    </div>
                  )     
              
              :

                  (


                  <div
                    className='wrapinformationObject' 
                  >   
                          
                        <div className='informationObjectItem'>
                          <div className='informationObjectItemFirst'>
                              <div className='informationObjectItemFirstIcon'>
                                  <MdDriveFileRenameOutline className='informationObjectItemIcon'/>
                              </div>  
                              <div className='informationObjectItemFirstTitle'>Tên đối tượng:</div>
                          </div>                      
                                                                          
                          <div className='informationObjectItemSecond'>
                                <div className='informationObjectItemSecondText'>                                                                          
                                    {Object.name}                                        
                                </div>                                             
                          </div>             
                                     
                        </div>
                      
                        <div className='informationObjectItem'>
                          <div className='informationObjectItemFirst'>
                              <div className='informationObjectItemFirstIcon'>
                                  <GrConnect className='informationObjectItemIcon'/>  
                              </div>        
                              <div className='informationObjectItemFirstTitle'>Thiết bị kết nối:</div>
                          </div> 
                            
                          <div className='informationObjectItemSecond'>
                                <div className='informationObjectItemSecondText'>
                                        {DeviceConnectObject?.name || "Chưa có"}   
                                </div>                                      
                          </div>

                        </div>  
   

                        <div className='informationObjectItem'>
                          <div className='informationObjectItemFirst'>
                              <div className='informationObjectItemFirstIcon'>
                                  <MdOutlineStickyNote2 className='informationObjectItemIcon'/> 
                              </div>        
                              <div className='informationObjectItemFirstTitle'>Mô tả:</div>
                          </div> 
                            
                          <div className='informationObjectItemSecond'>
                                <div className='informationObjectItemSecondText'>
                                        {Object?.description || "Chưa có"}   
                                </div>                                      
                          </div>

                        </div>

                           <div className='informationObjectItemButton'
                                                         
                                                          onClick={handleDeleteDevice}
                                                    
                                                    >
                                                           <div  className='butonDeleteObject' >
                                                              Xóa đối tượng
                                                           </div>
                                                           
                                                                
                                                            
                            </div>




                        {/* <div className='informationDeviceItem'>
                          <div className='informationDeviceItemFirst'>
                              <div className='informationDeviceItemFirstIcon'>
                                  <GrConnect className='informationDeviceItemIcon'/>  
                              </div>          
                              <div className='informationDeviceItemFirstTitle'>FirmWare:</div>
                          </div>    
                            
                          <div className='informationDeviceItemSecond'>
                                <div className='informationDeviceItemSecondText'>
                                    
                                    <input type="file" accept=".bin" onChange={handleFileChange} />
                                    <button onClick={handleUpload}>Upload</button>
                                    {message && <p>{message}</p>}
                                </div>                                
                          </div>  
                        </div> */}

                        {/* <div className='informationObjectItem'>
                          <div className='informationObjectItemFirst'>
                            <div className='informationObjectItemFirstIcon'>
                              <FaBluetooth className='informationObjectItemIcon'/>  
                            </div>     
                            <div className='informationObjectItemFirstTitle'>Bluetooth:</div>
                          </div>               
                       
                          <div className="informationObjectItemSecond">              

                          <div className="flex items-center gap-3">
                            <div 
                                className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition-all ${isOn ? 'bg-green-500' : 'bg-red-500'}`} 
                                onClick={toggleSwitch}
                            >
                                <div 
                                    className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${isOn ? 'translate-x-7' : ''}`}
                                ></div>
                            </div>
                            <span className={`text-lg font-semibold ${isOn ? 'text-green-500' : 'text-red-500'}`}>{isOn ? "ON" : "OFF"}</span>
                          </div>
                          </div>
                        </div> */}

                        {/* <div className='informationObjectItem'>
                          <div className='informationObjectItemFirst'>
                            <div className='informationObjectItemFirstIcon'>   
                              <AiFillWarning className='informationObjectItemIcon'/>    
                            </div>       
                            <div className='informationObjectItemFirstTitle'>Mức cảnh báo:</div>
                          </div> 

                          <div className="informationObjectItemSecond">
                              <div className="flex items-center gap-3">
                                <div 
                                    className={`w-20 h-7 flex items-center rounded-full p-1 cursor-pointer transition-all ${isEmergency ? 'bg-red-500' : 'bg-green-500'}`} 
                                    onClick={toggleSwitchWarning}
                                >
                                    <div 
                                        className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${isEmergency ? 'translate-x-12' : ''}`}
                                    ></div>  
                                </div>
                                <span className={`text-lg font-semibold ${isEmergency ? 'text-red-500' : 'text-green-500'}`}>{isEmergency ? "EMERGENCY" : "NORMAL"}</span>
                              </div>
                                    
                          </div>
                        </div>  */}
                        
                                 
                </div>)}


               

                                  
          
          
      </div>
      
    </div>
  )
}

export default DetailObject
