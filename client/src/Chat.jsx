import React, {useEffect, useState, useRef, useContext} from 'react';
import axios from 'axios'
import {UserContext} from "./UserContext.jsx";

const Chat = () => {
    const [ws,setWs] = useState(null);
    const [onlinePeople,setOnlinePeople] = useState({});
    const [offlinePeople,setOfflinePeople] = useState({});
    const [selectedUserId,setSelectedUserId] = useState(null);
    const [newMessageText,setNewMessageText] = useState('');
    const [messages,setMessages] = useState([]);
    const {username,id,setId,setUsername} = useContext(UserContext);
    const connectToWs = () => {
        const ws = new WebSocket("ws://localhost:4000");
        setWs(ws);
        ws.addEventListener('message', handleMessgae)
        ws.addEventListener('close', () => {
            setTimeout(() => {
              console.log('Disconnected. Trying to reconnect.');
              connectToWs();
            }, 1000);
          
        });
    };

    useEffect(() => {
        connectToWs();
    });

    function handleMessgae(e){
        
    }


    const handleLogout = () => {
        axios.post('/logout').then(() => {
            setId(null);
            setUsername(null);
          });
    }
  return (
    <div className='flex h-screen'>
        <div className='bg-white w-1/3 flex flex-col'>
            <div className='flex-grow'>
            </div>
            <div className='p-2 text-center flex items-center justify-center'>
                <span className='mr-2 text-sm text-gray-600 flex items-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                    </svg>
                </span>
                <button
                    onClick={handleLogout}
                    className='text-sm bg-blue-100 py-1 px-2 text-gray-500 border rounded-sm'
                >
                    Logout
                </button>
            </div>
        </div>
        <div className='flex flex-col bg-blue-50 w-2/3 p-2'>
            <div className='flex-grow'>

            </div>
        </div>
    </div>
  )
}

export default Chat