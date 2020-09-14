import React,{ useState } from 'react'
import Select from 'react-select'
import { useQuery, useMutation } from '@apollo/client'
import { ALL_AUTHORS, SET_BIRTHYEAR } from './queries'

const SetBirthyear = ({setError}) => {
    const [name, setName] = useState("")
    const [born, setBorn] = useState("")

    const result = useQuery(ALL_AUTHORS)
    const [setBirthyear] = useMutation(SET_BIRTHYEAR,{
        refetchQueries:[{ query: ALL_AUTHORS }],
        onError: err => {
          err.networkError ? setError(err.message) : setError(err.graphQLErrors[0].message)
        }
    })

    const options = result.data.allAuthors.map( author => {
        return {
            value: author.name,
            label: author.name
        }
    })

    const submitBirthyear = e => {
        e.preventDefault()
        if(!born){
          return window.alert('please set his birth year!')
        }
        setBirthyear({ variables: { name, born: Number(born) }})
        setName("")
        setBorn("")
    }

    return (
        <form onSubmit={submitBirthyear} style={styles.form}>
        <h3>Set birthyear</h3>
        <div style={styles.field}>
          <span>name:</span>
          <Select 
            onChange={(e) => setName(e.label)}
            options={options}
            styles={customStyles}
            placeholder="author name"
          />
        </div>
        <div style={styles.field}>
          born:
          <input
            type='number'
            value={born}
            onChange={({ target }) => setBorn(target.value)}
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.btn}>update author</button>
        </form>
    )
}

export default SetBirthyear

const styles = {
    form:{
      maxWidth:'30%',
      margin:'40px',
      display:'flex',
      flexDirection:'column',
    },
    field:{
      maxWidth:'50%',
      display:'flex',
      justifyContent:'space-between',
      alignItems:'center',
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

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      borderBottom: '1px dotted #333',
      color: state.isSelected ? '#eee' : '#100',
      padding: 5,
    }),
    control: () => ({
      width: 180,
      display:'flex',
    }),
    singleValue: (provided, state) => {
      const opacity = state.isDisabled ? 0.5 : 1;
      const transition = 'opacity 300ms';
  
      return { ...provided, opacity, transition };
    }
  }
