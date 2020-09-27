import React,{ useState, useEffect } from 'react'
import { useQuery, useLazyQuery } from '@apollo/client'
import { ME, ALL_BOOKS } from './queries'

const Recommend = ({show}) => {
    const [myFavGenre, setMyFavGenre] = useState("")
    const me = useQuery(ME)
    const [getBooks, result] = useLazyQuery(ALL_BOOKS)

    useEffect(() => {
      getBooks({ variables: { byGenre: myFavGenre}})
      if(me.data){
        setMyFavGenre(me.data.me.favoriteGenre)
      }
    }, [getBooks, me.data, myFavGenre])

    if(!show){
        return null
    }
    console.log(me.data)
    return (
        <div>
            <h2>Recommendations</h2>
            <h4>books in your favorite genre: <em>{myFavGenre}</em></h4>
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
          {result.data.allBooks.map((a, i) =>
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
