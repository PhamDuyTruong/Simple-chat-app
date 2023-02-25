import React, {useEffect, useState, useRef, useContext} from 'react';
import axios from 'axios'
import {UserContext} from "./UserContext.jsx";
import Logo from './Logo.jsx';
import Contact from './Contact'

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

    function sendMessage(e, file = null){
        if (e) e.preventDefault();
        ws.send(JSON.stringify({
          recipient: selectedUserId,
          text: newMessageText,
        }));
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

            {!!selectedUserId && (
          <form className="flex gap-2" onSubmit={sendMessage}>
            <input type="text"
                   value={newMessageText}
                   onChange={ev => setNewMessageText(ev.target.value)}
                   placeholder="Type your message here"
                   className="bg-white flex-grow border rounded-sm p-2"/>
            <label className="bg-blue-200 p-2 text-gray-600 cursor-pointer rounded-sm border border-blue-200">
              <input type="file" className="hidden" />
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M18.97 3.659a2.25 2.25 0 00-3.182 0l-10.94 10.94a3.75 3.75 0 105.304 5.303l7.693-7.693a.75.75 0 011.06 1.06l-7.693 7.693a5.25 5.25 0 11-7.424-7.424l10.939-10.94a3.75 3.75 0 115.303 5.304L9.097 18.835l-.008.008-.007.007-.002.002-.003.002A2.25 2.25 0 015.91 15.66l7.81-7.81a.75.75 0 011.061 1.06l-7.81 7.81a.75.75 0 001.054 1.068L18.97 6.84a2.25 2.25 0 000-3.182z" clipRule="evenodd" />
              </svg>
            </label>
            <button type="submit" className="bg-blue-500 p-2 text-white rounded-sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </form>
        )}
        </div>
    </div>
  )
}

export default Chat