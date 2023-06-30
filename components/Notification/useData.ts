import { useContext, useReducer } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'add':
      return { status: 'resolved', data: [...state.data, action.data], error: null }
    case 'delete':
      const data = state.data.filter(item => item?.id !== action.data)
      return { status: 'resolved', data: data, error: null }
    default:
      return state.data
  }
}

function makeId(length) {
  var result = ''
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  var charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

const useNotification = () => {
  // type is success or error. true is success, false is error
  const [state, dispatch] = useReducer(notificationReducer, {
    status: 'idle',
    data: [],
    error: null,
  })

  const { data: notifications } = state

  const success = data => {
    const { title, txHash } = data
    const id = makeId(10)
    dispatch({ type: 'add', data: { id, title, txHash, type: true } })
  }

  const error = data => {
    const { title, txHash } = data
    const id = makeId(10)
    dispatch({ type: 'add', data: { id, title, txHash, type: false } })
  }

  const remove = id => {
    dispatch({ type: 'delete', data: id })
  }

  return {
    notifications,
    success,
    error,
    remove,
  }
}

export default useNotification
