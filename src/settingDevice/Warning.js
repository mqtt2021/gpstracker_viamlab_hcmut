import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { editUser } from '../services/UserService';
import {  toast } from 'react-toastify';
    
function ModalWarning({ show , handleClose}) {
  return (
    <div  className="modal show"
      style={{ display: 'block', position: 'initial' }}>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Thông tin người nhận cảnh báo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <form>
            <div className="form-group">
                <label for="exampleInputName">Số điện thoại người nhận cảnh báo</label>
                <input type="text" className="form-control" id="exampleInputName" aria-describedby="emailHelp"  
                />
            </div>
            <div className="form-group">
              <label for="exampleInputJob">Tên người nhận cảnh báo</label>
              <input type="text" className="form-control" id="exampleInputJob"   
              />
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

  
export default ModalWarning    
