import React,{useState,useRef} from 'react'
import DatePicker from 'react-datepicker';
import './InforObject.scss'
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
import {Link, useNavigate} from "react-router-dom";
function InforObject() {        

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
  
  return (
    <div className='fatherInforObject'>
      <div className='wrapperInforObject'>

                          <div className='InforObjectTitle'>
                              <div className='InforObjectTitleItem'>
                                  Thông tin đối tượng
                              </div> 
                          </div>
                          <div className='imgObject'>
                            <img src={imgObject} alt=''/>  
                          </div>
                <div
                  className='wrapinformationDevice' 
                >   
                          
                        <div className='informationDeviceItem'>
                          <div className='informationDeviceItemFirst'>
                              <div className='informationDeviceItemFirstIcon'>
                                  <MdDriveFileRenameOutline className='informationDeviceItemIcon'/>
                              </div>  
                              <div className='informationDeviceItemFirstTitle'>Tên đối tượng:</div>
                          </div> 
                          
                          <div className='informationDeviceItemSecond'>
                                <div className='informationDeviceItemSecondText'>
                                      PT1006
                                </div>                                
                          </div>

                        </div>
                        <div className='informationDeviceItem'>
                          <div className='informationDeviceItemFirst'>
                              <div className='informationDeviceItemFirstIcon'>
                                  <TbDimensions className='informationDeviceItemIcon'/>
                              </div>  
                              <div className='informationDeviceItemFirstTitle'>Kích thước:</div>
                          </div> 
                          
                          <div className='informationDeviceItemSecond'>
                                <div className='informationDeviceItemSecondText'>
                                      20cm x 10cm
                                </div>                                
                          </div>

                        </div>
                        <div className='informationDeviceItem'>
                          <div className='informationDeviceItemFirst'>
                              <div className='informationDeviceItemFirstIcon'>
                                  {/* <LuNotebookText className='informationDeviceItemIcon'/> */}
                              </div>  
                              <div className='informationDeviceItemFirstTitle'>Mô tả:</div>
                          </div> 
                            
                          <div className='informationDeviceItemSecond'>
                                <div className='informationDeviceItemSecondText'>
                                      Màu đen và xanh dương
                                </div>                                
                          </div>

                        </div>
                        <div className='informationDeviceItem'>
                          <div className='informationDeviceItemFirst'>
                              <div className='informationDeviceItemFirstIcon'>  
                                  <GiPositionMarker className='informationDeviceItemIcon'/>
                              </div>  
                              <div className='informationDeviceItemFirstTitle'>Vị trí an toàn:</div>
                          </div> 
                          
                          <div className='informationDeviceItemSecond'>
                                <div className='informationDeviceItemSecondText'>
                                      Xem vị trí
                                </div>                                
                          </div>

                        </div>

                        <div className='informationDeviceItem'>
                          <div className='informationDeviceItemFirst'>
                              <div className='informationDeviceItemFirstIcon'>
                                  <PiMapPinSimpleAreaBold className='informationDeviceItemIcon'/>
                              </div>  
                              <div className='informationDeviceItemFirstTitle'>Bán kính an toàn:</div>
                          </div> 
                          
                          <div className='informationDeviceItemSecond'>
                                <div className='informationDeviceItemSecondText'>
                                      15 m
                                </div>                                
                          </div>
                        </div>
                       
                        


                        <Link to="/EditInforObject">   
                          <div className='divButtonEdit'>
                            <button className='buttonEdit'>Chỉnh sửa</button>
                          </div>
                        </Link>
                       

                       


                       

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
export default InforObject
