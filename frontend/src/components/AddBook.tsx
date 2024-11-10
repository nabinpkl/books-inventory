import { useState } from "react";
import GenreSelect from "./GenreSelect";
import { validateISBN } from "../utils/utils";
import { addBook } from "../api/api";
import { toast } from "react-toastify";

type AddBookProps = {
    onAdd: () => void;
};

function AddBook({ onAdd }: AddBookProps) {

    const [book, setBook] = useState({
        title: "",
        author: "",
        genre: "",
        publication_date: "",
        isbn: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();


        if (!validateISBN(book.isbn)) {
            alert("Invalid ISBN format. Please enter a valid 10 or 13 digit ISBN with correct checksum.");
            return;
        }

        addBook(book).then((response) => {
            toast.success("Book added successfully");
            setBook({
                title: "",
                author: "",
                genre: "",
                publication_date: "",
                isbn: ""
            });
            onAdd();

        }).catch((error) => {
            console.log(error);
            alert("Failed to add book. " + error.response.data.error);
        });
    }


    return <div>
        <form
            onSubmit={handleSubmit}
        >

            {/* Title */}
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                    Title
                </label>
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="title"
                    type="text"
                    placeholder="Enter title"
                    required
                    onChange={(e) => setBook({ ...book, title: e.target.value })}
                    value={book.title}
                />
            </div>

            {/* Author */}
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="author">
                    Author
                </label>
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="author"
                    type="text"
                    placeholder="Enter author"
                    required
                    onChange={(e) => setBook({ ...book, author: e.target.value })}
                    value={book.author}
                />
            </div>

            {/* Genre */}
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="genre">
                    Genre
                </label>

                <GenreSelect selectedGenre={book.genre} onGenreChange={(genre) => setBook({ ...book, genre })} />

            </div>

            {/* Publication date */}
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="publication_date">
                    Publication Date
                </label>
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="publication_date"
                    type="date"
                    required
                    onChange={(e) => setBook({ ...book, publication_date: e.target.value })}
                    value={book.publication_date}
                />
            </div>

            {/* ISBN */}
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="isbn">
                    ISBN (10 or 13 digits)
                </label>
                <p className="text-gray-500 text-xs mb-2">E.g. 978-0-306-40615-7, 0-061-96436-0, 9788175257665</p>
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="isbn"
                    type="text"
                    placeholder="Enter ISBN"
                    required
                    onChange={(e) => setBook({ ...book, isbn: e.target.value })}
                    value={book.isbn}
                />
            </div>



            <button
                className="shadow bg-lightblue hover:bg-sky-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
                type="submit"
            >
                Add Book
            </button>

        </form>
    </div>

}

export default AddBook;