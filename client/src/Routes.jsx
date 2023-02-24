import React, {useContext} from 'react'
import RegisterAndLoginForm from './RegisterAndLoginForm';
import {UserContext} from "./UserContext.jsx";

const Routes = () => {
const {username, id} = useContext(UserContext);

  if(username){
    return "Login successfully !!!"
  }

  return (
    <RegisterAndLoginForm />
  )
}

export default Routes