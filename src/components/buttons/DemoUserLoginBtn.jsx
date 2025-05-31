import React from 'react'
import { useState } from 'react'
import SectionHeader from '../../layout/SectionHeader'
import { Link } from 'react-router-dom'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
// import PageAlert from '../alerts/PageAlert'
const DemoUserLoginBtn = () => {
  const navigate = useNavigate('')
  const [showAlert, setShowAlert] = useState(false)
  const [checking, setChecking] = useState(false)

  const [formData, setFormData] = useState({
    email: 'mel@gmail.com',
    password: '111111',
  })

  const handleLogin = async () => {
    // ...
    try {
      setChecking(true)
      const auth = getAuth()
      const res = await signInWithEmailAndPassword(
        auth,
        'test@test.com',
        '111111'
      )
      navigate('/')
      setChecking(false)
    } catch (error) {
      handleAlert()
      setChecking(false)
      console.log(error)
      const errorCode = error.code
      const errorMessage = error.message
    }
  }

  function handleAlert() {
    setShowAlert(true)
    setTimeout(() => {
      setShowAlert(false)
    }, 2000)
  }
  return (
    <button disabled={checking} onClick={handleLogin} className='demo-user-btn'>
      {checking ? ` Checking...` : `Test Drive App`}
    </button>
  )
}

export default DemoUserLoginBtn
