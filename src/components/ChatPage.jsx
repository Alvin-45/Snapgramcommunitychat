 import React, { useEffect, useRef, useState } from 'react';
import logo from '../assets/chatlogo.png';
import { Link, useLocation,useNavigate } from 'react-router-dom';
import Msgbox from './Msgbox';
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { setChat } from "../Redux/chatSlice";
import Spinner from 'react-bootstrap/Spinner';

function ChatPage() {
  
  const location = useLocation();
  const user = location.state;
  const [typeMessage, setTypeMessage] = useState("");
  const [newSocket, setNewSocket] = useState();
  const [id, setUserId] = useState();
  const boxref = useRef(null);
  const dispatch = useDispatch();
  const datared = useSelector(state => state.chatReducer);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = io("https://cboatserver.onrender.com");
    setNewSocket(socket);

    socket.on("connect", () => {
      setUserId(socket.id);
      socket.emit('joined', { user });
      setConnected(true);
    });

    socket.on('welcome', (data) => {
      dispatch(setChat(data));
    });

    socket.on('userJoined', (data) => {
      dispatch(setChat(data));
    });

    socket.on('sendMessage', (data) => {
      dispatch(setChat(data));
    });

    socket.on('leave', (data) => {
      dispatch(setChat(data));
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch]);

  const send = () => {
    if (typeMessage !== "") {
      newSocket.emit('message', { message: typeMessage, id });
      setTypeMessage("");
    }
  };

  useEffect(() => {
    boxref.current?.lastElementChild?.scrollIntoView();
  }, [datared]);
  

  return (
    <>
      <div className=" bg-dark">
        {connected?(<div className="row chatpage  shadow d-flex justify-content-center align-items-center w-100">

          
            <div className="col chatborder text-light bg-success p-3 w-100">
              <Link style={{textDecoration:'none',color:'white'}} to={'/'}><span><i className="fa-solid fa-chevron-left" style={{ color: "#ffffff" }}></i>&ensp; Logout</span></Link>
            </div>
            <div className='whtapp' style={{width:'100%',height:'93vh',marginTop:'0px'}}>
  
            <div ref={boxref} className="chatpart w-100">
              {datared && datared.map((item, index) => (
                <Msgbox key={index} user={user} name={item.user} message={item.message} />
              ))}
  
              
            </div>:
           
            <div className="textmsg w-100  border-top pt-3" style={{overflowY:'hidden'}}>
                <input type="text" className="rounded inpbx w-75" placeholder='Type Message...' onChange={(e) => setTypeMessage(e.target.value)} value={typeMessage} style={{ height: '40px' }} />
                <button onClick={send} className='btn btn-success snt' style={{ width: '10%', height: '40px' }}><i className="fa-regular fa-paper-plane" style={{ color: "#fcfcfc" }}></i></button>
              </div>
          </div>

        </div>): (<div className="noconnection d-flex justify-content-center align-items-center w-100" style={{height:'100vh'}}>
              <Spinner animation="border" variant="primary" style={{zIndex:'9999999999999999'}}/> <span className="fw-bolder text-primary">Connecting to server(max:20s)</span>

            </div>)}
        <div className="watermark w-100" style={{position:'absolute',marginTop:'-60px',marginLeft:'91%'}}>
          <h3 className='title text-light fixed-end' style={{zIndex:'99999'}}>SnapGram</h3>
        </div>
      </div>
    </>
  );
}

export default ChatPage;
