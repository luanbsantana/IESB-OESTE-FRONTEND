import { createContext, useReducer } from 'react'
import { authReducer } from './authReducer'

export const AuthContext = createContext({})

const initialState = {
  isAuthenticated: false,
  user: null,
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  return (
    <AuthContext.Provider
      value={{
        authState: state,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}