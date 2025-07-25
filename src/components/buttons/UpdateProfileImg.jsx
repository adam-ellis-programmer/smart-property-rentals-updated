import { useRef, useState } from 'react'
import { db } from '../../firebase-config'
import { getAuth, updateProfile } from 'firebase/auth'
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage'
import { setLoginChange } from '../../features/properties/propertiesSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useDemoUserCheck } from '../../hooks/useDemoUserCheck'

// step 1
const UpdateProfileImg = ({ loggedInUser }) => {
  const { isDemoUser, checkDemoUser } = useDemoUserCheck()

  const dispatch = useDispatch()
  const { signUpChange } = useSelector((state) => state.property)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef(null)
  const handleUpdateClick = () => {
    if (checkDemoUser()) {
      return
    }
    const inputRef = fileInputRef.current
    inputRef.click()
    console.log(inputRef)
  }

  // step 2
  const handleFileChangeAndUpload = async (e) => {
    try {
      setLoading(true)
      const selectedFile = e.target.files[0]
      const userID = loggedInUser.uid

      const filePath = `profile-images/${userID}/profile-pic`

      const newURL = await upLoadImg(selectedFile, filePath)

      const auth = getAuth()
      await updateProfile(auth.currentUser, {
        photoURL: newURL,
      })
      setLoading(false)
      // setLoginChange sends a boolean to useEffect dependency to run the code to change the profile picture
      dispatch(setLoginChange(!signUpChange))
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  //   step 3
  const upLoadImg = (file, filePath) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage()

      // Create the file metadata
      /** @type {any} */
      const metadata = {
        contentType: 'image/jpeg',
      }

      // Upload file and metadata to the object 'images/mountains.jpg'
      const storageRef = ref(storage, filePath)
      const uploadTask = uploadBytesResumable(storageRef, file, metadata)

      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          console.log('Upload is ' + progress + '% done')
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused')
              break
            case 'running':
              console.log('Upload is running')
              break
          }
        },
        (error) => {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case 'storage/unauthorized':
              // User doesn't have permission to access the object
              break
            case 'storage/canceled':
              // User canceled the upload
              break

            // ...

            case 'storage/unknown':
              // Unknown error occurred, inspect error.serverResponse
              break
          }
          reject(error)
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            // console.log('File available at', downloadURL)
            resolve(downloadURL)
          })
        }
      )
    })
  }
  return (
    <button
      onClick={handleUpdateClick}
      className='delete-acc-btn acc-update-btn'
    >
      {loading ? 'updating...' : 'change profile img'}
      <input
        onChange={(e) => handleFileChangeAndUpload(e)}
        ref={fileInputRef}
        type='file'
        name=''
        id=''
        hidden
      />
    </button>
  )
}

export default UpdateProfileImg
