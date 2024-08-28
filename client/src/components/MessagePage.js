import { React, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import Avatar from "../components/Avatar"
import { HiDotsVertical } from "react-icons/hi"
import { FaAngleLeft, FaPlus, FaImage, FaVideo } from "react-icons/fa6"
import uploadFile from '../helpers/uploadFile'
import { IoClose } from 'react-icons/io5'
import Loading from "../components/Loading"
import backgroundImage from "../assets/wallapaper.jpeg"
import { IoMdSend } from 'react-icons/io'
import moment from "moment"


const MessagePage = () => {
  const params = useParams()
  const socketConnection = useSelector(state => state?.user?.socketConnection)
  const user = useSelector(state => state?.user) //current user logged in
  const [dataUser, setDataUser] = useState({
    name : "",
    email : "",
    profile_pic : "",
    online : false,
    _id : ""
  })

  const [openImageVideoUpload, setOpenImageVideoUpload] = useState(false)
  const [message, setMessage] = useState({
    text : "",
    imageUrl : "",
    videoUrl : ""
    // reference from server/models/conversation model
  })
  const [loading, setLoading] = useState(false)
  const [allMessage, setAllMessage] = useState([])
  const currentMessage = useRef(null)

  useEffect(() => {
    if(currentMessage.current){
      currentMessage.current.scrollIntoView({behavior : "smooth", block : "end"})
    }
  },[allMessage])
  // when new message entered in allMessage then useEffect will run

  const handleOpenImageVideoUpload =() => {
    setOpenImageVideoUpload(prev => !prev )
  }

  const handleUploadImage = async(e) => {
    const file = e.target.files[0]
    setLoading(true)
    const uploadPhoto = await uploadFile(file)
    setLoading(false)
    setOpenImageVideoUpload(false) //when image will upload, that pop up which comes after clicking on + will disappear
      setMessage(prev => {
        return {
          ...prev,
          imageUrl : uploadPhoto.url
        }
      })
  }
  const handleClearUploadImage = () => {
    setMessage(prev => {
      return {
        ...prev,
        imageUrl : ""
      }
    })
  }

  const handleUploadVideo = async(e) => {
    const file = e.target.files[0]
    setLoading(true)
    const uploadVideo = await uploadFile(file)
    setLoading(false)
    setOpenImageVideoUpload(false)
      setMessage(prev => {
        return {
          ...prev,
          videoeUrl : uploadVideo.url
        }
      })
  }

  const handleClearUploadVideo = () => {
    setMessage(prev => {
      return {
        ...prev,
        videoUrl : ""
      }
    })
  }
  

  useEffect(() => {
    if(socketConnection){
      socketConnection.emit("message-page",params.userId)

      socketConnection.emit("seen",params.userId)

      socketConnection.on("message-user",(data) => {
        setDataUser(data)
      })

      socketConnection.on("message",(data) => {
        console.log("message data",data)
        setAllMessage(data)
      })
    }
  },[socketConnection,params?.userId,user])

  const handleOnChange = (e) => {
    const { name, value } = e.target

    setMessage(prev => {
      return {
        ...prev,
        text : value //it will allow writing in type here message...
      }
    })
  }

  const handleSendMessage = (e) => {
    e.preventDefault()

    if(message.text || message.imageUrl || message.videoUrl){
      if(socketConnection){
        socketConnection.emit("new message", {
          sender : user?._id, //who sending message
          receiver : params.userId, //who receiving message
          text : message.text,
          imageUrl : message.imageUrl,
          videoUrl : message.videoUrl,
          msgByUserId : user?._id
        })
        //now this data we need to accept at server side also to save in db

        setMessage({
          text : "",
          imageUrl : "",
          videoUrl : ""
          // reference from server/models/conversation model
        })
      }
    }
  }

  return (
    <div style ={{ backgroundImage : `url(${backgroundImage})`}} className='bg-no-repeat bg-cover'>
      <header className='sticky top-0 h-16 bg-white flex justify-between items-center px-4'>
        <div className='flex items-center gap-4'>
          <Link to={"/"} className='lg:hidden'> 
          {/* //will be visible only in mobile version */}
            <FaAngleLeft size={25}/>
          </Link>
          <div>
            <Avatar
              width={50}
              height={50}
              imageUrl={dataUser?.profile_pic}
              name={dataUser?.name}
              userId={dataUser?._id}
            />
          </div>
          <div>
            <h3 className='font-semibold text-lg my-0 text-ellipsis line-clamp-1'>{dataUser?.name}</h3>
            <p className='-my-2 text-sm'>
              {
                dataUser.online ? <span className='text-primary'>Online</span> : <span className='text-slate-400'>Offline</span>
              }
            </p>
          </div>
        </div>
        <div>
          <button className='cursor-pointer hover:text-primary'>
            <HiDotsVertical/> 
          </button>
        </div>
        
      </header>

      {/* show all messages */}
      <section className='h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-200 bg-opacity-50'>
        
        {/* all message show here */}
        <div className='flex flex-col gap-2 py-2 mx-2' ref={currentMessage}>
          {
            allMessage.map((msg,index) => {
              return (
                <div className={`p-1 py-1 rounded w-fit max-w-[280px] md:max-w-sm lg:max-w-md ${user._id === msg?.msgByUserId ? "ml-auto bg-teal-100" : "bg-white"}`}>
                  {/* to avoid the scroll of current massage */}

                  {/* to see image in receiver's window */}
                  <div className='w-full relative'>
                    {
                      msg?.imageUrl && (
                        <img
                          src={msg?.imageUrl}
                          className='w-full h-full object-scale-down'
                        />
                      )
                    }
                  {/* to see video in receiver's window */}
                    {
                      msg?.videoUrl && (
                        <video
                          src={msg.videoUrl}
                          className='w-full h-full object-scale-down'
                          controls //it will show play/pause/full screen control on video
                        />
                      )
                    }
                  </div>
                  <p className='px-2'>{msg.text}</p>
                  <p className='text-xs ml-auto w-fit'>{moment(msg.createdAt).format("hh:mm")}</p> 
                  {/* moment js library to see message timings*/}
                </div>
              )
            })
          }
        </div>

        {/* upload image display */}
        {
          message.imageUrl && (
            <div className='w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
              <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600' onClick={handleClearUploadImage}>
                <IoClose size={30}/>
              </div>
              <div className='bg-white p-3'>
                <img
                  src={message.imageUrl}
                  alt='uploadImage'
                  className='aspect-square w-full h-full max-w-sm m-2 object-scale-down'
                />
              </div>
            </div>
          )
        }

        {/* upload video display */}
        {
          message.videoUrl && (
            <div className='w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
              <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600' onClick={handleClearUploadVideo}>
                <IoClose size={30}/>
              </div>
              <div className='bg-white p-3'>
                <video
                  src={message.videoUrl}
                  className='aspect-square w-full h-full max-w-sm m-2 object-scale-down'
                  controls
                  muted
                  autoPlay
                />
              </div>
            </div>
          )
        }

        {
          loading && (
            <div className='w-full h-full flex sticky bottom-0 justify-center items-center'>
              <Loading/>
            </div>
          )
        }
      </section>

      {/* send message */}
      <section className='h-16 bg-white flex items-center px-4'>
          <div className='relative'>
            <button onClick={handleOpenImageVideoUpload} className='flex justify-center items-center w-11 h-11 rounded-full hover:bg-primary hover:text-white'>
              <FaPlus size={20}/>
            </button>

            {/* video and image */}
            {
              openImageVideoUpload && (
                <div className='bg-white shadow rounded absolute bottom-12 w-36 p-2'>
                  <form>
                    <label htmlFor='uploadImage' className='flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer'>
                      <div className='text-primary'>
                        <FaImage size={18}/>
                      </div>
                      <p>Image</p>
                    </label>
                    <label htmlFor='uploadVideo' className='flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer'>
                      <div className='text-purple-600'>
                        <FaVideo size={18}/>
                      </div>
                      <p>Video</p>
                    </label>

                    <input
                      type='file'
                      id='uploadImage'
                      onChange={handleUploadImage}
                      className='hidden'
                    />

                    <input
                      type='file'
                      id='uploadVideo'
                      onChange={handleUploadVideo}
                      className='hidden'
                    />

                  </form>
                </div>
              )
            }
          </div>

          {/* input box */}
          <form className='h-full w-full flex gap-2' onSubmit={handleSendMessage}>
              <input
                type='text'
                placeholder='Type here message...'
                className='py-1 px-4 outline-none w-full h-full'
                value={message.text}
                onChange={handleOnChange}
              />

              <button className='text-primary hover:text-secondary'>
                <IoMdSend size={28}/>
              </button>
          </form>
      </section>
    </div>
  )
}

export default MessagePage
