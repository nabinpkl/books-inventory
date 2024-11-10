import { useEffect, useState } from "react";
import AddBook from "./components/AddBook";
import BookList from "./components/BookList";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { PlusCircleIcon, MagnifyingGlassIcon, EllipsisVerticalIcon, ChevronDownIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import GenreSelect from "./components/GenreSelect";
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import { getBooks } from "./api/api";
import { IBook } from "./types/Book";
import NavBar from "./components/NavBar";


enum SearchField {
  ALL = 'all',
  TITLE = 'title',
  AUTHOR = 'author',
  ISBN = 'isbn'
}

function App() {

  // For showing/closing the Add Book dialog
  const [openAddBook, setOpenAddBook] = useState(false);
  // For showing/closing export books dialog
  const [openExportBooks, setOpenExportBooks] = useState(false);
  // For selecting the export format
  const [exportFormat, setExportFormat] = useState<string>('csv');
  // For updating the book list after adding a new book
  const [isBookAdded, setIsBookAdded] = useState(false);

  const [books, setBooks] = useState<IBook[]>([]);

  // Filter states
  const [currentSelectedGenre, setCurrentSelectedGenre] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [currentPublishedDate, setCurrentPublishedDate] = useState<string>('');
  const [publishedDate, setPublishedDate] = useState<string>('');
  const [currentSearchTerm, setCurrentSearchTerm] = useState<string>('');
  const [searchedTerm, setSearchedTerm] = useState<string>('');
  const [searchField, setSearchField] = useState<SearchField>(SearchField.ALL);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchBooks = (
    searchTerm: string = '',
    searchField: SearchField = SearchField.ALL,
    genre: string = '',
    publishedDate: string = ''
  ) => {
    setIsLoading(true);
    getBooks(
      searchTerm,
      searchField,
      genre,
      publishedDate
    ).then((data) => {
      setIsLoading(false);
      setBooks(data);
    }).catch((error) => {
      setIsLoading(false);
      console.error(error);
      toast.error('Failed to fetch books');
    });
  }

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setSearchedTerm(currentSearchTerm);
    setSelectedGenre(currentSelectedGenre);
    setPublishedDate(currentPublishedDate);
    fetchBooks(currentSearchTerm, searchField, currentSelectedGenre, currentPublishedDate);
  }

  const handleClearSearch = () => {
    setCurrentSearchTerm('');
    setSearchedTerm('');
    setCurrentSelectedGenre('');
    setCurrentPublishedDate('');
    setSelectedGenre('');
    setPublishedDate('');
    setSearchField(SearchField.ALL);
    fetchBooks();
  }

  const handleFilter = () => {
    setSelectedGenre(currentSelectedGenre);
    setPublishedDate(currentPublishedDate);
    fetchBooks(searchedTerm, searchField, currentSelectedGenre, currentPublishedDate);
  }

  const downloadFile = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadExportedData = () => {
    // Download the exported data in the selected format
    if (exportFormat === 'csv') {
      const csvContent = books.map(book =>
        `${book.entry_id || ''},"${book.title}","${book.author}","${book.genre}","${book.publication_date}","${book.isbn}"`
      );
      csvContent.unshift("entry_id,title,author,genre,publication_date,isbn");
      const csvBlob = new Blob([csvContent.join('\n')], { type: 'text/csv' });
      const csvUrl = URL.createObjectURL(csvBlob);
      downloadFile(csvUrl, 'books.csv');
    }
    else {
      // Export as JSON
      const jsonContent = JSON.stringify(books, null, 2);
      const jsonBlob = new Blob([jsonContent], { type: 'application/json' });
      const jsonUrl = URL.createObjectURL(jsonBlob);
      downloadFile(jsonUrl, 'books.json');
    }
    setOpenExportBooks(false);
  }




  useEffect(() => {
    fetchBooks();
  }, [isBookAdded]);


  return (

    <div className="App w-full">

      {/* React Toastify container */}
      <ToastContainer />

      {/* Navigation bar */}
      <NavBar />

      <div className="md:flex justify-center">
        <div className="md:flex mt-8 md:w-[100vw] lg:w-[70vw]">

          {/* Sidebar */}
          <aside className="md:w-1/3 md:h-screen px-4">
            <h2 className="text-xl text-gray-600">Filter by</h2>
            <hr className="w-full h-0.5 my-1 rounded bg-gray-300 mb-4" />


            {/* Genre filter */}
            <label className="block text-md font-medium text-gray-700 mb-1">Genre</label>
            <GenreSelect selectedGenre={currentSelectedGenre} onGenreChange={setCurrentSelectedGenre} />


            {/* Published date filter */}
            <div className="mt-4">
              <label className="block text-gray-700 font-medium mb-2">Published Date</label>
              <input
                type="date"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-lightblue-500 shadow-sm"
                value={currentPublishedDate}
                onChange={(event) => setCurrentPublishedDate(event.target.value)}
              />
            </div>

            {/* Clear and Filter buttons */}
            <div className="mt-4 flex gap-2">

              <button
                className="w-full text-center border border-sky-200 hover:bg-sky-50 focus:shadow-outline focus:outline-none text-lightblue font-bold py-2 px-4 rounded"
                onClick={handleFilter}
              >
                Filter
              </button>
            </div>

          </aside>

          {/* Main content */}
          <main className="ml-4 md:w-3/4">

            {/* Top bar */}
            <section className="md:flex items-center justify-between mb-4 mt-4">
              {/* Search Bar */}
              <div className="relative mr-4 md:flex-grow lg:flex-grow-0 lg:w-[30vw]">
                <form onSubmit={handleSearch}>
                  <input
                    name="searchTerm"
                    type="text"
                    placeholder="Search books by title, author or ISBN"
                    className="md:text-sm w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-lightblue-500 shadow-sm"
                    value={currentSearchTerm}
                    onChange={(event) => setCurrentSearchTerm(event.target.value)}
                  />
                  <button
                    type="submit"
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
                  </button>
                </form>
              </div>

              {/* Add and export buttons */}
              <div className="flex items-center justify-end mt-4 md:mt-0">
                {/* Add new book */}
                <button
                  className="flex items-center shadow bg-lightblue hover:bg-sky-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
                  onClick={() => setOpenAddBook(true)}
                >
                  <PlusCircleIcon className="h-6 w-6 mr-2" />
                  <p>Add New Book</p>
                </button>

                {/* Add book dialog */}
                <Dialog open={openAddBook} onClose={setOpenAddBook} className="relative z-10">
                  <DialogBackdrop className="fixed inset-0 bg-black bg-opacity-50" />
                  <DialogPanel className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded shadow-lg w-[90vw] md:w-1/2">
                    <DialogTitle className="text-xl font-semibold">Add a new book</DialogTitle>
                    <AddBook onAdd={() => {
                      setIsBookAdded(!isBookAdded);
                      setOpenAddBook(false);
                      setSearchedTerm('');
                      setCurrentSearchTerm('');
                      setSearchField(SearchField.ALL);
                    }} />
                  </DialogPanel>
                </Dialog>

                {/* Export Books Data*/}
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <MenuButton className="mt-2 ml-2 h-8 w-8 rounded-md bg-white text-sm font-semibold text-gray-900  hover:bg-gray-50">
                      <EllipsisVerticalIcon aria-hidden="true" className="text-gray-400" />
                    </MenuButton>
                  </div>

                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2 w-52 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                  >
                    <div className="py-1">
                      <MenuItem>
                        <button
                          onClick={() => setOpenExportBooks(true)}
                          className="block px-9 py-2 text-md text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                        >
                          Export Books Data
                        </button>
                      </MenuItem>
                    </div>
                  </MenuItems>
                </Menu>

                <Dialog open={openExportBooks} onClose={setOpenExportBooks} className="relative z-10">
                  <DialogBackdrop className="fixed inset-0 bg-black bg-opacity-50" />
                  <DialogPanel className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded shadow-lg w-[90vw] md:w-1/3 lg:w-1/4">
                    <DialogTitle className="text-xl font-semibold">Export Books Data</DialogTitle>

                    <div className="mt-4">
                      <label className="block text-gray-700 font-medium mb-2">Export Format</label>
                      <select
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-lightblue-500 shadow-sm"
                        value={exportFormat}
                        onChange={(event) => setExportFormat(event.target.value)}
                      >
                        <option value="csv">CSV</option>
                        <option value="json">JSON</option>
                      </select>
                    </div>

                    {/* Download button */}
                    <div className="mt-4">
                      <button
                        onClick={handleDownloadExportedData}
                        className="flex items-center justify-center bg-lightblue text-white w-full hover:bg-sky-400 focus:shadow-outline focus:outline-none  font-bold py-3 rounded"
                      >
                        <ArrowDownTrayIcon className="h-6 w-6 mr-3" />
                        <p>Download</p>
                      </button>
                    </div>



                  </DialogPanel>
                </Dialog>
              </div>

            </section>

            {!isLoading && (searchedTerm || selectedGenre || publishedDate) &&
              <section className="mb-3">

                {/* Filter results further by title, author or isbn radio*/}

                {searchedTerm &&
                  <div className="flex items-center gap-2">
                    <label className="text-gray-500">Search in fields</label>

                    <input
                      type="radio"
                      name="searchField"
                      value="all"
                      id="all"
                      checked={searchField === SearchField.ALL}
                      onChange={() => setSearchField(SearchField.ALL)}
                    />
                    <label htmlFor="all">All</label>

                    <input
                      type="radio"
                      name="searchField"
                      value="title"
                      id="title"
                      checked={searchField === SearchField.TITLE}
                      onChange={() => setSearchField(SearchField.TITLE)}
                    />
                    <label htmlFor="title">Title</label>

                    <input
                      type="radio"
                      name="searchField"
                      value="author"
                      id="author"
                      checked={searchField === SearchField.AUTHOR}
                      onChange={() => setSearchField(SearchField.AUTHOR)}
                    />
                    <label htmlFor="author">Author</label>

                    <input
                      type="radio"
                      name="searchField"
                      value="isbn"
                      id="isbn"
                      checked={searchField === SearchField.ISBN}
                      onChange={() => setSearchField(SearchField.ISBN)}
                    />
                    <label htmlFor="isbn">ISBN</label>
                  </div>
                }

                {/* Search results help text */}
                <div className="mt-1 flex items-center">
                  <h2 className=" text-gray-500">Showing {books.length} results
                    {searchedTerm && ` for "${searchedTerm}"`}
                    {selectedGenre && ` in ${selectedGenre}`}
                    {publishedDate && ` on  ${publishedDate}`}
                  </h2>
                  <button
                    className="ml-2 text-blue-500"
                    onClick={handleClearSearch}
                  >Clear</button>
                </div>

              </section>
            }

            {/*  Book List */}
            <BookList isLoading={isLoading} books={books} />

          </main>

        </div>
      </div>
    </div>

  );
}

export default App;
