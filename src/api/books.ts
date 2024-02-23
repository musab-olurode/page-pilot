import axios from 'axios';
import Config from 'react-native-config';
import {ZLibraryBook, ZLibraryBookResult} from '../types/books';

export const GOODREADS_BASE_URL = Config.GOODREADS_BASE_URL;
export const Z_LIBRARY_BASE_URL = Config.Z_LIBRARY_DEFAULT_BASE_URL;

export const getMostPopularBooks = async () => {
  const response = await axios.get(
    `${Z_LIBRARY_BASE_URL}/eapi/book/most-popular`,
  );
  const books = response.data.books as ZLibraryBookResult[];

  books.forEach(book => {
    if (book.cover.startsWith('/')) {
      book.cover = `${Z_LIBRARY_BASE_URL}${book.cover}`;
    }
  });

  return books;
};

export const searchForBook = async (query: string) => {
  const response = await axios.post(
    `${Z_LIBRARY_BASE_URL}/eapi/book/search`,
    {
      message: query,
    },
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  );
  const books = response.data.books as ZLibraryBook[];

  books.forEach(book => {
    if (book.cover.startsWith('/')) {
      book.cover = `${Z_LIBRARY_BASE_URL}${book.cover}`;
    }
  });

  return books;
};
