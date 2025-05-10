import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { editUser } from '../services/UserService';
import {  toast } from 'react-toastify';

function ModalUpdateFirmware({ show , handleClose}) {
  const [fileName, setFileName] = useState("");
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
    } else {
      setFileName("");
    }
  };

  return (
    <div  className="modal show"
      style={{ display: 'block', position: 'initial', zIndex:1000 }}>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Cập nhật firmware cho thiết bị</Modal.Title>
        </Modal.Header>   
        <Modal.Body>
        <form>
            <div className="form-group">
                <label for="exampleInputName">Chọn file</label>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    style={{ cursor: "pointer" }}
                  />
                  {fileName && (
                    <span style={{ fontWeight: "bold", color: "blue" }}>{fileName}</span>
                  )}
                </div>
            </div>
            
        </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
          <Button variant="primary" >
            Cập nhật
          </Button>
        </Modal.Footer>
      </Modal>
    
    </div>
  )
}

  
export default ModalUpdateFirmware      
