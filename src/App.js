import React,{useState,useEffect} from "react";
import "./App.css";
import * as BooksAPI from './BooksAPI';
import Book from './components/Book';
import Shelves from "./components/Shelves";
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'


const App=()=> {
  

  const [books, setBooks] = useState([])
 const [mapOfIdToBooks, setMapOfIdToBooks] = useState(new Map());

 const [query, setQuery] = useState("");
const [searchBooks, setSearchBooks] = useState([]);
 const [mergedBooks, setMergedBooks] = useState([]);


  

  useEffect(() => {

    BooksAPI.getAll()
      .then(data => {
        setBooks(data)
        setMapOfIdToBooks(createMapOfBooks(data))

      }
      );
  }, [])

  const createMapOfBooks = (books) => {
    const map = new Map();
    books.map(book => map.set(book.id, book));
    return map;
  }

useEffect(()=>{
 let isActive=true;
 if(query){
  BooksAPI.search(query).then(data=>{
    if(data.error){
      setSearchBooks([])
    }else{
      if(isActive){
        setSearchBooks(data);
      }
    }
  })
 }
return ()=>{
  isActive=false;
  setSearchBooks([])
  
}
},[query])


  useEffect(() => {

    const combined = searchBooks.map(book => {
      if (mapOfIdToBooks.has(book.id)) {
        return mapOfIdToBooks.get(book.id);
      } else {
        return book;
      }
    })
    setMergedBooks(combined);
  }, [searchBooks])

 


  const updateBookShelf = (book, whereTo) => {
    const updatedBooks = books.map(b => {
      if (b.id === book.id) {
        book.shelf = whereTo;
        return book;
        
      }
      return b;
    })
    if (!mapOfIdToBooks.has(book.id)) {
      book.shelf = whereTo;

      updatedBooks.push(book)

      
    }
    setBooks(updatedBooks);
    BooksAPI.update(book, whereTo);

    
  }


  return (
    <div className="app" >
      <Router>

        <Switch>
          
          {
          // search  
          }
          <Route path="/search">
            <div className="search-books">
              <div className="search-books-bar">
              <Link to="/" className="close-search" >Close</Link>

                <div className="search-books-input-wrapper">
                
                  <input type="text" placeholder="Search by title, author, or ISBN" value={query} onChange={(e) => setQuery(e.target.value)} />
                </div>
              </div>
              <div className="search-books-results">
                <ol className="books-grid">
                  {mergedBooks.map(b => (
                    <li key={b.id}>
                      <Book book={b} changeBookShelf={updateBookShelf}  />
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </Route>

          {
          // main_page 
          }
          <Route path="/">
            <div className="list-books" >

            <div className="list-books-title">
            <h1>MyReads</h1>
        </div>              <div className="list-books-content">
                <Shelves books={books} updateBookShelf={updateBookShelf}  />
              </div>
              <div className="open-search">
                <Link to="/search"  />
              
                
              </div>
            </div>
          </Route>
        </Switch>
      </Router>
    </div>
  )

}

export default App;
