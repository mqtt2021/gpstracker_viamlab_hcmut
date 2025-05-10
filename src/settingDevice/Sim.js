import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { editUser } from '../services/UserService';
import {  toast } from 'react-toastify';

function ModalSim({ show , handleClose}) {
  return (
    <div  className="modal show"
      style={{ display: 'block', position: 'initial' }}>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Thông tin gói cước đang sử dụng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <form>
            <div className="form-group">
                <label for="exampleInputName">Số điện thoại</label>
                <input type="text" className="form-control" id="exampleInputName" aria-describedby="emailHelp"  
                />
            </div>
            <div className="form-group">
              <label for="exampleInputJob">Gói cước đang dùng</label>
              <input type="text" className="form-control" id="exampleInputJob"   
              />
            </div>
            <div className="form-group">
              <label for="exampleInputJob">Nhà cung cấp mạng</label>
              <input type="text" className="form-control" id="exampleInputJob"   
              />
            </div>
            <div className="form-group">
              <label for="exampleInputJob">Ngày đăng kí</label>
              <input type="text" className="form-control" id="exampleInputJob" 
              />
            </div>
            <div className="form-group">
              <label for="exampleInputJob">Ngày hết hạn</label>
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

  
export default ModalSim    
