const { ApolloServer, gql, UserInputError } = require('apollo-server')
const mongoose = require('mongoose')
const Book = require('./models/Book')
const Author = require('./models/Author')
const User = require('./models/User')
const jwt = require('jsonwebtoken')
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
  type User {
    username: String!
    favoriteGenre: String!
  }
  type Token {
    value: String!
  }
  type Query {
      bookCount: Int!
      authorCount: Int!
      allBooks(author: String, genre: String): [Book!]!
      allAuthors: [Author!]!
      me: User
      allUsers: [User!]!
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
      createUser(
        username: String!
        favoriteGenre: String!
      ): User
      login(
        username: String!
        password: String!
      ): Token
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
      allAuthors: async() => {
        const authors = await Author.find({})
        return authors.map( async author => {
          return {
            name: author.name,
            born: author.born,
            bookCount: await Book.find({ author: author._id }).countDocuments()
          }
        })
      },
      me: (root, args, context) => {
        return context.currentUser
      },
      allUsers: () => User.find({})
  },

  Mutation: {
      addBook: async (root, args, context) => {
        const currentUser = context.currentUser

        if(!currentUser){
          throw new AuthenticationError("not authenticated")
        }

        let authorID = await Author.findOne({ name: args.author }).select('_id')
        if(!authorID){
          const author = new Author({ name: args.author })
          await author.save()
          authorID = author._id
        }
        const book = new Book({...args})
        book.author = authorID

        try {
          await book.save()
          await currentUser.save()
        } catch (err) {
          throw new UserInputError(err.message, {
            invalidArgs: args
          })
        }
        return Book.findOne({ title: args.title }).populate('author')
      },

      editAuthor: async (root, args, context) => {
        const currentUser = context.currentUser

        if(!currentUser){
          throw new AuthenticationError("not authenticated")
        }

        let author = await Author.findOne({ name: args.name }) 
        author.born = args.setBornTo
        console.log(author)

        try {
          await author.save()
        } catch (err) {
          throw new UserInputError(err.message, {
            invalidArgs: args
          })
        }
        return author
      },

      createUser: (root, args) => {
        const user = new User({ ...args })
        return user.save()
          .catch(error => {
              throw new UserInputError(error.message, {
              invalidArgs: args,
            })
          })
      },
      login: async (root, args) => {
        const user = await User.findOne({ username: args.username})
        
        if ( !user || args.password !== 'secured' ) {
          throw new UserInputError("wrong credentials")
        }

        const userForToken = {
          username: user.username,
          id: user._id,
        }

        return { value: jwt.sign(userForToken, config.JWT_SECRET) }
      }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if(auth && auth.toLowerCase().startsWith('bearer ')){
      const decodedToken = jwt.verify(auth.substring(7), config.JWT_SECRET)
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  }
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})