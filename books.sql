

-- books.sql

-- Create a new table named "books" if it does not exist
CREATE TABLE IF NOT EXISTS Inventory (
    entry_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,                   
    title VARCHAR(255) NOT NULL,                   
    author VARCHAR(255) NOT NULL,                  
    genre VARCHAR(100),                           
    publication_date DATE,                         
    isbn VARCHAR(20) UNIQUE -- Store ISBN with or without hyphens up to 20 characters                        
);


-- Maintain a unique index on the ISBN column
-- Normalize the ISBN by removing all hyphens
CREATE UNIQUE INDEX unique_isbn_normalized
ON Inventory ( 
        regexp_replace(isbn, '[^0-9X]', '', 'g')
);