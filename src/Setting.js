import React, { useEffect, useState, useContext,useRef  } from 'react'
import './Setting.scss'
import { IoIosInformationCircle } from "react-icons/io";
import { FaSimCard } from "react-icons/fa";
import { RiAlarmWarningFill } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import { FaPen } from "react-icons/fa";
import { HiOutlinePhotograph } from "react-icons/hi";
import {Link,useNavigate} from "react-router-dom";
import { BsDeviceSsdFill } from "react-icons/bs";
import ModalSim from './settingDevice/Sim';
import ModalWarning from './settingDevice/Warning';
import { MdPhotoCamera } from "react-icons/md";
import axios from 'axios';
import { url } from './services/UserService'; 
import {  toast } from 'react-toastify';
import { useParams } from "react-router-dom";
import { FaCheck } from "react-icons/fa";


function Setting() {    
   const [imageURL, setImageURL] = useState('');
    const inputRef = useRef(null); // Tạo ref để tham chiếu đến input
    const navigate = useNavigate();
    const {id} = useParams(); // Lấy tham số động từ URL
    const [showModalSim, setshowModalSim] = useState(false);
    const [showModalWarning, setshowModalWarning] = useState(false);
    const [name, setName] = useState('');
    const [Device, setDevice] = useState({id:'', name: ''});  
    const [isInputEnabled, setIsInputEnabled] = useState(true); // Trạng thái điều khiển input
    const [isDisPlayPen, setisDisPlayPen] = useState(true); // Trạng thái điều khiển input
    const [isDisplayCheck, setisDisplayCheck] = useState(false); // Trạng thái điều khiển input
    const [image, setImage] = useState(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const isDragging = useRef(false);
    const startPosition = useRef({ x: 0, y: 0 });
    const [choseImage, setchoseImage] = useState(false);


    useEffect(()=>{
      CallAPIGetDeviceById()  
    },[])
    
    useEffect(()=>{
      if(Device.id !== ''){
        CallAPIUpdateImgDeviceById()
      }
    },[choseImage])

    useEffect(()=>{
      if(Device.id !== ''){
        setDevice((prevDevice) => ({
                  ...prevDevice, // Giữ lại các thuộc tính cũ
                  imagePath: imageURL 
        }))  
        setchoseImage(pre=>!pre)
      }
    },[imageURL])


    const CallAPIUpdateImgDeviceById = async () => {      
      let success = false;  
      while (!success) {
        try {
          const response = await axios.patch(`${url}/GPSDevice/UpdateGPSDeviceStatus?GPSDeviceId=${id}`, Device    );       
          const LoggerData = response.data;
    
          // Kiểm tra nếu dữ liệu nhận được hợp lệ
          if (LoggerData === 'Update successful!') {
            toast.success('Thay đổi ảnh thiết bị thành công')
            success = true; // Dừng vòng lặp khi dữ liệu hợp lệ và được xử lý
            
          } else {
            toast.error('Xóa thiết bị không thành công')
            alert('ReLoad');
          }
        } catch (error) {
          console.error('Get All Devices error, retrying...', error);  
          await new Promise(resolve => setTimeout(resolve, 1000)); // Đợi 2 giây trước khi thử lại
        }
      }

      await CallAPIGetDeviceById()

    };

    // const handleImageUpload = (event) => {
    //   const file = event.target.files[0];
    //   if (file) {
    //     const imageUrl = URL.createObjectURL(file); // Chuyển ảnh thành URL
    //     setImage(imageUrl);

    //     setDevice((prevDevice) => ({
    //       ...prevDevice, // Giữ lại các thuộc tính cũ
    //       imagePath: imageUrl 
    //     }))  
    //     setchoseImage(pre=>!pre)
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

    const handleMouseDown = (event) => {
      isDragging.current = true;
      startPosition.current = {
        x: event.clientX - position.x,
        y: event.clientY - position.y,
      };
    };
  
    const handleMouseMove = (event) => {
      if (!isDragging.current) return;
      const newX = event.clientX - startPosition.current.x;
      const newY = event.clientY - startPosition.current.y;
      setPosition({ x: newX, y: newY });
    };
  
    const handleMouseUp = () => {
      isDragging.current = false;
    };

    const handleshowModalSim= ()=> {   
      setshowModalSim(true) 
      }
    const handleCloseModalSim=()=>{
      setshowModalSim(false)
    }
    
    const handleshowModalWarning= ()=> {   
      setshowModalWarning(true)     
      }
    const handleCloseModalWarning=()=>{
      setshowModalWarning(false)   
    }   


    const CallAPIDeleteDevice = async () => {   
      let success = false;
      while (!success) {
        try {
          const response = await axios.delete(`${url}/GPSDevice/DeleteGPSDevice?GPSDeviceId=${id}`);     
          const LoggerData = response.data;
    
          // Kiểm tra nếu dữ liệu nhận được hợp lệ
          if (LoggerData) {
            
    
            success = true; // Dừng vòng lặp khi dữ liệu hợp lệ và được xử lý
            toast.success('Xóa thiết bị thành công')
            navigate('/Devices')      
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
    const CallAPIGetDeviceById = async () => {      
      let success = false;  
      while (!success) {
        try {
          const response = await axios.get(`${url}/GPSDevice/GetGPSDeviceById?Id=${id}`);     
          const LoggerData = response.data;
    
          // Kiểm tra nếu dữ liệu nhận được hợp lệ
          if (LoggerData) {
            setDevice(LoggerData)
            success = true; // Dừng vòng lặp khi dữ liệu hợp lệ và được xử lý
            
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
    const CallAPIUpdateDeviceById = async () => {      
      let success = false;  
      while (!success) {
        try {
          const response = await axios.patch(`${url}/GPSDevice/UpdateGPSDeviceStatus?GPSDeviceId=${id}`, Device    );       
          const LoggerData = response.data;
    
          // Kiểm tra nếu dữ liệu nhận được hợp lệ
          if (LoggerData === 'Update successful!') {
            toast.success('Thay đổi tên thiết bị thành công')
            success = true; // Dừng vòng lặp khi dữ liệu hợp lệ và được xử lý
            
          } else {
            toast.error('Xóa thiết bị không thành công')
            alert('ReLoad');
          }
        } catch (error) {
          console.error('Get All Devices error, retrying...', error);  
          await new Promise(resolve => setTimeout(resolve, 1000)); // Đợi 2 giây trước khi thử lại
        }
      }

      await CallAPIGetDeviceById()

    };


    const handleDeleteDevice=() => {
      const ConfirmdeleteDevice = window.confirm("Bạn có chắc chắn muốn xóa thiết bị này không?");
      if (ConfirmdeleteDevice) {
        CallAPIDeleteDevice()
       
      } else {
        console.log("Action canceled.");
      }
          setshowModalWarning(false)   
    }   

    const handleClickPen = () => {    
      setisDisPlayPen(false); // Cho phép input nhập liệu
      
      setisDisplayCheck(true); // Cho phép input nhập liệu

      setTimeout(() => {
        inputRef.current && inputRef.current.focus(); // Đặt focus vào input
      }, 0);
    };
    const handleClickCheck = () => {     
      setisDisPlayPen(true); // Cho phép input nhập liệu
      setisDisplayCheck(false); // Cho phép input nhập liệu
      CallAPIUpdateDeviceById()
     
    };

    useEffect(()=>{
        if(Device.id !== ''){
          setImage(Device.imagePath)
        }
    },[Device])

  console.log('Device', Device)
  return (
    <>
    <div className='fatherSetting'>
        <div className='wrapperSetting'>
                <div className='SettingTitle'>
                    <div className='SettingTitleItem'>
                          Thiết lập thiết bị
                    </div> 
                </div>
                <div className='SettingFirst'>
                  <div className="Wrapimage">
                  <div
                       className="image-containerDevice"                  
                  >
                   {image ? ( 
                              <img src={image} alt="Uploaded" className="uploaded-imageDevice" 
                                 
                              />
                            ) : (
                              <span className="placeholder-text">Chưa chọn ảnh</span>
                            )}
                  </div>
                    <div
                        className='buttonUploadDevice'
                        onClick={() => document.getElementById("fileInput").click()}
                      >
                        <MdPhotoCamera className='IconButtonUploadDevice'/>
                      </div>   
                  </div>
                    
                    <input
                      type="file"
                      id="fileInput"
                      style={{ display: "none" }}
                      accept="image/*"
                      onChange={handleImageUpload}
                    />

                    <div className='divChangeNameDevice'>
                        <input 
                          type="email" class="form-control" id="exampleInputEmail1" 
                          
                          disabled={isDisPlayPen}     
                          value={Device.name}   

                          ref={inputRef} // Gắn ref vào input  
                          onChange={(e) => setDevice((prevDevice) => ({
                                              ...prevDevice, // Giữ lại các thuộc tính cũ
                                              name: e.target.value // Thay đổi chỉ thuộc tính `name`
                                    }))}                                                 
                        /> 

                        {isDisPlayPen ? <FaPen className='iconPen'
                          onClick={handleClickPen}
                        /> : '' }

                        { isDisplayCheck? 
                        <FaCheck className='iconPen'
                          onClick={handleClickCheck}
                        /> : ''}

                    </div>
                    
                </div>
                <div className='Settingline'>

                </div>
                <div className='SettingSecond'>
                     <div className='divSettingSecond'>
                          <Link  to={`/Devices/Setting/${id}/Detail`}>      
                            <div className='SettingSecondItem'    
                                        // onClick={handleshowModalDetail}
                            >  
                                    <div >
                                        <IoIosInformationCircle className='InforIcon'/>
                                    </div>
                                    <div>
                                        Cấu hình thiết bị  
                                    </div>
                            </div>  
                          </Link>
                     </div>
                     {/* <div className='divSettingSecond'>
                            <Link  to="/Devices/Setting/1/ObjectTraking">   
                                <div    
                                        className='SettingSecondItem'
                                        onClick={handleshowModalSim}
                                >
                                    <div>
                                        <FaSimCard className='SimIcon'/>   
                                    </div>
                                    <div>
                                        Thông tin gói cước
                                    </div>
                                </div> 
                            </Link>    
                     </div> */}

                     
                     {/* <div className='divSettingSecond'>
                            <Link  to="/Devices/Setting/1/ObjectTraking">                             
                                <div className='SettingSecondItem'>
                                    <div>
                                        <BsDeviceSsdFill className='TrackingIcon'/>
                                    </div>
                                    <div>
                                        Đối tượng theo dõi
                                    </div>   
                                </div>
                            </Link> 
                     </div> */}
                                       
                            <div 
                                  className='SettingSecondItem DeleteDevice'
                                  onClick={handleDeleteDevice}
                            
                            >
                                    <div>
                                        <MdDelete />
                                    </div>
                                    <div>
                                        Xóa thiết bị
                                    </div>
                            </div>
                  
                </div>

                
        </div>
                
    </div>
                <ModalSim   
                            show={showModalSim} 
                            handleClose={handleCloseModalSim}  
                />
                <ModalWarning   
                            show={showModalWarning} 
                            handleClose={handleCloseModalWarning}  
                />
    </>
  )
}

export default Setting
