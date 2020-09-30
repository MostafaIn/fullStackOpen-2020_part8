
import React, { useState, useEffect } from 'react'
import { useApolloClient, useSubscription } from '@apollo/client'

import { BOOK_ADDED } from './components/queries'

import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Notify from './components/Notify'
import LoginForm from './components/LoginForm'
import Recommend from './components/Recommend'

const App = () => {
  const [page, setPage] = useState('authors')
  const [errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const bookTitle = subscriptionData.data.bookAdded.title
      const authorName = subscriptionData.data.bookAdded.author.name
      window.alert(`${bookTitle} is added by ${authorName}`)
    }
  })

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
          <button onClick={() => setPage('recommend')}>recommend</button>
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
      <Recommend
        show={page === 'recommend'}
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

