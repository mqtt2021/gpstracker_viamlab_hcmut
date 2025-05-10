import React from 'react'
import { RiGpsFill } from "react-icons/ri";
import { TiBatteryCharge } from "react-icons/ti";
import './ObjectTracking.scss'
import { GiPositionMarker } from "react-icons/gi";
import { FaBell } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoMdAddCircle } from "react-icons/io";
import {Link,useNavigate} from "react-router-dom";
import { IoIosInformationCircle } from "react-icons/io";
import { TbDeviceComputerCamera } from "react-icons/tb";
import { GrConnect } from "react-icons/gr";
function ObjectTracking() {

  return (
    <div className='fatherObjectTracking'>
      <div className='wrapperObjectTracking'>
              <div className='toolObjectTracking'>   
                  <div className='divInputFindObjectTracking'>
                        <input 
                          type="email" class="form-control" id="exampleInputEmail1" placeholder="Tìm  đối tượng"
                                                  
                        />              
                  </div>   
                  <Link  to="/AddObjectTracking">                    
                    <div className='divAddObjectTracking'>
                          <IoMdAddCircle className='iconAddObjectTracking'/>    
                    </div>
                  </Link>   
                   
              </div>
              <div
                  className='wrapperContainerObjectTracking'
              >        
                <div className='containerDevice'>
                  <div className='itemDevice itemDeviceFirst'>
                      <div className='divIconDevice'>
                          <TbDeviceComputerCamera className='iconDevice'/>
                      </div>
                      <div className='divIconNameAndPin'>
                         <div className='name'>
                            PT1006
                         </div>
                         <div className='divIconPin'>
                            <TiBatteryCharge className='iconPin'/>
                            <div>50%</div>   
                         </div>
                      </div>
                      <div className='divStatus'>
                              Đã kết nối
                      </div>
                  </div>
                  <div className='itemDevice itemObjectTrackingecond'>
                      <Link to="/map"> 
                      <div className = 'itemObjectTrackingecondItem'>  
                        <div>
                          <GiPositionMarker className='itemObjectTrackingecondItemIcon'/>  
                        </div>
                        <div>
                          Vị trí
                        </div>
                      </div>
                      </Link>  
                      
                      <Link to="/ObjectTracking/NewLog/1"> 
                        <div className = 'itemObjectTrackingecondItem'>
                          <div>
                          <GrConnect className='itemObjectTrackingecondItemIcon'/>
                          </div>
                          <div>
                            Hủy kết nối
                          </div>
                        </div>
                      </Link>  
                      
                      <Link to="/ObjectTracking/Setting/:id">         
                        <div className = 'itemObjectTrackingecondItem'>
                          <div>
                            <IoIosInformationCircle className='itemObjectTrackingecondItemIcon'/>
                          </div>
                          <div>
                            Thông tin    
                          </div>
                        </div>
                      </Link>
                      
                      <div>

                      </div>
                  </div>
                </div>
              </div>
              <div
                  className='wrapperContainerObjectTracking'
              >        
                <div className='containerDevice'>
                  <div className='itemDevice itemDeviceFirst'>
                      <div className='divIconDevice'>
                          <TbDeviceComputerCamera className='iconDevice'/>
                      </div>
                      <div className='divIconNameAndPin'>
                         <div className='name'>
                            TH1003
                         </div>
                         <div className='divIconPin'>
                            <TiBatteryCharge className='iconPin'/>
                            <div>50%</div>   
                         </div>
                      </div>
                      <div  
                            className='divStatus'
                            style={{ color: "black" }}
                      >
                              Chưa kết nối
                      </div>
                  </div>
                  <div className='itemDevice itemObjectTrackingecond'>
                      <Link to="/map"> 
                      <div className = 'itemObjectTrackingecondItem'>  
                        <div>
                          <GiPositionMarker className='itemObjectTrackingecondItemIcon'/>  
                        </div>
                        <div>
                          Lộ trình
                        </div>
                      </div>
                      </Link>    
                      
                      <Link to="/ObjectTracking/NewLog/1"> 
                        <div className = 'itemObjectTrackingecondItem'>
                          <div>
                          <GrConnect className='itemObjectTrackingecondItemIcon'   />
                          </div>
                          <div>
                            Kết nối
                          </div>
                        </div>
                      </Link>  
                      
                      <Link to="/ObjectTracking/Setting/:id">         
                        <div className = 'itemObjectTrackingecondItem'>
                          <div>
                            <IoIosInformationCircle className='itemObjectTrackingecondItemIcon'/>
                          </div>
                          <div>
                            Thông tin   
                          </div>
                        </div>
                      </Link>
                      
                      <div>

                      </div>
                  </div>
                </div>
              </div>
              
      </div>     
    </div>
  )
}

export default ObjectTracking
