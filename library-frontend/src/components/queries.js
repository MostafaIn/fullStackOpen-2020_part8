import { gql } from '@apollo/client'

const BOOK_DETAILS = gql `
  fragment bookDetails on Book {
    title
      published
      author {
        name
      }
      genres
  }
`

const AUTHOR_DETAILS = gql `
  fragment authorDetails on Author {
    name
    born
    bookCount
  }
`


export const ALL_BOOKS = gql`
  query getBooks($byGenre: String){
    allBooks(genre: $byGenre) {
      ...bookDetails
    }
  }
  ${BOOK_DETAILS}
`

export const ALL_AUTHORS = gql`
  query{
      allAuthors {
          ...authorDetails
      }
  }
  ${AUTHOR_DETAILS}
`

export const ME = gql `
  query{
    me{
      username
      favoriteGenre
    }
  }
`

export const CREATE_BOOK = gql `
mutation createBook(
    $title: String!
    $published: Int!
    $author: String!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      published: $published
      author: $author
      genres: $genres
    ) {
      ...bookDetails
    }
}
${BOOK_DETAILS}
`

export const SET_BIRTHYEAR = gql `
    mutation setBirthyear(
        $name: String!
        $born: Int!
    ){
     editAuthor(
          name: $name
          setBornTo: $born
     ){
         ...authorDetails
     }
    }
  ${AUTHOR_DETAILS}
`

export const LOGIN = gql`
  mutation login(
    $username: String!
    $password: String!
    ){
    login(
      username: $username
      password: $password
      ){
        value
      }
  }
`