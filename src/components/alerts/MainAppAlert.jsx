import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import React, { useEffect, useRef } from 'react'
const MainAppAlert = () => {
  const alertRef = useRef()
  useEffect(() => {
    alertRef.current.focus()
    return () => {}
  }, [])
  return (
    <div tabIndex={-1} ref={alertRef} className='main-app-alert'>
      <FontAwesomeIcon icon={faTriangleExclamation} />
      <span className='global-alert-text'>
        demo users cannot perform this action!
      </span>
    </div>
  )
}

export default MainAppAlert
