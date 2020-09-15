const { ApolloServer, gql } = require('apollo-server')
const mongoose = require('mongoose')
const Book = require('./models/Book')
const config = require('./utils/config')


mongoose.set('useFindAndModify', false)

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
        .then(() => console.log('connected to MongoDB'))
        .catch( err => console.log('error connection to MongoDB:', err.message))


const typeDefs = gql`
  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }
  type Author {
      name: String!
      born: Int
      bookCount: Int!
  }
  type Query {
      bookCount: Int!
      authorCount: Int!
      allBooks(author: String, genre: String): [Book!]!
      allAuthors: [Author!]!
  }
  type Mutation {
      addBook (
          title: String!
          published: Int!
          author: String!
          genres: [String!]!
      ): Book
      editAuthor (
          name: String!, 
          setBornTo: Int! 
      ): Author
  }
`

const resolvers = {
  Query: {
      bookCount: () => books.length,
      authorCount: () => authors.length,
      allBooks: (root, args) => {
          const filteredByAuthor = books.filter( book => book.author === args.author)
          const filteredByGenre = books.filter(book => book.genres.includes(args.genre))
          const filteredByAuthorAndGenre = books.filter( book => book.author === args.author && book.genres.includes(args.genre))
        //   console.log(filteredByAuthorAndGenre)
          if(args.author && args.genre){
              return filteredByAuthorAndGenre
          }else if(args.author){
              return filteredByAuthor
          }else if(args.genre){
              return filteredByGenre
          }else{
              return books
          }
      },
      allAuthors: () => {
          return authors.map( author => {
              const filteredBooks = books.filter(book => book.author === author.name)
              return {
                  name: author.name,
                  born: author.born,
                  bookCount: filteredBooks.length
              }
          })
      }
  },

  Mutation: {
      addBook: (root, args) => {
        const book = new Book({...args})
        return book.save()
      },

      editAuthor: (root, args) => {
        const author = authors.find( author => author.name === args.name)
        console.log(author)
        if(!author){
            return null
        }else{
            const updatedAuthor = { ...author, born: args.setBornTo }
            console.log(updatedAuthor)
            authors = authors.map( author => author.name === args.name ? updatedAuthor : author)
            return updatedAuthor
        } 
      }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})