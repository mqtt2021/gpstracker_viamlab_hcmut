import React,{useState,useRef} from 'react'
import DatePicker from 'react-datepicker';
import './AddObject.scss'
import Table from 'react-bootstrap/Table';
import { MapContainer, TileLayer, Marker, Popup, useMapEvent   } from "react-leaflet";
import L from 'leaflet'
// import imgObject from './asset/images/  ImgObject.jpg'  
import { MdDriveFileRenameOutline } from "react-icons/md";
import { TbDimensions } from "react-icons/tb";
// import { LuNotebookText } from "react-icons/lu";
import { GiPositionMarker } from "react-icons/gi";
import { PiMapPinSimpleAreaBold } from "react-icons/pi";
import { FaFile } from "react-icons/fa";
import { MdPhotoCamera } from "react-icons/md";
import axios from 'axios';
import { url } from './services/UserService'
import {  toast } from 'react-toastify';
import { useNavigate, useLocation, Link  } from 'react-router-dom';
import { MdOutlineStickyNote2 } from "react-icons/md";
import useGeoLocation from "./useGeoLocation"  
                             
function AddObject() {                                    
    const locationUser = useGeoLocation()  // lấy vị trí của người thay pin
    const navigate = useNavigate();
    const [nameObject, setnameObject] = useState('');
    const [descriptionObject, setdescriptionObject] = useState('');
    const [valueFrom, onChangeFrom] = useState(new Date());    
    const [valueTo, onChangeTo] = useState(new Date());
    const [showModalUpdateFirmware, setshowModalUpdateFỉmware] = useState(false);
    const [center, setCenter] = useState({ lat: 10.81993366729437,lng: 106.69843395240606  });
    const [zoomLevel, setZoomLevel] = useState(18);
    const [locationNewBin, setlocationNewBin] = useState({ lat: 0, lng: 0 })
    const [imageURL, setImageURL] = useState('');
    const mapRef = useRef() 

    const data = [
      { time: '04/01/2025 01:00:00', pin: 45 },
      { time: '04/01/2025 01:00:00', pin: 30 },
      { time: '04/01/2025 01:00:00', pin: 22 },
    ];

      //  const markerIcon = new L.Icon({
      //     iconUrl: require("./asset/images/maker_user.png"),
      //     iconSize: [25, 30],   
      //     iconAnchor: [15, 30], //[left/right, top/bottom]     
      //     popupAnchor: [0, 0], //[left/right, top/bottom]
      // })


    const handleshowModalUpdateFirmware= () => {   
      setshowModalUpdateFỉmware(true)     
    }
    const handleCloseModalUpdateFirmware=() => {
      setshowModalUpdateFỉmware(false)   
    }  

      const [fileName, setFileName] = useState("");
    
      const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
          setFileName(file.name);
        } else {
          setFileName("");
        }
      };

      const handleMapClickGetLocation = (e) => {  // lấy tọa độ khi Click vô Map
        const latLocation =  e.latlng.lat
        const lngLocation =  e.latlng.lng
      
      setlocationNewBin({ lat: latLocation, lng: lngLocation })
      };



          const [image, setImage] = useState(null);
          const [position, setPosition] = useState({ x: 0, y: 0 });
          const isDragging = useRef(false);
          const startPosition = useRef({ x: 0, y: 0 });
        
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

          const APIPostObject = async () => {   
            try {
              const phoneNumer = sessionStorage.getItem('phoneNumer');
              const response = await axios.post(`${url}/GPSObject/CreateNewObject` , {
                
                  customerPhoneNumber: phoneNumer,
                  name: nameObject,
                  longitude:  108.5,
                  latitude:  23.4,
                  description: descriptionObject,     
                  imagePath: imageURL,
                  safeRadius: 10,
                  size: "string"
              });
              console.log(response)  
                 
              if(response.data){
                toast.success('Thêm đối tượng thành công')  
                navigate('/Objects')    
                                     
              }
              else{
                toast.error('Thêm thiết bị không thành công')
              }
               
            } catch (error) {
              toast.error('Đăng kí không thành công')
            }
          };

          const handleAddObject = () => {
                 if(nameObject === '' || descriptionObject === '' || image === null){  
                          toast.error('Bạn chưa nhập đủ thông tin')  
                          return  
                        }
                APIPostObject()
          }

          
  
  return (
    <div className='fatherAddObject'>
      <div className='wrapperAddObject'>

                          <div className='AddObjectTitle'>
                              <div className='AddObjectTitleItem'>
                                  Tạo mới đối tượng
                              </div> 
                          </div>
                         

                          <div className='fatherAddImage'>
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
                          
                                              
                                              
                                          </div>
                <div
                  className='wrapAddObject' 
                >   
                             
                        <div className='wrapAddObjectItem'>
                          <div className='wrapAddObjectItemFirst'>
                              <div className='divIconAddObject'>
                                  <MdDriveFileRenameOutline className='IconAddObject'/>
                              </div>  
                              <div className='titleAddObject'>Tên đối tượng:</div>
                          </div> 
                          
                          <div className='wrapAddObjectItemSecond'>  
                              <input type="text" class="input-bottom-border" placeholder="Nhập nội dung"
                                  value = {nameObject}
                                  onChange={(e) => setnameObject(e.target.value)}
                              />                              
                          </div>

                        </div>
                       
                        <div className='wrapAddObjectItem'>
                          <div className='wrapAddObjectItemFirst'>  
                              <div className='divIconAddObject'>
                                  <MdOutlineStickyNote2 className='IconAddObject'/>
                              </div>  
                              <div className='titleAddObject'>Mô tả:</div>
                          </div> 
                          
                          <div className='wrapAddObjectItemSecond'>  
                              <input type="text" class="input-bottom-border" placeholder="Nhập nội dung"
                                      value = {descriptionObject}
                                      onChange={(e) => setdescriptionObject(e.target.value)}

                              />                              
                          </div>

                        </div>


                        {/* <div className='wrapAddObjectItem wrapAddObjectItemArea'>
                          <div className='wrapAddObjectItemFirst'>  
                              <div className='divIconAddObject'>
                                  <PiMapPinSimpleAreaBold className='IconAddObject'/> 
                              </div>  
                              <div className='titleAddObject'>Chọn vùng an toàn:</div>
                          </div> 
                          
                          <div className='wrapAddObjectItemSecond'> 
                                    <div 
                                          className='divButtonSafeArea'
                                        
                                    >  
                               
                                      <Link to={`/SafeAreaAddObjet`}>   
                                                                                                                                                                                      
                                              Chọn
                                                                                                                  
                                                                                                                  
                                      </Link>  
                                    </div>                                                              
                          </div>

                        </div> */}


                        {/* <div className='wrapAddObjectItem'>
                          <div className='wrapAddObjectItemFirst'>
                              <div className='divIconAddObject'>
                                  <GiPositionMarker className='IconAddObject'/>
                              </div>  
                              <div className='titleAddObject'>Vị trí an toàn:</div>
                          </div> 
                          
                          <div className='wrapAddObjectItemSecond'>  
                              <input type="text" class="input-bottom-border" placeholder="Nhập nội dung"/>                              
                          </div>

                        </div> */}

                        {/* <div className='wrapAddObjectItem'>  
                          <div className='wrapAddObjectItemFirst'>
                              <div className='divIconAddObject'>
                                  <PiMapPinSimpleAreaBold className='IconAddObject'/>
                              </div>  
                              <div className='titleAddObject'>Vùng an toàn:</div>
                          </div> 
                          
                          <div className='wrapAddObjectItemSecond'>  
                              <input type="text" class="input-bottom-border" placeholder="Nhập nội dung"/>                              
                          </div>
                        </div> */}
                     
                        <div className='divButtonAdd'
                              onClick={handleAddObject}
                        >  
                            <button className='buttonAdd'>Xác nhận</button>
                        </div>

                        {/* <div className='mationDeviceItem mationDeviceItemUpdateFirmware'>
                            <div className='mationDeviceItemTitle'>Cập nhật firmware</div>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <input
                              type="file"
                              onChange={handleFileChange}
                              style={{ cursor: "pointer" }}
                            />      
                            <div>
                              <button 
                                        type="button" 
                                        class="btn btn-success"             
                            >Cập nhật</button>   
                            </div>                      
                            </div>
                        </div> */}
                </div>                                        
      </div>
    </div>
  )
}
function MyClickHandlerGetLocation({ onClick }) {
  const map = useMapEvent('click', (e) => {
    onClick(e);
  });
  
  return null;
}
export default AddObject
