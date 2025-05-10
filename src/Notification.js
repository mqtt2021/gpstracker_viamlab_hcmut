import React,{useState, useEffect, useContext} from 'react'
import './Notification.scss'
import {Link} from "react-router-dom";   
import { MdDirectionsRun } from "react-icons/md";
import { FaCircle } from "react-icons/fa";
import { IoIosWarning } from "react-icons/io";    
import { PiBatteryWarningFill } from "react-icons/pi";
import axios from 'axios';
import { url } from './services/UserService';
import { UserContext } from './usercontext';                 
import { GrUpdate } from "react-icons/gr";
import * as signalR from "@microsoft/signalr";
import { MdError } from "react-icons/md";
import { BsCheckAll } from "react-icons/bs";
import { toast } from 'react-toastify';
function Notification() { 

  const { unreadCount, setUnreadCount, listNotifications, setListNotifications  } =  useContext(UserContext);    
  const [connection, setConnection] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Thêm state để quản lý trạng thái loading
  const [phone, setPhone] = useState('');
  const [showModalAddDevice, setshowModalAddDevice] = useState(false);
  const [listAllDeices, setListAllDeices] = useState([]);   
  const [notificationSignalR, setnotificationSignalR] = useState([]);
                                       
  const handleshowModalAddDevice = () => {   
        setshowModalAddDevice(true)       
  }
  const handleCloseModalAddDeice = () => {
        setshowModalAddDevice(false)     
  } 

  const getNotification = async () => {
    setIsLoading(true); // Bắt đầu loading
    let success = false;  
    while (!success) {   
      try {
        const response = await axios.get(`${url}/Notification/GetNotificationByPhoneNumber?phoneNumber=${phone}`);   
        const NotificationsData = response.data;
  
        // Kiểm tra nếu dữ liệu nhận được hợp lệ
        if (NotificationsData) {    
          // const ListStolen = LoggerData.filter((item) => item.stolenLines.length > 0);
          const sortedData = NotificationsData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

          
          const uniqueNotifications = sortedData.reduce((acc, item) => {
            const exists = acc.find((t) => t.title === item.title && t.timestamp === item.timestamp);
            if (!exists) {
              acc.push(item); // Chỉ thêm vào danh sách nếu chưa có
            }
          return acc;
          }, []);

          const unreadCount = uniqueNotifications.filter((item) => item.isAcknowledge === false).length;
          setUnreadCount(unreadCount)

          setListNotifications(uniqueNotifications);    
          
          success = true; // Dừng vòng lặp khi dữ liệu hợp lệ và được xử lý
        } else {
          alert('ReLoad');
        }
      } catch (error) {
        //console.error('getNotification error, retrying...', error);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Đợi 2 giây trước khi thử lại
      }
    }
    
  };

  const UpdateAcknowledge = async (title, description, timestamp, isAcknowledge) => {   

    if(!isAcknowledge){
      let success = false;
      while (!success) {
        try {
          const response = await axios.patch(`${url}/Notification/UpdateNotification`, {
            "customerPhoneNumber": phone,
            "title": title,                     
            "timestamp": timestamp 
          });  
          const LoggerData = response.data;
    
          // Kiểm tra nếu dữ liệu nhận được hợp lệ            
          if (LoggerData && LoggerData.length > 0) {
            success = true; 
            // Gọi lại hàm getNotification sau khi cập nhật thành công
            await getNotification();
          }
        } catch (error) {
          console.error('getAllDevices error, retrying...', error);  
          await new Promise(resolve => setTimeout(resolve, 1000)); // Đợi 1 giây trước khi thử lại
        }
      }
    }
    
  };


  const CallAPICheckAll = async () => {   
      let success = false;
      while (!success) {
        try {
          const phoneNumer = sessionStorage.getItem('phoneNumer');    
          const response = await axios.patch(`${url}/Notification/AcknowledgeAll?phoneNumber=${phoneNumer}`);  
          const LoggerData = response.data;
    
          // Kiểm tra nếu dữ liệu nhận được hợp lệ            
          if (LoggerData === "Acknowledge successfully.") {
            success = true;                   
            // Gọi lại hàm getNotification sau khi cập nhật thành công
            toast.success("Đã xem tất cả thông báo")
            await getNotification();
          }
          // Kiểm tra nếu dữ liệu nhận được hợp lệ            
          if (LoggerData === "AcknowledgeAll failed!") {
            success = true;                   
            // Gọi lại hàm getNotification sau khi cập nhật thành công
            toast.success("Tất cả thông báo đã được xem")
          }
          
        } catch (error) {
          console.error('getAllDevices error, retrying...', error);  
          await new Promise(resolve => setTimeout(resolve, 1000)); // Đợi 1 giây trước khi thử lại
        }
      }
  };    
  


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
          setListAllDeices(listDevice);
          success = true; 
        } else {

        }
      } catch (error) {
        console.error('getAllDevices error, retrying...', error);  
        await new Promise(resolve => setTimeout(resolve, 1000)); // Đợi 2 giây trước khi thử lại
      }
    }
    setIsLoading(false); // Bắt đầu loading
  };


  const postDataToAPI = async (url, data) => {
    try {
      const response = await axios.post(`${url}/Notification/GetNotificationByPhoneNumber?phoneNumber=${phone}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      //console.log('Response:', response.data);
      return response.data; // Trả về dữ liệu từ server nếu cần dùng tiếp
    } catch (error) {
      console.error('POST request failed:', error);
      return null; // Trả về null nếu lỗi
    }
  };

  useEffect(() => {  
    const phoneNumer = sessionStorage.getItem('phoneNumer');    
    setPhone(phoneNumer)    
  }, [])

  useEffect(() => {    
    if (notificationSignalR.length > 0) {
        //console.log('🟢 useEffect nhận notificationSignalR:', notificationSignalR);
        setListNotifications(prev => [...notificationSignalR, ...prev]);

        // Reset lại `notificationSignalR` sau khi đã xử lý
        //setnotificationSignalR([]);
    }                
}, [notificationSignalR]);
                                                                              
  
  useEffect(() => { 
    if(phone !== ''){
      getNotification();
      getAllDevices()
    }                     
  }, [phone])


  useEffect(() => { 
    if(listNotifications.length > 0){
      setIsLoading(false); // Kết thúc loading sau khi lấy dữ liệu xong
      toast.success("Đã lấy thành công danh sách thông báo")
    }                     
  }, [listNotifications])

  // useEffect(() => {    
  //   if(connection !== null){     
  //     getAllDevices(connection)   
  //   }                     
  // }, [connection])

  function convertDateTimeBefore(inputString) {
    const [date, time] = inputString.split('T');    
    const [year, month, day] = date.split('-');
    return `${day}-${month}-${year} ${time}`;       
  }

  function handleCheckAllNotification() {
      setIsLoading(true); // Bắt đầu loading
      CallAPICheckAll()
      setIsLoading(false); // Bắt đầu loading
  }

  const iconMap = {
    "Pin yếu": <PiBatteryWarningFill className='iconDevice' />,
    "Cảnh báo chuyển động": <MdDirectionsRun className='iconDevice' />,
    "Vùng an toàn": <IoIosWarning className='iconDevice' />, // Thêm icon khác
    "Cập nhật vị trí": <GrUpdate className='iconDevice' />, // Thêm icon khác
  }


  // useEffect( () => {
  //   let connection = new signalR.HubConnectionBuilder()   
  //       .withUrl("https://mygps.runasp.net/NotificationHub")   
  //       .withAutomaticReconnect()    
  //       .build();     
  //   // Bắt đầu kết nối   
  //   connection.start()   
  //       .then(() => {  
  //         console.log("✅ Kết nối SignalR thành công!");
  //                    // Lắng nghe các sự kiện cho từng thiết bị
  //       listAllDeices.forEach(device => {
  //         connection.on(`SendNotification${device.id}`, data => {
  //           const obj = JSON.parse(data);
  //           console.log(`📡 Dữ liệu từ thiết bị ${device.id}:`, obj);
  //            // Đợi 2 giây trước khi gọi getNotification
  //            setnotificationSignalR({
  //             title: obj.Title,
  //             description: obj.Description,
  //             timestamp: obj.Timestamp, 
  //             isAcknowledge: obj.IsAcknowledge
  //            })
  //         });
  //       });
  //       })
  //       .catch(err => {
  //           console.error('Kết nối thất bại: ', err);
  //       });
  //   // Lắng nghe sự kiện kết nối lại
  //   connection.onreconnected(connectionId => {
  //       console.log(`Kết nối lại thành công. Connection ID: ${connectionId}`);
  //   });
  //   // Lắng nghe sự kiện đang kết nối lại
  //   connection.onreconnecting(error => {
  //       console.warn('Kết nối đang được thử lại...', error);
  //   });
  //   // Cleanup khi component unmount hoặc khi listAllDeices thay đổi
  //   return () => {
  //     connection.stop();
  //     console.log("🔴 Kết nối SignalR đã đóng!");
  //   };
  // }, [listAllDeices] )


  useEffect(() => {
    let connection = new signalR.HubConnectionBuilder()
        .withUrl("https://mygps.runasp.net/NotificationHub")
        .withAutomaticReconnect()
        .build();

    let notificationBuffer = []; // Mảng tạm chứa thông báo
    let bufferTimeout = null; // Timeout để kiểm soát thời gian cập nhật

    connection.start()
        .then(() => {
            console.log("✅ Kết nối SignalR thành công!");

            listAllDeices.forEach(device => {
                connection.on(`SendNotification${device.id}`, data => {
                    const obj = JSON.parse(data);
                    //console.log(`📡 Dữ liệu từ thiết bị ${device.id}:`, obj);

                    // Lưu thông báo vào buffer
                    notificationBuffer.push({
                        title: obj.Title,
                        description: obj.Description,
                        timestamp: obj.Timestamp,
                        isAcknowledge: obj.IsAcknowledge
                    });

                    // Nếu buffer đủ 2 thông báo, cập nhật luôn
                    if (notificationBuffer.length >= 2) {
                        flushNotifications();
                    } else {
                        // Nếu chưa đủ 2, đợi 500ms rồi cập nhật
                        if (!bufferTimeout) {
                            bufferTimeout = setTimeout(flushNotifications, 500);
                        }
                    }
                });
            });
        })
        .catch(err => {
            console.error('Kết nối thất bại: ', err);
        });

        function flushNotifications() {
          if (notificationBuffer.length === 0) return;
      
          //console.log('flushNotifications - Trước:', notificationSignalR);
          //console.log('flushNotifications - notificationBuffer:', notificationBuffer);
      
          // Cập nhật state bằng callback để đảm bảo lấy đúng state trước đó
          setnotificationSignalR(prev => {
              const updatedNotifications = [...notificationBuffer, ...prev]; // Gộp buffer và state cũ
              notificationBuffer = []; // Reset buffer sau khi cập nhật
              return updatedNotifications;
          });
      
          clearTimeout(bufferTimeout);
          bufferTimeout = null;
      }
      

    // Xử lý khi kết nối lại
    connection.onreconnected(connectionId => {
        console.log(`Kết nối lại thành công. Connection ID: ${connectionId}`);
    });

    connection.onreconnecting(error => {
        console.warn('Kết nối đang được thử lại...', error);
    });

    // Cleanup khi component unmount hoặc listAllDeices thay đổi
    return () => {
        connection.stop();
        console.log("🔴 Kết nối SignalR đã đóng!");
    };
}, [listAllDeices]);






  // const uniqueNotifications = listNotifications.reduce((acc, item) => {
  //     const exists = acc.find((t) => t.title === item.title && t.timestamp === item.timestamp);
  //     if (!exists) {
  //       acc.push(item); // Chỉ thêm vào danh sách nếu chưa có
  //     }
  // return acc;
  // }, []);


  // useEffect(() => {
  //   // Khởi tạo kết nối SignalR
  //   let conn = new signalR.HubConnectionBuilder()  
  //       .withUrl("https://mygps.runasp.net/NotificationHub")     
  //       .withAutomaticReconnect()
  //       .build();
  //   conn.start()
  //       .then(() => {
  //           //console.log(" Kết nối SignalR thành công!");
  //           setConnection(conn); // Lưu connection vào state
  //           getAllDevices(conn); // Gọi API sau khi kết nối thành công
  //       })
  //       .catch(err => console.error(" Kết nối thất bại: ", err));
  //   return () => {
  //       conn.stop(); // Dọn dẹp kết nối khi component bị unmount
  //   };
  // }, []);

  function extractDeviceId(message) {
    const match = message.match(/Thiết bị (\w+) (rời khỏi|chuyển động|cập nhật vị trí)/);
    return match ? match[1] : null;
}

//console.log('Sau:', notificationSignalR);

  return (
    <div className='fatherNotification'>
      <div className='wrapperNotification'>
      
            <div className='TitleNotification'>
                    <div className='TitleNotificationItem'>
                          Thông báo
                    </div> 
                    <div 
                        className='divIconCheckAll'
                        onClick={handleCheckAllNotification}
                    >
                          <BsCheckAll className='iconCheckAll'/>
                    </div> 
            </div>

            {
              isLoading ? (
                    <div className="loadingContainer">
                            <div className="spinner"></div> {/* Hiển thị hiệu ứng loading */}
                            <p>Đang tải thông báo...</p>                              
                    </div>
              ) :
              
          (listNotifications.map((item , index) => (  

            <Link to={`/Devices/Position/${extractDeviceId(item.description)}`}>     
              <div
                  className='wrapperContainerNotification'
                  onClick={() => UpdateAcknowledge(item.title, item.description, item.timestamp, item.isAcknowledge)}
 
              >  
             
                <div className='containerDevice'>
                  <div className='itemDevice itemDeviceFirst'>
                      <div className='divIconDevice'>    
                              {iconMap[item.title] || <MdError className='iconDevice' />}                      
                      </div>    
                      <div className='divIconNameAndPin'>
                          <div className='name'>
                            {item.title}  
                          </div>
                          <div className='divIconPin'>  
                            <div>{item.description}</div>   
                          </div>
                      </div>
                  </div>
                  <div className='itemDevice itemNotificationecond'>
                          <div className = 'itemNotificationecondItem'>  
                              {convertDateTimeBefore(item.timestamp)}
                          </div>
                          {item.isAcknowledge ?
                          
                            <div className = 'itemNotificationecondItem' style={{ fontStyle: "italic" }}>                            
                                    Đã xem
                            </div>  

                            :

                            <div className = 'itemNotificationecondItem'>                            
                              <FaCircle className='iconAcknownledge' />
                            </div>
                          
                           }
                                       
                  </div>

                </div>
              </div>  
            </Link>   

              ))  )}
      </div>   
              
    </div>
  )
}

export default Notification
