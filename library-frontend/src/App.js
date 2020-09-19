
import React, { useState, useEffect } from 'react'
import { useApolloClient } from '@apollo/client'

import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Notify from './components/Notify'
import LoginForm from './components/LoginForm'

const App = () => {
  const [page, setPage] = useState('authors')
  const [errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  useEffect(() => {
    const storedToken = window.localStorage.getItem('library-user-token')
    if(storedToken){
      setToken(storedToken)
    }
  }, [])

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const handleLogout = () => {
    setToken(null)
    setPage('authors')
    window.localStorage.removeItem('library-user-token')
    client.resetStore()
  }

  return (
    <div>
      <div style={styles.menuBtns}>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {!token ?
          <button onClick={() => setPage('login')}>login</button>
          :
          <div>
          <button onClick={() => setPage('add')}>add book</button>
          <button onClick={handleLogout}>log out</button>
          </div>
        }
      </div>
      <Notify errorMessage={errorMessage}/>
      <Authors
        show={page === 'authors'}
        setError={notify}
      />

      <Books
        show={page === 'books'}
      />

      <NewBook
        show={page === 'add'}
        setError={notify}
      />
      <LoginForm
        show={page === 'login'}
        setPage={setPage}
        setToken={setToken}
        setError={notify}
      />

    </div>
  )
}

export default App

const styles = {
  menuBtns: {
    display:'flex'
  }
}

