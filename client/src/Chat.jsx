import React, {useEffect, useState, useRef, useContext} from 'react';
import axios from 'axios'
import {UserContext} from "./UserContext.jsx";
import Logo from './Logo.jsx';

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
    }, [selectedUserId]);

    
    function showOnlinePeople(peopleArr){
        const people = {};
        peopleArr.forEach(({userId,username}) => {
          people[userId] = username;
        });
        setOnlinePeople(people);
    }

    function handleMessgae(e){
        const messageData = JSON.parse(e.data);
        if('online' in messageData){
            showOnlinePeople(messageData.online)
        }
    }



    const handleLogout = () => {
        axios.post('/logout').then(() => {
            setId(null);
            setUsername(null);
          });
    }

    const onlinePeopleExclOurUser = {...onlinePeople};

  return (
    <div className='flex h-screen'>
        <div className='bg-white w-1/3 flex flex-col'>
            <div className='flex-grow'>
             <Logo />
            {Object.keys(onlinePeopleExclOurUser).map(userId => (
            <Contact
              key={userId}
              id={userId}
              online={true}
              username={onlinePeopleExclOurUser[userId]}
              onClick={() => {setSelectedUserId(userId)}}
              selected={userId === selectedUserId} />
            ))}

            </div>
            <div className='p-2 text-center flex items-center justify-center'>
                <span className='mr-2 text-sm text-gray-600 flex items-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                    </svg>
                    {username}
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
             {!selectedUserId && (
                <div className="flex h-full flex-grow items-center justify-center">
                    <div className="text-gray-300">&larr; Select a person from the sidebar</div>
                </div>
                )}
            </div>
        </div>
    </div>
  )
}

export default Chat