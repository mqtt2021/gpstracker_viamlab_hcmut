import React,{useState,useRef} from 'react'
import DatePicker from 'react-datepicker';
import './EditInforObject.scss'
import Table from 'react-bootstrap/Table';
import { MapContainer, TileLayer, Marker, Popup, useMapEvent   } from "react-leaflet";
import L from 'leaflet'
import imgObject from './asset/images/ImgObject.jpg'  
import { MdDriveFileRenameOutline } from "react-icons/md";
import { TbDimensions } from "react-icons/tb";
// import { LuNotebookText } from "react-icons/lu";
import { GiPositionMarker } from "react-icons/gi";
import { PiMapPinSimpleAreaBold } from "react-icons/pi";
import { FaFile } from "react-icons/fa";
import { MdPhotoCamera } from "react-icons/md";
function EditInforObject() {            

    const [selectedOption, setSelectedOption] = useState('');
    const [valueFrom, onChangeFrom] = useState(new Date());    
    const [valueTo, onChangeTo] = useState(new Date());
    const [showModalUpdateFirmware, setshowModalUpdateFỉmware] = useState(false);

    const [center, setCenter] = useState({ lat: 10.81993366729437,lng: 106.69843395240606  });
    const [zoomLevel, setZoomLevel] = useState(18);
    const [locationNewBin, setlocationNewBin] = useState({ lat: 0, lng: 0 })
    const mapRef = useRef() 

    const data = [
      { time: '04/01/2025 01:00:00', pin: 45 },
      { time: '04/01/2025 01:00:00', pin: 30 },
      { time: '04/01/2025 01:00:00', pin: 22 },
    ];

       const markerIcon = new L.Icon({
          iconUrl: require("./asset/images/maker_user.png"),
          iconSize: [25, 30],   
          iconAnchor: [15, 30], //[left/right, top/bottom]     
          popupAnchor: [0, 0], //[left/right, top/bottom]
      })


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
        
          const handleImageUpload = (event) => {
            const file = event.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (e) => {
                setImage(e.target.result);
              };
              reader.readAsDataURL(file);
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
  
  return (
    <div className='fatherEditInforObject'>
      <div className='wrapperEditInforObject'>

                          <div className='EditInforObjectTitle'>
                              <div className='EditInforObjectTitleItem'>
                                  Chỉnh sửa thông tin đối tượng
                              </div> 
                          </div>
                          {/* <div className='imgObject'>
                            <img src={imgObject} alt=''/>  
                          </div> */}

                          <div className='SettingFirst'>
                                            <div className="Wrapimage">
                                            <div
                                                className="image-container"
                                                onMouseMove={handleMouseMove}
                                                onMouseUp={handleMouseUp}
                                                onMouseLeave={handleMouseUp}
                                              >
                                                {image && (
                                                  <img
                                                    src={image}
                                                    alt="Uploaded"
                                                    style={{
                                                      transform: `translate(${position.x}px, ${position.y}px)`,
                                                    }}
                                                    onMouseDown={handleMouseDown}
                                                  />
                                                )}
                          
                                                
                                              </div>
                                              <div
                                                  className='buttonUpload'
                                                  onClick={() => document.getElementById("fileInput").click()}
                                                >
                                                  <MdPhotoCamera className='IconButtonUpload'/>
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
                  className='wrapInforEditObject' 
                >   
                             
                        <div className='wrapInforEditObjectItem'>
                          <div className='wrapInforEditObjectItemFirst'>
                              <div className='divIconEditObject'>
                                  <MdDriveFileRenameOutline className='IconEditObject'/>
                              </div>  
                              <div className='titleEditObject'>Tên đối tượng:</div>
                          </div> 
                          
                          <div className='wrapInforEditObjectItemSecond'>  
                              <input type="text" class="input-bottom-border" placeholder="Nhập nội dung"/>                              
                          </div>

                        </div>
                        <div className='wrapInforEditObjectItem'>
                          <div className='wrapInforEditObjectItemFirst'>
                              <div className='divIconEditObject'>
                                  <TbDimensions className='IconEditObject'/>
                              </div>  
                              <div className='titleEditObject'>Kích thước:</div>
                          </div> 
                          
                          <div className='wrapInforEditObjectItemSecond'>  
                              <input type="text" class="input-bottom-border" placeholder="Nhập nội dung"/>                              
                          </div>

                        </div>
                        <div className='wrapInforEditObjectItem'>
                          <div className='wrapInforEditObjectItemFirst'>
                              <div className='divIconEditObject'>
                                  {/* <LuNotebookText className='IconEditObject'/> */}
                              </div>  
                              <div className='titleEditObject'>Mô tả:</div>
                          </div> 
                          
                          <div className='wrapInforEditObjectItemSecond'>  
                              <input type="text" class="input-bottom-border" placeholder="Nhập nội dung"/>                              
                          </div>

                        </div>
                        <div className='wrapInforEditObjectItem'>
                          <div className='wrapInforEditObjectItemFirst'>
                              <div className='divIconEditObject'>
                                  <GiPositionMarker className='IconEditObject'/>
                              </div>  
                              <div className='titleEditObject'>Vị trí an toàn:</div>
                          </div> 
                          
                          <div className='wrapInforEditObjectItemSecond'>  
                              <input type="text" class="input-bottom-border" placeholder="Nhập nội dung"/>                              
                          </div>

                        </div>
                        <div className='wrapInforEditObjectItem'>  
                          <div className='wrapInforEditObjectItemFirst'>
                              <div className='divIconEditObject'>
                                  <PiMapPinSimpleAreaBold className='IconEditObject'/>
                              </div>  
                              <div className='titleEditObject'>Bán kính an toàn:</div>
                          </div> 
                          
                          <div className='wrapInforEditObjectItemSecond'>  
                              <input type="text" class="input-bottom-border" placeholder="Nhập nội dung"/>                              
                          </div>

                        </div>
                     
                        <div className='divButtonEdit'>  
                            <button className='buttonEdit'>Lưu</button>
                        </div>

                       


                       

                        {/* <div className='informationDeviceItem informationDeviceItemUpdateFirmware'>
                            <div className='informationDeviceItemTitle'>Cập nhật firmware</div>
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
export default EditInforObject
