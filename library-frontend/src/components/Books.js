import React,{ useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from './queries'


const Books = (props) => {
  const [genres, setGenres] = useState([])
  const [genre, setGenre] = useState("")
  const [booksData, setBooksData] = useState([])
  const result = useQuery(ALL_BOOKS)

  useEffect(() => {
    if(result.data){
      setBooksData(result.data.allBooks)
      const genresArr = result.data.allBooks.flatMap(b => b.genres)
      setGenres([...new Set(genresArr), "All genres"])
    }
  }, [result])

  const filteredByGenre = booksData.filter( book => (genre && genre !== "All genres") ? book.genres.includes(genre) : book)

  if (!props.show) {
    return null
  } 
  console.log(genre);
  console.log(filteredByGenre);
  
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
          {filteredByGenre.map((a, i) =>
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