// Book class to represent each book
class Book {
    constructor(id, bookName, authorName) {
        this.id = id;
        this.bookName = bookName;
        this.authorName = authorName;
    }
}

// Array to store all books
let books = [];

// DOM elements
const bookNameInput = document.getElementById('bookName');
const authorNameInput = document.getElementById('authorName');
const addBookBtn = document.getElementById('addBookBtn');
const bookTableBody = document.getElementById('bookTableBody');
const totalBooksSpan = document.getElementById('totalBooks');
const clearAllBtn = document.getElementById('clearAllBtn');

// Load data from localStorage when page loads
function loadFromLocalStorage() {
    const storedBooks = localStorage.getItem('books');
    if (storedBooks) {
        books = JSON.parse(storedBooks);
        renderTable();
    }
}

// Save data to localStorage
function saveToLocalStorage() {
    localStorage.setItem('books', JSON.stringify(books));
}

// Update total books count
function updateTotalBooks() {
    totalBooksSpan.textContent = books.length;
}

// Function 1: Create new table row dynamically using createElement
function createTableRow(book, index) {
    // Create table row element (tr)
    const tr = document.createElement('tr');
    tr.setAttribute('data-id', book.id);
    tr.style.animation = 'slideIn 0.3s ease';

    // Create serial number cell (td)
    const tdSerial = document.createElement('td');
    tdSerial.textContent = index + 1;

    // Create book name cell (td)
    const tdBookName = document.createElement('td');
    tdBookName.textContent = book.bookName;

    // Create author name cell (td)
    const tdAuthorName = document.createElement('td');
    tdAuthorName.textContent = book.authorName;

    // Create action cell (td) with delete button
    const tdAction = document.createElement('td');
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'মুছুন';
    deleteBtn.className = 'delete-btn';

    // Add event listener to delete button (Task 2: Event Listener)
    deleteBtn.addEventListener('click', function (event) {
        event.stopPropagation(); // Stop event bubbling if needed
        deleteBook(book.id);
    });

    tdAction.appendChild(deleteBtn);

    // Append all cells to the row
    tr.appendChild(tdSerial);
    tr.appendChild(tdBookName);
    tr.appendChild(tdAuthorName);
    tr.appendChild(tdAction);

    return tr;
}

// Function to delete a book (Task 2: Delete functionality)
function deleteBook(bookId) {
    // Show confirmation dialog
    if (confirm('আপনি কি এই বইটি ডিলিট করতে চান?')) {
        // Filter out the book with matching id
        books = books.filter(book => book.id !== bookId);

        // Save to localStorage
        saveToLocalStorage();

        // Re-render the table
        renderTable();

        // Show success message
        showTemporaryMessage('বইটি সফলভাবে মুছে ফেলা হয়েছে', 'success');
    }
}

// Function to delete all books
function deleteAllBooks() {
    if (books.length === 0) {
        alert('কোনো বই নেই যা মুছবেন!');
        return;
    }

    if (confirm('সতর্কতা: সব বই একসাথে মুছে ফেলা হবে। আপনি কি নিশ্চিত?')) {
        books = [];
        saveToLocalStorage();
        renderTable();
        showTemporaryMessage('🗑️ সব বই মুছে ফেলা হয়েছে', 'info');
    }
}

// Function to show temporary message
function showTemporaryMessage(message, type) {
    // Create temporary message element
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${type === 'success' ? '#27ae60' : '#3498db'};
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 600;
                z-index: 1000;
                animation: slideIn 0.3s ease;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            `;

    document.body.appendChild(messageDiv);

    // Remove after 2 seconds
    setTimeout(() => {
        messageDiv.style.opacity = '0';
        messageDiv.style.transition = 'opacity 0.3s';
        setTimeout(() => {
            messageDiv.remove();
        }, 300);
    }, 2000);
}

// Function to render the entire table
function renderTable() {
    // Clear the table body
    bookTableBody.innerHTML = '';

    if (books.length === 0) {
        // Show empty message
        const emptyRow = document.createElement('tr');
        emptyRow.className = 'empty-row';
        const emptyCell = document.createElement('td');
        emptyCell.colSpan = 4;
        emptyCell.textContent = '📭 এখনো কোনো বই যোগ করা হয়নি';
        emptyCell.style.textAlign = 'center';
        emptyCell.style.padding = '40px';
        emptyCell.style.color = '#999';
        emptyCell.style.fontStyle = 'italic';
        emptyRow.appendChild(emptyCell);
        bookTableBody.appendChild(emptyRow);
    } else {
        // Create rows for each book using forEach
        books.forEach((book, index) => {
            const row = createTableRow(book, index);
            bookTableBody.appendChild(row);
        });
    }

    // Update total books count
    updateTotalBooks();
}

// Function to validate inputs
function validateInputs(bookName, authorName) {
    // Check if book name is empty
    if (bookName.trim() === '') {
        alert('সতর্কতা: দয়া করে বইয়ের নাম লিখুন!');
        bookNameInput.focus();
        return false;
    }

    // Check if author name is empty
    if (authorName.trim() === '') {
        alert('সতর্কতা: দয়া করে লেখকের নাম লিখুন!');
        authorNameInput.focus();
        return false;
    }

    // Check if book name has only letters (optional - Bangla and English letters allowed)
    const hasValidChars = /^[\u0980-\u09FFa-zA-Z0-9\s\.\-\_]+$/.test(bookName);
    if (!hasValidChars) {
        alert('⚠️ সতর্কতা: বইয়ের নামে শুধুমাত্র অক্ষর, সংখ্যা এবং স্পেস অনুমোদিত!');
        bookNameInput.focus();
        return false;
    }

    return true;
}

// Function to add new book (Task 1 & 2 combined)
function addBook() {
    // Get input values
    const bookName = bookNameInput.value;
    const authorName = authorNameInput.value;

    // Validate inputs
    if (!validateInputs(bookName, authorName)) {
        return false;
    }

    // Create new book object with unique ID
    const newBook = new Book(
        Date.now(), // Using timestamp as unique ID
        bookName.trim(),
        authorName.trim()
    );

    // Add to books array
    books.push(newBook);

    // Save to localStorage
    saveToLocalStorage();

    // Clear input fields
    bookNameInput.value = '';
    authorNameInput.value = '';

    // Re-render the table
    renderTable();

    // Show success message
    showTemporaryMessage(`"${bookName}" বইটি সফলভাবে যুক্ত হয়েছে`, 'success');

    // Focus on book name input for next entry
    bookNameInput.focus();

    return true;
}

// Add event listener to Add Book button (Task 2)
addBookBtn.addEventListener('click', addBook);

// Add event listener for Enter key
bookNameInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        authorNameInput.focus();
    }
});

authorNameInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        addBook();
    }
});

// Add event listener to Clear All button
clearAllBtn.addEventListener('click', deleteAllBooks);

// Event Delegation example (Alternative approach for delete - Task 2 bonus)
// This demonstrates event bubbling concept
bookTableBody.addEventListener('click', function (event) {
    // Event bubbling - if someone clicks on delete button, it will be handled here too
    // But we already have individual event listeners on each delete button
    // This is just to demonstrate event bubbling concept
    if (event.target.classList.contains('delete-btn')) {
        console.log('Event bubbling: Delete button clicked via delegation');
    }
});

// Load data from localStorage when page loads
loadFromLocalStorage();

// Console logs for verification
console.log('বই সংরক্ষণ অ্যাপ প্রস্তুত!');
console.log('Task 1: document.createElement() ব্যবহার করে ডাইনামিক রো তৈরি করা হচ্ছে');
console.log('Task 2: ইভেন্ট লিসেনার ব্যবহার করে ডিলিট ফাংশনালিটি যোগ করা হয়েছে');
console.log('Task 3: localStorage ব্যবহার করে ডাটা সংরক্ষণ করা হচ্ছে');
console.log(`বর্তমানে ${books.length} টি বই সংরক্ষিত আছে`);