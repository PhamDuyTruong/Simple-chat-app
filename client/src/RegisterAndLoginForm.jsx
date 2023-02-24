import React, {useState, useContext} from 'react';
import axios from 'axios';
import UserContext from './UserContext'

const RegisterAndLoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const {setUsername: setLoggedInUsername, setId} = useContext(UserContext);

  const handleRegister = async (e) => {
    e.preventDefault();
    const url = '/register';
    const formData = {
      username: username,
      password: password
    }
    const {data} = await axios.post(url, formData);
    setLoggedInUsername(username);
    setId(data.id);
  }

  return (
    <div className='bg-blue-50 h-screen flex items-center'>
        <form className='w-64 mx-auto mb-12' onSubmit={handleRegister}>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder='Username' className='block w-full rounded-sm p-2 mb-2 border'/>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder='password' className='block w-full rounded-sm p-2 mb-2 border'/>
            <button className='bg-blue-500 text-white block w-full rounded-sm p-2'>
                Register
            </button>
            <div className='text-center mt-2'>
                <div>
                Already an account 
                <button className='ml-1'>
                    Login here
                </button>
                </div>
              
                <div>
                 Dont have an account?
              <button type='button' className="ml-1">
                Register
              </button>
            </div>
            </div>
        </form>

    </div>
  )
}

export default RegisterAndLoginForm