import axios from './customize-axios';
const url = 'https://mygps.runasp.net'      
const fetchAllUsers = (page) => {  
    return axios.get(`/api/users?page=${page}`)
}
const createUser = (name,job) => {
    return axios.post('/api/users', {name:name,job:job})
}

const editUser = (name,job) => {
    return axios.put('/api/users/2', {name:name,job:job})
}

const deleteUser = (id) => {
    return axios.delete(`/api/users/${id}`)
}

const LoginAPI = (email,password) => {
    return axios.post(`${url}/Customer/Login`,{userName:email, password:password})  
}                 

export {fetchAllUsers,createUser,editUser,deleteUser,LoginAPI, url}