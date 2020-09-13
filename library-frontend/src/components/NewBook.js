import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { CREATE_BOOK, ALL_BOOKS, ALL_AUTHORS } from './queries'


const NewBook = (props) => {
  const [title, setTitle] = useState("")
  const [author, setAuhtor] = useState("")
  const [published, setPublished] = useState("")
  const [genre, setGenre] = useState("")
  const [genres, setGenres] = useState([])
  const [error, setError] = useState(null) 

  const [createBook] = useMutation(CREATE_BOOK, {
    refetchQueries: [ { query: ALL_BOOKS }, { query: ALL_AUTHORS }],
    onError: err => {
      setError(err.graphQLErrors[0].message)
    }
  })
  
  if (!props.show) {
    return null
  }


  const submit = async (event) => {
    event.preventDefault()
    createBook({variables: {title, published: Number(published), author, genres}})

    setTitle("")
    setPublished("")
    setAuhtor("")
    setGenres([])
    setGenre("")
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre("")
  }
  
  return (
    <div>
      <form onSubmit={submit} style={styles.form}>
        <div style={styles.field}>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.field}>
          author
          <input
            value={author}
            onChange={({ target }) => setAuhtor(target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.field}>
          published
          <input
            type='number'
            value={published}
            onChange={({ target }) => setPublished(target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.field}>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
            style={styles.input}
          />
          <button onClick={addGenre} type="button">add genre</button>
        </div>
        <div>
          genres: {genres.join(' ')}
        </div>
        <button type='submit' style={styles.btn}>create book</button>
      </form>
    </div>
  )
}

export default NewBook


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