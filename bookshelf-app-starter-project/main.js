// Retrieve books from localStorage or initialize an empty array
let books = JSON.parse(localStorage.getItem('books')) || [];

// Variable to hold the currently editing book ID
let editingBookId = null;

// Function to save books to localStorage
function saveBooks() {
    localStorage.setItem('books', JSON.stringify(books));
}

// Function to add a new book
function addBook(title, author, year, isComplete) {
    const book = {
        id: Date.now(), // Unique ID based on timestamp
        title,
        author,
        year,
        isComplete,
    };
    books.push(book);
    saveBooks();
    renderBooks();
}

// Function to render books
function renderBooks(filter = '') {
    const incompleteBookList = document.getElementById('incompleteBookList');
    const completeBookList = document.getElementById('completeBookList');

    // Clear existing lists
    incompleteBookList.innerHTML = '';
    completeBookList.innerHTML = '';

    books.forEach(book => {
        // Filter books by title
        if (book.title.toLowerCase().includes(filter.toLowerCase())) {
            const bookItem = document.createElement('div');
            bookItem.setAttribute('data-bookid', book.id);
            bookItem.setAttribute('data-testid', 'bookItem');
            bookItem.className = 'border border-gray-300 p-4 rounded-md shadow-sm';

            bookItem.innerHTML = `
                <h3 data-testid="bookItemTitle" class="text-lg font-bold">${book.title}</h3>
                <p data-testid="bookItemAuthor" class="text-gray-600">Penulis: ${book.author}</p>
                <p data-testid="bookItemYear" class="text-gray-600">Tahun: ${book.year}</p>
                <div class="mt-2 space-x-2">
                    <button data-testid="bookItemIsCompleteButton" onclick="toggleComplete(${book.id})" class="text-blue-600">${book.isComplete ? 'Belum Selesai' : 'Selesai dibaca'}</button>
                    <button data-testid="bookItemDeleteButton" onclick="deleteBook(${book.id})" class="text-red-600">Hapus Buku</button>
                    <button data-testid="bookItemEditButton" onclick="startEdit(${book.id})" class="text-yellow-600">Edit Buku</button>
                </div>
            `;

            if (book.isComplete) {
                completeBookList.appendChild(bookItem);
            } else {
                incompleteBookList.appendChild(bookItem);
            }
        }
    });
}

// Toggle book completion status
function toggleComplete(id) {
    const book = books.find(b => b.id === id);
    if (book) {
        book.isComplete = !book.isComplete;
        saveBooks();
        renderBooks();
    }
}

// Delete a book
function deleteBook(id) {
    books = books.filter(book => book.id !== id);
    saveBooks();
    renderBooks();
}

// Start editing a book
function startEdit(id) {
    const book = books.find(b => b.id === id);
    if (book) {
        editingBookId = id;
        document.getElementById('bookFormTitle').value = book.title;
        document.getElementById('bookFormAuthor').value = book.author;
        document.getElementById('bookFormYear').value = book.year;
        document.getElementById('bookFormIsComplete').checked = book.isComplete;
        document.getElementById('bookFormSubmit').textContent = 'Perbarui Buku'; // Change button text
    }
}

// Update book details
function updateBook(title, author, year, isComplete) {
    const bookIndex = books.findIndex(b => b.id === editingBookId);
    if (bookIndex !== -1) {
        books[bookIndex] = {
            id: editingBookId,
            title,
            author,
            year,
            isComplete
        };
        saveBooks();
        renderBooks();
        editingBookId = null; // Reset editingBookId
        document.getElementById('bookFormSubmit').textContent = 'Masukkan Buku ke rak <span>Belum selesai dibaca</span>'; // Reset button text
    }
}

// Handle the add/update book form submission
document.getElementById('bookForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const title = document.getElementById('bookFormTitle').value;
    const author = document.getElementById('bookFormAuthor').value;
    const year = parseInt(document.getElementById('bookFormYear').value);
    const isComplete = document.getElementById('bookFormIsComplete').checked;

    if (editingBookId) {
        updateBook(title, author, year, isComplete);
    } else {
        addBook(title, author, year, isComplete);
    }

    event.target.reset(); // Reset the form
});

// Handle search functionality
document.getElementById('searchBook').addEventListener('submit', function(event) {
    event.preventDefault();
    const searchTitle = document.getElementById('searchBookTitle').value;
    renderBooks(searchTitle); // Filter books by title
});

// Initial render
renderBooks();
