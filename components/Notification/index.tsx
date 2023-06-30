import { useContext } from 'react'

import NotificationContext from './context'
import Notification from './element'
import useData from './useData'

const NotificationContainer = ({ children }) => {
  // type is success or error. true is success, false is error
  const { notifications, success, error, remove } = useData()

  return (
    <NotificationContext.Provider value={{ success, error }}>
      {notifications.map(({ id, title, txHash, type }) => (
        <Notification key={id} id={id} title={title} txHash={txHash} type={type} remove={remove} />
      ))}
      {children}
    </NotificationContext.Provider>
  )
}

const useNotification = () => {
  const { success, error } = useContext(NotificationContext)
  return {
    success,
    error,
  }
}

export { NotificationContainer, useNotification }
