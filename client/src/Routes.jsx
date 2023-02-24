import React, {useContext} from 'react'
import RegisterAndLoginForm from './RegisterAndLoginForm';
import {UserContext} from "./UserContext.jsx";

const Routes = () => {
const {username, id} = useContext(UserContext);

  return (
    <RegisterAndLoginForm />
  )
}

export default Routes