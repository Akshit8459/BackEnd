require('dotenv').config();
const mongoose = require('mongoose');
const Author = require('./Schemas/AuthorSchema');
const Book = require('./Schemas/BookSchema');
const Publisher = require('./Schemas/PublisherSchema');


mongoose.connect(process.env.URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("✅ Connected to DB");
  seedData();
}).catch(err => console.error("❌ DB connection error:", err));


const seedData = async () => {
  try {
    // Clean existing data
    await Author.deleteMany();
    await Book.deleteMany();
    await Publisher.deleteMany();
    console.log("🧹 Cleared old data");

    // Sample publisher data
    const publisherData = [
      { publisher: "Penguin Random House", location: "New York", established: new Date("1925-07-01") },
      { publisher: "HarperCollins", location: "London", established: new Date("1817-08-01") },
      { publisher: "Simon & Schuster", location: "New York", established: new Date("1924-01-02") },
      { publisher: "Macmillan", location: "London", established: new Date("1843-04-12") },
      { publisher: "Hachette Livre", location: "Paris", established: new Date("1826-06-19") },
      { publisher: "Oxford University Press", location: "Oxford", established: new Date("1586-05-10") },
      { publisher: "Scholastic", location: "New York", established: new Date("1920-10-15") },
      { publisher: "Bloomsbury", location: "London", established: new Date("1986-12-01") },
      { publisher: "Pan Macmillan", location: "Sydney", established: new Date("1965-11-22") },
      { publisher: "Random India", location: "Delhi", established: new Date("1998-08-20") }
    ];

    const publishers = await Publisher.insertMany(publisherData);
    console.log("📚 Created Publishers");

    // Sample authors
    const authorData = [
      { author: "George Orwell", bio: "Known for 1984 and Animal Farm" },
      { author: "J.K. Rowling", bio: "Wrote the Harry Potter series" },
      { author: "Jane Austen", bio: "Author of Pride and Prejudice" },
      { author: "Mark Twain", bio: "Known for Tom Sawyer and Huck Finn" },
      { author: "Agatha Christie", bio: "Mystery writer of Poirot and Marple" },
      { author: "Stephen King", bio: "Master of horror and thrillers" },
      { author: "Ernest Hemingway", bio: "Famous for The Old Man and the Sea" },
      { author: "F. Scott Fitzgerald", bio: "Wrote The Great Gatsby" },
      { author: "Leo Tolstoy", bio: "Author of War and Peace" },
      { author: "Harper Lee", bio: "Known for To Kill a Mockingbird" }
    ];

    // Assign random publishers to authors
    const authors = await Promise.all(authorData.map(async (a) => {
      const randomPubs = getRandomItems(publishers, 2);
      return await Author.create({ ...a, publishers: randomPubs.map(p => p._id) });
    }));
    console.log("✍️ Created Authors");

    // Sample books
    const bookData = [
      { title: "1984", pages: 328, genre: "Dystopian", publishedDate: new Date("1949-06-08") },
      { title: "Harry Potter", pages: 309, genre: "Fantasy", publishedDate: new Date("1997-06-26") },
      { title: "Pride and Prejudice", pages: 279, genre: "Romance", publishedDate: new Date("1813-01-28") },
      { title: "Huck Finn", pages: 366, genre: "Adventure", publishedDate: new Date("1884-12-10") },
      { title: "Murder on the Orient Express", pages: 256, genre: "Mystery", publishedDate: new Date("1934-01-01") },
      { title: "It", pages: 1138, genre: "Horror", publishedDate: new Date("1986-09-15") },
      { title: "The Old Man and the Sea", pages: 127, genre: "Fiction", publishedDate: new Date("1952-09-01") },
      { title: "The Great Gatsby", pages: 180, genre: "Classic", publishedDate: new Date("1925-04-10") },
      { title: "War and Peace", pages: 1225, genre: "Historical", publishedDate: new Date("1869-01-01") },
      { title: "To Kill a Mockingbird", pages: 281, genre: "Southern Gothic", publishedDate: new Date("1960-07-11") }
    ];

    const books = await Promise.all(bookData.map(async (b, i) => {
      const author = authors[i % authors.length];
      const publisher = publishers[i % publishers.length];
      const book = await Book.create({ ...b, author: author._id, publisher: publisher._id });

      // Update references
      await Author.findByIdAndUpdate(author._id, { $push: { books: book._id } });
      await Publisher.findByIdAndUpdate(publisher._id, { $push: { books: book._id } });

      return book;
    }));

    console.log("📖 Created Books and linked to authors and publishers");

    console.log("✅ Done Seeding!");
    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error during seeding:", err);
  }
};

// Utility function to pick random items from array
function getRandomItems(arr, n) {
  return arr.sort(() => 0.5 - Math.random()).slice(0, n);
}
