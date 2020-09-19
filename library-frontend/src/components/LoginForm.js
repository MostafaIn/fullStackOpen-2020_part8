import React, { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from './queries'

const LoginForm = ({ show, setPage, setError, setToken }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [ login, result ] = useMutation(LOGIN, {
    onError: (error) => {
      setError(error.graphQLErrors[0].message)
    }
  })

  useEffect(() => {
    if ( result.data ) {
      const token = result.data.login.value
      setToken(token)
      window.localStorage.setItem('library-user-token', token)
      setPage('authors')
    }
  }, [result.data]) // eslint-disable-line

  const handleSubmit = async (event) => {
    event.preventDefault()
    login({ variables: { username, password } })
  }

  if (!show) {
    return null
  }

  return (
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>Login</h2>
        <div style={styles.field}>
          username 
          <input 
            type="text" 
            value={username} 
            style={styles.input}
            onChange={({ target }) => setUsername(target.value)}/>
        </div>
        <div style={styles.field}>
          password 
          <input 
            type='password' 
            value={password} 
            style={styles.input}
            onChange={({ target }) => setPassword(target.value)}/>
        </div>
        <button type='submit' style={styles.btn}>login</button>
      </form>
  )
}

export default LoginForm

const styles = {
    form:{
      maxWidth:'40%',
      margin:'40px',
      display:'flex',
      flexDirection:'column',
    },
    field:{
      maxWidth:'40%',
      display:'flex',
      justifyContent:'space-between',
      margin:'10px'
    },
    input:{
      border:'none',
      outline:'none',
      padding:'3px',
      borderBottom:'1px solid darkgreen'
    },
    btn:{
      maxWidth:'40%',
      padding:'3px',
      margin:'10px'
  
    }
  }