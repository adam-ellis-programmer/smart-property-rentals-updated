import { useEffect, useState, useCallback } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { db } from '../firebase-config'
import { doc, getDoc } from 'firebase/firestore'
import { setGlobalAlert } from '../features/properties/propertiesSlice'
import { useDispatch } from 'react-redux'

export const useDemoUserCheck = () => {
  const dispatch = useDispatch()
  const [testUser, setTestUser] = useState(null)
  const [demoUser, setDemoUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log(user)
        setIsAuthenticated(true)

        try {
          const tokenResult = await user.getIdTokenResult(true)
          setTestUser(tokenResult)

          const userDoc = await getUserDoc(user.uid)
          console.log('userDoc user', userDoc)

          const isDemoUserValue = userDoc?.isDemoUser ?? true
          setDemoUser(isDemoUserValue)
        } catch (error) {
          console.error('Error checking demo user status:', error)
          setDemoUser(true)
        } finally {
          setIsLoading(false)
        }
      } else {
        setIsAuthenticated(false)
        setTestUser(null)
        setDemoUser(null)
        setIsLoading(false)
      }
    })

    return () => unsubscribe()
  }, [dispatch])

  const getUserDoc = async (id) => {
    const docRef = doc(db, 'users', id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      console.log('Document data:', docSnap.data())
      return docSnap.data()
    } else {
      console.log('No such document!')
      return null
    }
  }

  // Combined check and alert function like your other project
  const checkDemoUser = useCallback(
    (
      customMessage = 'You cannot perform this action as you are a demo user'
    ) => {
      // Return true during loading for security (prevent actions)
      // Return true if not authenticated
      // Return actual demo status once loaded
      const isDemoUserResult =
        isLoading || !isAuthenticated || demoUser === true

      if (isDemoUserResult) {
        dispatch(setGlobalAlert(true))

        // Auto-hide alert after 3 seconds (match your other project)
        setTimeout(() => {
          dispatch(setGlobalAlert(false))
        }, 3000)

        console.log(customMessage)
        return true // User is a demo user or still loading
      }

      return false // User is not a demo user
    },
    [isLoading, isAuthenticated, demoUser, dispatch]
  )

  // Simple getter for when you just need the boolean without side effects
  const isDemoUser = useCallback(() => {
    if (isLoading || !isAuthenticated) return true
    return demoUser === true
  }, [isLoading, isAuthenticated, demoUser])

  return {
    checkDemoUser, // Function that checks and shows alert
  }
}
