import { createContext } from 'react'
// create notification context with initial value
const NotificationContext = createContext({
  success: undefined,
  error: undefined,
})

export default NotificationContext
