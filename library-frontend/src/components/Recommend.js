import React from 'react'
import { useQuery } from '@apollo/client'
import { ME, ALL_BOOKS } from './queries'

const Recommend = ({show}) => {
    const me = useQuery(ME)
    const allBooks = useQuery(ALL_BOOKS)

    const myFavGenre = allBooks.data?.allBooks.filter( book => book.genres.includes(me.data.me?.favoriteGenre))

    if(!show){
        return null
    }

    return (
        <div>
            <h2>Recommendations</h2>
            <h4>books in your favorite genre: <em>{me.data.me?.favoriteGenre}</em></h4>
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
          {myFavGenre.map((a, i) =>
            <tr key={i}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
            
        </div>
    )
}

export default Recommend
