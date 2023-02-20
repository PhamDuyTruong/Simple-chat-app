import React from 'react'

const RegisterAndLoginForm = () => {
  return (
    <div className='bg-blue-50 h-screen flex items-center'>
        <form className='w-64 mx-auto mb-12'>
            <input type="text" placeholder='Username' className='block w-full rounded-sm p-2 mb-2 border'/>
            <input type="password" placeholder='password' className='block w-full rounded-sm p-2 mb-2 border'/>
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
              <button className="ml-1">
                Register
              </button>
            </div>
            </div>
        </form>

    </div>
  )
}

export default RegisterAndLoginForm