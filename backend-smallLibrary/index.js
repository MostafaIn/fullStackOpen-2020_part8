const { ApolloServer, gql } = require('apollo-server')
const mongoose = require('mongoose')
const Book = require('./models/Book')
const Author = require('./models/Author')
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
      bookCount: () => Book.collection.countDocuments(),
      authorCount: () => Author.collection.countDocuments(),
      allBooks: async (root, args) => {
          const author = await Author.findOne({ name: args.author})
          const filteredByAuthor = Book.find({ author: author}).populate('author')
          const filteredByGenre = Book.find({ genres: args.genre }).populate('author')
          const filteredByAuthorAndGenre = Book.find({ author: author, genres: args.genre}).populate('author')
        //   console.log(filteredByAuthorAndGenre)
          if(args.author && args.genre){
            return filteredByAuthorAndGenre
          }else if(args.author){
            return filteredByAuthor
          }else if(args.genre){
            return filteredByGenre
          }else{
            return Book.find({}).populate('author')
          }
      },
      allAuthors: () => {
        return Author.find({})
      }
  },

  Mutation: {
      addBook: async (root, args) => {
        let authorID = await Author.findOne({ name: args.author }).select('_id')
        if(!authorID){
          const author = new Author({ name: args.author })
          await author.save()
          authorID = author._id
        }
        const book = new Book({...args})
        book.author = authorID
        await book.save()
        return Book.findOne({ title: args.title }).populate('author')
      },

      editAuthor: async (root, args) => {
        let author = await Author.findOne({ name: args.name }) 
        author.born = args.setBornTo
        console.log(author)
        return author.save()
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