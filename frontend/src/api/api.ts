
import axios from 'axios';
import { IBook } from '../types/Book';

// Base URL for the API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';


// Get all books or filter books
export const getBooks = async (
    searchTerm: string,
    searchField: string,
    genre: string,
    publishedDate: string
): Promise<IBook[]> => {
    const response = await axios.get(
        `${API_URL}/books?searchTerm=${searchTerm}&searchField=${searchField}&genre=${genre}&publishedDate=${publishedDate}`

    );
    return response.data;
};

// Add new book
export const addBook = async (book: IBook): Promise<IBook> => {
    const response = await axios.post(`${API_URL}/books`, book);
    return response.data;
};