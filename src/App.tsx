import {
  Link,
  Route,
  BrowserRouter as Router,
  Routes,
  Outlet,
  Navigate,
} from 'react-router-dom'
import { useEffect, useState } from 'react'

import Home from './pages/Home'
import InterstateTrade from './pages/InterstateTrade'
import Login from './pages/Login'
import Signup from './pages/Signup'
import StateEconomySearch from './pages/StateEconomySearch'
import StateSearch from './pages/StateSearch'
import AppContext from './context'
import { getCurrentUser } from './services'

export interface User {
  id: number
}

export interface WithUserProps {
  user: User | null
}

export type RouteWrapperProps = {
  isLoggedIn: boolean
}

const PrivateRouteWrapper = ({ isLoggedIn }: RouteWrapperProps) => {
  if (isLoggedIn) {
    return <Outlet />
  }
  return <Navigate to="/login" replace />
}

const AuthRouteWrapper = ({ isLoggedIn }: RouteWrapperProps) => {
  if (!isLoggedIn) {
    return <Outlet />
  }
  return <Navigate to="/" replace />
}

function App() {
  const [sessionUser, setSessionUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const user = await getCurrentUser();
        if (user?.id) {
          setSessionUser(user)
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData()
  }, [])

  const isLoggedIn = Boolean(sessionUser)

  return (
    <AppContext.Provider
      value={{
        user: sessionUser,
        setSessionUser
      }}
    >
      <Router>
        <div className="App" style={{ margin: '1rem' }}>
          <header className="App-header">
            <h1>Focus Frontend Interview Exercise</h1>
          </header>
          <nav
            style={{
              borderBottom: 'solid 1px',
              paddingBottom: '1rem',
              marginBottom: '1rem',
            }}
          >
            <Link to="/">Home</Link>|{' '}
            <Link to="/states">States Search Example</Link>|{' '}
            <Link to="/trade">Interstate Trade Search</Link>|{' '}
            <Link to="/economy">State Economy Search</Link>|{' '}
            <Link to="/login">Login</Link> |{' '}
            <Link to="/signup">Signup</Link> |{' '}
          </nav>
          {loading ? (
            <span>Loading...</span>
          ) : (
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/states"
                element={
                  <PrivateRouteWrapper
                    isLoggedIn={isLoggedIn}
                  />
                }
              >
                <Route
                  path="/states"
                  element={<StateSearch />}
                />
              </Route>
              <Route
                path="/trade"
                element={
                  <PrivateRouteWrapper
                    isLoggedIn={isLoggedIn}
                  />
                }
              >
                <Route
                  path="/trade"
                  element={<InterstateTrade />}
                />
              </Route>
              <Route
                path="/economy"
                element={
                  <PrivateRouteWrapper
                    isLoggedIn={isLoggedIn}
                  />
                }
              >
                <Route
                  path="/economy"
                  element={<StateEconomySearch />}
                />
              </Route>
              <Route
                path="/login"
                element={
                  <AuthRouteWrapper isLoggedIn={isLoggedIn} />
                }
              >
                <Route path="/login" element={<Login />} />
              </Route>
              <Route
                path="/signup"
                element={
                  <AuthRouteWrapper isLoggedIn={isLoggedIn} />
                }
              >
                <Route path="/signup" element={<Signup />} />
              </Route>
            </Routes>
          )}
        </div>
      </Router>
    </AppContext.Provider>
  )
}

export default App
