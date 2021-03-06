  
import React from 'react'
import { useQuery } from '@apollo/client'
import { ALL_AUTHORS } from './queries'
import SetBirthyear from './SetBirthyear'


const Authors = (props) => {
  const result = useQuery(ALL_AUTHORS)
  
  if(result.loading){
    return <div style={{textAlign:'center'}}>loading ...</div>
  }

  if (!props.show) {
    return null
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {result.data.allAuthors.map((a, i) =>
            <tr key={i}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>
    <SetBirthyear setError={props.setError} />
    </div>
  )
}

export default Authors


