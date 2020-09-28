import React,{ useState, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { ALL_BOOKS } from './queries'


const Books = (props) => {
  const [genres, setGenres] = useState([])
  const [genre, setGenre] = useState("")
  const [booksData, setBooksData] = useState([])
  const [getBooks, result] = useLazyQuery(ALL_BOOKS,{
    fetchPolicy: 'no-cache'
  })

  useEffect(() => {
    getBooks({ variables: { byGenre: genre}})

    if(result.data){
      setBooksData(result.data.allBooks)
      const genresArr = result.data.allBooks.flatMap(b => b.genres)
      const newGenres = result.data.allBooks.map( b => b.genres).slice(-1)[0]
      // console.log(newGenres)
      if(genres.length < 1){
        setGenres([...new Set(genresArr), "All genres"])
      }else{
        for(let genre of newGenres){
            if(!genres.includes(genre)){
              setGenres([genre, ...genres])
            }
        }
      }
    }
    if(genre === 'All genres') setGenre("")
  }, [genre, genres, getBooks, result.data])

  if (!props.show) {
    return null
  }
  
  return (
    <div>
      <h2>books</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {booksData.map((a, i) =>
            <tr key={i}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
      <div style={{marginTop: '2rem'}}>
          {genres.map( (genre, i) => <button 
            key={i} 
            onClick={() => setGenre(genre)}>
            {genre}
            </button>
          )}
      </div>
    </div>
  )
}

export default Books