import { IBook } from "../types/Book";


type BookListProps = {
  isLoading: boolean;
  books: IBook[];
};

function BookList({ isLoading, books }: BookListProps
) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              #
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              ISBN
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Author
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Genre
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Publication Date
            </th>
          </tr>
        </thead>
        <tbody>

          {/* Empty content */}
          {
            !isLoading && books.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-700">No books found</td>
              </tr>
            )
          }

          {
            isLoading ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-700">

                  <div className="animate-spin inline-block size-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500" role="status" aria-label="loading">
                    <span className="sr-only">Loading...</span>
                  </div>

                </td>
              </tr>
            ) :
              books.map((book) => (
                <tr key={book.isbn} className="even:bg-gray-100 hover:bg-gray-100">
                  <td className="px-6 py-4 whitespace-nowrap border-b text-gray-700">{book.entry_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap border-b text-gray-700">{book.isbn}</td>
                  <td className="px-6 py-4 border-b text-gray-700">{book.title}</td>
                  <td className="px-6 py-4 border-b text-gray-700">{book.author}</td>
                  <td className="px-6 py-4 whitespace-nowrap border-b text-gray-700">{book.genre}</td>
                  <td className="px-6 py-4 whitespace-nowrap border-b text-gray-700">{new Date(book.publication_date).toISOString().split('T')[0]}</td>
                </tr>
              ))
          }
        </tbody>
      </table>
    </div>

  )
}

export default BookList;