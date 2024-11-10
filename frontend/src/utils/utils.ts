


function validateISBN(isbn:string) {
    // Remove any hyphens or spaces
    isbn = isbn.replace(/[-\s]/g, "");

    if (isbn.length === 10) {
        return validateISBN10(isbn);
    }
    else if (isbn.length === 13) {
        return validateISBN13(isbn);
    } 
    else {
        return false;
    }
}

function validateISBN10(isbn10:string) {
    // Check if first 9 characters are digits and last character is a digit or "X"
    if (!/^\d{9}(\d|X)$/i.test(isbn10)) {
        return false;
    }
    
    // Calculate checksum for ISBN-10
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += (i + 1) * parseInt(isbn10[i]);
    }
    // Check last character
    let checkDigit = isbn10[9] === 'X' ? 10 : parseInt(isbn10[9]);
    sum += 10 * checkDigit;

    return sum % 11 === 0;
}

function validateISBN13(isbn13:string) {
    // Check if all characters are digits
    if (!/^\d{13}$/.test(isbn13)) {
        return false;
    }
    
    // Calculate checksum for ISBN-13
    let sum = 0;
    for (let i = 0; i < 12; i++) {
        let digit = parseInt(isbn13[i]);
        sum += (i % 2 === 0) ? digit : digit * 3;
    }
    let checkDigit = (10 - (sum % 10)) % 10;

    return checkDigit === parseInt(isbn13[12]);
}

export { validateISBN };