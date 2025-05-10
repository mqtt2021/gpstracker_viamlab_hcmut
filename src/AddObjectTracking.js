import React,{useState,useRef} from 'react'
import DatePicker from 'react-datepicker';
import './AddObjectTracking.scss'
import Table from 'react-bootstrap/Table';
import { MapContainer, TileLayer, Marker, Popup, useMapEvent   } from "react-leaflet";
import L from 'leaflet'
import { HiOutlinePhotograph } from "react-icons/hi";
function AddObjectTracking() {        

    const [selectedOption, setSelectedOption] = useState('');
    const [valueFrom, onChangeFrom] = useState(new Date());    
    const [valueTo, onChangeTo] = useState(new Date());
    const [showModalUpdateFirmware, setshowModalUpdateFỉmware] = useState(false);
    const [center, setCenter] = useState({ lat: 10.81993366729437,lng: 106.69843395240606  });
    const [zoomLevel, setZoomLevel] = useState(18);
    const [locationNewBin, setlocationNewBin] = useState({ lat: 0, lng: 0 })
    const mapRef = useRef() 

    const markerIcon = new L.Icon({
      iconUrl: require("./asset/images/maker_user.png"),
      iconSize: [25, 30],
      iconAnchor: [15, 30], //[left/right, top/bottom]     
      popupAnchor: [0, 0], //[left/right, top/bottom]
  })

    const data = [
      { time: '04/01/2025 01:00:00', pin: 45 },
      { time: '04/01/2025 01:00:00', pin: 30 },
      { time: '04/01/2025 01:00:00', pin: 22 },
    ];


    const handleshowModalUpdateFirmware= ()=> {   
      setshowModalUpdateFỉmware(true)     
      }
    const handleCloseModalUpdateFirmware=()=>{
      setshowModalUpdateFỉmware(false)   
    }  


        const [image, setImage] = useState(null);
        const [position, setPosition] = useState({ x: 0, y: 0 });
        const isDragging = useRef(false);
        const startPosition = useRef({ x: 0, y: 0 });



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
    <div className='fatherAddObjectTracking'>
      <div className='wrapperAddObjectTracking'>
                <div
                  className='wrapinformationObjectTracking'     
                >   
                        <div className='titleThongtinthietbi'>Thông tin đối tượng</div>
                        <div className='informationObjectTrackingItem'>   
                          <div className='informationObjectTrackingItemTitle'>Tên đối tượng</div>
                          <input type="text" className="form-control" id="exampleInputJob"   
                          />
                        </div>
                        <div className='informationObjectTrackingItem'>   
                          <div className='informationObjectTrackingItemTitle'>Mô tả</div>
                          <input type="text" className="form-control" id="exampleInputJob"   
                          />
                        </div>
                        <div className='informationObjectTrackingItem'>   
                          <div className='informationObjectTrackingItemTitle'>Chiều cao</div>
                          <input type="text" className="form-control" id="exampleInputJob"   
                          />
                        </div>
                        <div className='informationObjectTrackingItem'>   
                          <div className='informationObjectTrackingItemTitle'>Chiều rộng</div>
                          <input type="text" className="form-control" id="exampleInputJob"   
                          />
                        </div>
                        <div className='informationObjectTrackingItem'>   
                          <div className='informationObjectTrackingItemTitle'>Cân nặng</div>
                          <input type="text" className="form-control" id="exampleInputJob"   
                          />
                        </div>

                        <div className='informationObjectTrackingItem informationObjectTrackingItemUpdateFirmware'>
                            <div className='informationObjectTrackingItemTitle'>Hình ảnh</div>
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
                           
                                                 <div
                                                   className='buttonUpload'
                                                   onClick={() => document.getElementById("fileInput").click()}
                                                 >
                                                   <HiOutlinePhotograph className='IconButtonUpload'/>
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
                        <div className='informationObjectTrackingItem'>   
                                  <button type="button" class="btn btn-success"
                                              
                                  >Thêm</button>
                        </div>


                </div>
                <div className='wrapMap'>
                  <div className='divMapTitle'>   
                        Vị trí và vùng an toàn              
                  </div>
                 
                      <div className='divMap'>

                                              <MapContainer 
                                                    center={center} 
                                                    zoom={zoomLevel}     
                                                    ref={mapRef}>
                                                  <TileLayer
                                                       attribution ='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                       url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"                            
                                                  />
                                                  <MyClickHandlerGetLocation onClick={handleMapClickGetLocation}/>                                                                                                                                                                                             
                          
                                                           
                                                  <Marker
                                                        position={[locationNewBin.lat, locationNewBin.lng]}
                                                        icon={markerIcon}
                                                        //   key={idx}
                                                  >   
                                                      <Popup>    
                               
                                                      </Popup>
                                                </Marker>                                                     
                                              </MapContainer>
                      </div>
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
export default AddObjectTracking   
