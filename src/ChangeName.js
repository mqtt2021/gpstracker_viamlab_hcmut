import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { ToastContainer } from 'react-toastify';
import {  toast } from 'react-toastify';
import axios from 'axios';
import './ChangeName.scss'
function ChangeName({ show , handleClose, dataLoggerEdit}) {
    
    const [newName, setnewName] = useState('')
    const [newDataLogger, setNewDataLogger] = useState({})
    const url = 'https://sawacoapi.azurewebsites.net'
    const handleEditLogger = async () => {  
      if(newName === ''){
        toast.error('Bạn chưa nhập tên mới')
      }
      else{
        try {
        const response = await axios.patch(`${url}/Logger/UpdateLoggerStatus/Id=${newDataLogger.id}`, newDataLogger)
        if(response && response.data){
        setnewName('')
        handleClose()
        toast.success('Thay đổi thành công')
       }
      } catch (error) {
            toast.error('Lỗi')
      }
      }   
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        handleEditLogger()
      }
    };

    const handleEditNameLogger = (e) => {   
      const newName = e.target.value;   
      setnewName(newName)
      setNewDataLogger({...dataLoggerEdit, name : newName})
    }          
  
  return (
    <div  className="modal show changeName"
      style={{ display: 'block', position: 'initial' , zIndex: '3001' }}>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Thay đổi tên</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <form>
            <div className="form-group">
                <label for="exampleInputName">Tên cũ</label>
                <input type="text" className="form-control" id="exampleInputName" aria-describedby="emailHelp"
                    value={dataLoggerEdit.name}  
                />
            </div>
            <div className="form-group">
                <label for="exampleInputName">Tên mới</label>
                <input type="text" className="form-control" id="exampleInputName" aria-describedby="emailHelp"
                            value={newName}
                            onChange={handleEditNameLogger}
                            onKeyDown={handleKeyDown}
                />
            </div>
        </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
          <Button variant="primary" onClick={handleEditLogger} >
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    
                      <ToastContainer
                        position="top-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="light"
                        containerId="ChangeName"
                      />
    </div>
  )
}


export default ChangeName

