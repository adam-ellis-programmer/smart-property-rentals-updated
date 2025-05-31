import { useState } from 'react'
import SigninForm from '../components/forms/SigninForm'
import bgImg from '../temp/images/properties/update-bg.webp'
import FormSubmitLoader from '../components/loaders/FormSubmitLoader'
import DemoUserLoginBtn from '../components/buttons/DemoUserLoginBtn'
const Signin = () => {
  const [isSubmiting, setisSubmiting] = useState(false)

  if (isSubmiting) {
    return <FormSubmitLoader />
  }
  return (
    <section className='form-page-container  access-page-grid'>
      <img className='access-grid-img' src={bgImg} alt='' />
      <div className='access-grid-overlay'></div>
      <div className='sign-in-left'></div>
      <div className='access-form-container'>
        <SigninForm setisSubmiting={setisSubmiting} />
        <div className='test-drive-btn-wrap'>
          <DemoUserLoginBtn />
        </div>
      </div>
    </section>
  )
}

export default Signin
