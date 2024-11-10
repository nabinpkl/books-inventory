

# Books Inventory Management System
Built with React, Express and Postgres SQL. It allow users to add new books, filter existing books based on various criteria, and export the book data.

## Requirements
- postgres > 12.x
- node > 18.x.x


## Structure
- **backend** - contains backend system using express for database interface
  - **src/db.js** - contains databse setup and connection checks
  - **src/server.js** - contains the main backend file for setting up APIS and starting the server
  - **src/routes.js** - contains routes for adding new books and getting all books with filters
- **frontend**- contains frontend code using react
  - **src/api** - Contains api interface for getting/adding books
  - **src/components** - Contains UI components used within the app such as AddBook, BookList etc.
  - **src/types** - Contains type definition for Book data
  - **src/utils** - Contains helper function for validation of 10/13 digit isbn format
  - **src/App.tsx** - Parent component of the application for maintaining application state and grouping UI components

## Environments

### Environments for backend
```
POSTGRES_USER= <Username for postgres, e.g. postgres>
POSTGRES_PASSWORD= <Password for postgres e.g. postgres>
POSTGRES_DATABASE= <Database name for postgres e.g. books_inventory>
POSTGRES_HOST= <Database host for postgres e.g. localhost>
POSTGRES_PORT= <Database port for postgres e.g. 5432>

PORT = <Port to run the backend server on>
```
### Envrionments for frontend
```
REACT_APP_API_URL = <URL of the backend server e.g. http://localhost:8000/api>
```

Environments can be defined using a .env file by copying .env.example and renaming it to .env with the required environment variables.

## How to run?
1. Create a database named books_inventory or connect to an existing database by specifying the database name in backend/.env file
2. Create inventory table using SQL query defined in books.sql to your database
3. Prepare .env file for backend with the help of the Environments section above to connect to your database with your credentials
4. Navigate to the backend folder
```bash
cd backend
```
5. Install required npm dependencies
```bash
npm install
```
6. Start the server by running
```bash
npm start
```
The server will be running on [localhost:8000](http://localhost:8000) by default or localhost:<Your defined server port in .env file>

7. Open new terminal in root directory and navigate to frontend folder
```bash
cd frontend
```
8. Prepare .env file for frontend with the help of Environments for frontend section above for setting up API URL

9. Install required frontend npm dependencies
```bash
npm install
```
10. Start the react frontend by running
```bash
npm start
```
The browser will open with react app running on [localhost:3000](http://localhost:3000) by default.

## Design decisions and challenges faced

1. **Pagination is not implemented**

- Due to the relatively small data size and to reduce the development complexity, pagination has been excluded from the design as performance issues are not yet critical. However, it could limit the scalability of larger datasets. When the application grows in size, pagination will be necessary and must be implemented in the next iteration.

2. **The uniqueness of ISBN is enforced with a unique constraint.**

- The challenge was that ISBN is typically written as hyphens to distinguish books' metadata. If we enforced uniqueness in the column directly when creating a table, hyphened and non-hyphenated versions would be counted as two distinct isbn, which is not quite right. So, to overcome this challenge, `CREATE UNIQUE INDEX` was used to enforce the uniqueness, which checks uniqueness by removing hyphens.

3. **Handling gaps in entry_id due to autoincrement on error**

  - PostgreSQL autoincrement for entry_id can skip values when a unique constraint is violated. Each failed insert due to a uniqueness violation (e.g., duplicate ISBN) causes the autoincrement value to increase, leaving gaps in entry_id. 
 
    Initially, `ON CONFLICT DO NOTHING` was used to solve this issue. It solved the gap problem. But when inserting duplicate isbn, it didn't generate errors, resulting in silent failures with no feedback.

    Alternatively, on a unique key constraint violation error, the sequence was manually restarted back in line with actual data and was used to handle the gap issue. Although it requires additional overhead and maintenance, it is quite a clean solution for this use case. For future improvement, better methods should be researched to handle the gap in case of unique constraint errors.


4. **React state management is handled by the parent component**
 - State management like books data from API and current filter state are handled by parent component `App.tsx`, avoiding libraries like Redux or React context. For this application, simple state management is suitable for small-to-medium applications, reducing the complexity of implementing and maintaining global state while still allowing child components to receive necessary state through props.


