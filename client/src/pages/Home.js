import React, { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { logout, setOnlineUser, setSocketConnection, setUser } from "../redux/userSlice"
import { useDispatch, useSelector } from 'react-redux'
import Sidebar from '../components/Sidebar'
import logo from "../assets/logo.png" 
import io from "socket.io-client"

const Home = () => {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  console.log('User',user)
  //extracting details of current user as we created token in server inside 
  const fetchUserDetails = async () => {
    try {
      const URL = `${process.env.REACT_APP_BACKEND_URL}/api/details` //details route we created in server/routes/index.js
      const response = await axios({
        url : URL,
        withCredentials : true
      }) 

      dispatch(setUser(response.data.data))

      if(response.data.data.logout){
        dispatch(logout())
        navigate("/email")
      }

      console.log("Current user details ", response)
    } catch (error) {
      console.log("Error ", error)
    }
  }

  useEffect(() => {
    fetchUserDetails()
  }, [])

  // socket connection  Ensure that the token is being sent correctly when establishing the socket connection
  useEffect(() => {
    const socketConnection = io(process.env.REACT_APP_BACKEND_URL,{
      auth : {
        token : localStorage.getItem('token')
      }
    })

    socketConnection.on('onlineUser', (data) => {
      console.log(data)
      dispatch(setOnlineUser(data))
    })

    dispatch(setSocketConnection(socketConnection))

    return () => {
      socketConnection.disconnect()
    }
  },[])


  console.log("location", location)
  const basePath = location.pathname === "/"
  return (
    <div className='grid lg:grid-cols-[320px,1fr] h-screen max-h-screen'>
      {/* if browse localhost:3000/ then it will display home page only and if browse localhost:3000/anything then it will display message page only */}
      <section className = {`bg-white ${!basePath && "hidden"} lg:block`}>
        <Sidebar/>
      </section>

      {/* message components */}

      <section className={`${basePath && "hidden"}`}>
        <Outlet/>
      </section>
      {/* //lg using to make responsive on mobiles as well */}
      <div className={`justify-center items-center flex-col gap-2 hidden ${!basePath ? "hidden" : "lg:flex"}`}> 
        {/* to remove close icon if we click on any user in searchusercard */}
        <div>
          <img
            src={logo}
            width={250}
            alt='logo'
          />
        </div>
        <p className='text-lg mt-2 text-slate-500'>Select user to send message</p>
      </div>
    </div>
  )
}

export default Home
