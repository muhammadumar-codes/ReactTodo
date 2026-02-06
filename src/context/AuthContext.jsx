import { createContext } from 'react'
const AuthContext = createContext()
export default function contextProvider({ children }) {
  return (
    <>
      <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>
    </>
  )
}
