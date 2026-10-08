import logo from './logo.svg';
import './App.css';

import { useState,useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
Navigate
} from "react-router-dom";

// ==================== REUSABLE MESSAGE COMPONENT ====================

function Message({ message }) {

  if (!message) {
    return null;
  }

  return (
    <p
      style={{
        backgroundColor: "#e8f5e9",
        color: "#2e7d32",
        padding: "10px",
        borderRadius: "5px",
        fontWeight: "bold"
      }}
    >
      {message}
    </p>
  );
}



// ==================== LOGIN ====================

function Login({ onLogin }) {
  const navigate = useNavigate();

  const [membershipId, setMembershipId] = useState("");
  const [message, setMessage] = useState("");

  function handleLogin() {

    // Starting users
    const startingUsers = [
      {
        id: 1,
        name: "Admin",
        membershipId: "Ao5s",
        role: "Admin"
      },
      {
        id: 2,
        name: "Sebolelo Tsheetshe",
        membershipId: "Ao5",
        role: "Librarian"
      },
      {
        id: 3,
        name: "Member ",
        membershipId: "A16s",
        role: "Member"
      }
    ];

    // Get users from local storage
    const savedUsers = localStorage.getItem("libraryUsers");

    // If users are already saved, use them.
    // Otherwise use the starting users.
    const users = savedUsers
      ? JSON.parse(savedUsers)
      : startingUsers;

    // Save starting users if local storage was empty
    if (!savedUsers) {
      localStorage.setItem(
        "libraryUsers",
        JSON.stringify(startingUsers)
      );
    }

    // Find the user using Membership ID
    const user = users.find(
      (user) => user.membershipId === membershipId.trim()
    );

    // User found
    if (user) {

      localStorage.setItem(
        "loggedInUser",
        JSON.stringify(user)
      );

      // Tell App who logged in
      onLogin(user);

      setMessage(
        "Welcome " + user.name + "!"
      );

      navigate("/dashboard");

    } else {

      setMessage(
        "Access denied. User is not authorized."
      );
    }
  }

  return (
    <div>
      <marquee>
  <h1>Welcome to the Community Library Management System</h1>
</marquee>
      <h2>Library Login</h2>

      <p>
        Enter your membership ID to access the system.
      </p>

      <input
        type="text"
        placeholder="Membership ID"
        value={membershipId}
        onChange={(event) =>
          setMembershipId(event.target.value)
        }
      />

      <br />
      <br />

      <button onClick={handleLogin}>
        Login
      </button>

      {message && (
        <p
          style={{
            backgroundColor: "#e8f5e9",
            color: "#2e7d32",
            padding: "10px",
            borderRadius: "5px",
            fontWeight: "bold"
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}


// ==================== DASHBOARD ====================

function Dashboard({ user }) {
  // Get the books saved in local storage
  const savedBooks = localStorage.getItem("libraryBooks");

  // Convert the saved information back into books
  const books = savedBooks ? JSON.parse(savedBooks) : [];

  const navigate = useNavigate();

 
  return (
    <div>

      <marquee>
        <h1>Welcome to the Community Library Management System</h1>
      </marquee>

      <h2>Library Dashboard</h2>

      {user && user.role === "Member" && (
        <div>
          <h3>My Library Activity</h3>

          <p>
            Welcome, {user.name}
          </p>

          <p>
            You can borrow and return books from the Transactions page.
          </p>

          <button onClick={() => navigate("/transactions")}>
            Go to Transactions
          </button>
        </div>
      )}

      <h3>Current Book Availability</h3>

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Genre</th>
            <th>ISBN</th>
            <th>Available Copies</th>
          </tr>
        </thead>

        <tbody>
          {books.map((book) => (
            <tr
              key={book.id}
              style={{
                backgroundColor:
                  book.quantity < 2 ? "#ffcccc" : "white"
              }}
            >
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.genre}</td>
              <td>{book.isbn}</td>
              <td>{book.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p>
        Books with less than 2 copies are highlighted as low stock.
      </p>

    </div>
  );
}
// ==================== BOOKS ====================
 
// ==================== BOOKS ====================

function Books() {
  // Starting books
  const startingBooks = [
    {
      id: 1,
      title: "Things Fall Apart",
      author: "Chinua Achebe",
      genre: "Fiction",
      isbn: "9780380015035",
      quantity: 5
    },
    {
      id: 2,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      genre: "Classic",
      isbn: "9780743273565",
      quantity: 1
    }
  ];

  // Get books from local storage
  const [books, setBooks] = useState(() => {
    const savedBooks = localStorage.getItem("libraryBooks");

    if (savedBooks) {
      return JSON.parse(savedBooks);
    }

    return startingBooks;
  });

  // Form information
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [isbn, setIsbn] = useState("");
  const [quantity, setQuantity] = useState("");

  // Used when updating a book
  const [editingId, setEditingId] = useState(null);

  // Message shown after an action
  const [message, setMessage] = useState("");

  // Save books whenever they change
  useEffect(() => {
    localStorage.setItem(
      "libraryBooks",
      JSON.stringify(books)
    );
  }, [books]);

  // Add or update a book
 function saveBook() {

  // Check for empty fields
  if (
    title.trim() === "" ||
    author.trim() === "" ||
    genre.trim() === "" ||
    isbn.trim() === "" ||
    quantity === ""
  ) {
    setMessage("Please fill in all the fields.");
    return;
  }

  // Quantity must be a valid number
  if (isNaN(Number(quantity))) {
    setMessage("Quantity must be a number.");
    return;
  }

  // Quantity cannot be negative
  if (Number(quantity) < 0) {
    setMessage("Quantity cannot be negative.");
    return;
  }

  // Check for duplicate ISBN
  const duplicateISBN = books.some(
    (book) =>
      book.isbn === isbn.trim() &&
      book.id !== editingId
  );

  if (duplicateISBN) {
    setMessage("A book with this ISBN already exists.");
    return;
  }

    // Updating an existing book
    if (editingId !== null) {
      const updatedBooks = books.map((book) => {
        if (book.id === editingId) {
          return {
            ...book,
            title: title,
            author: author,
            genre: genre,
            isbn: isbn,
            quantity: Number(quantity)
          };
        }

        return book;
      });

      setBooks(updatedBooks);
      setEditingId(null);

      setMessage("Book updated successfully!");
    }

    // Adding a new book
    else {
      const newBook = {
        id: Date.now(),
        title: title,
        author: author,
        genre: genre,
        isbn: isbn,
        quantity: Number(quantity)
      };

      setBooks([...books, newBook]);

      setMessage("Book added successfully!");
    }

    // Clear the form
    setTitle("");
    setAuthor("");
    setGenre("");
    setIsbn("");
    setQuantity("");
  }

  // Put book information into the form
  function editBook(book) {
    setTitle(book.title);
    setAuthor(book.author);
    setGenre(book.genre);
    setIsbn(book.isbn);
    setQuantity(book.quantity);

    setEditingId(book.id);

    setMessage("You are editing this book.");
  }

  // Delete a book
  function deleteBook(id) {
    const remainingBooks = books.filter(
      (book) => book.id !== id
    );

    setBooks(remainingBooks);

    setMessage("Book deleted successfully!");
  }

  return (
    <div>
      <h2>Book Management</h2>

      {/* Message */}
      {message && (
        <p
          style={{
            backgroundColor: "#e8f5e9",
            color: "#2e7d32",
            padding: "10px",
            borderRadius: "5px",
            fontWeight: "bold"
          }}
        >
          {message}
        </p>
      )}

      {/* Book form */}
      <input
        type="text"
        placeholder="Book title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <br />
      <br />

      <input
        type="text"
        placeholder="Author"
        value={author}
        onChange={(event) => setAuthor(event.target.value)}
      />
      <br />
      <br />

      <input
        type="text"
        placeholder="Genre"
        value={genre}
        onChange={(event) => setGenre(event.target.value)}
      />
      <br />
      <br />

      <input
        type="text"
        placeholder="ISBN"
        value={isbn}
        onChange={(event) => setIsbn(event.target.value)}
      />
      <br />
      <br />

      <input
        type="number"
        placeholder="Initial quantity"
        value={quantity}
        onChange={(event) => setQuantity(event.target.value)}
      />
      <br />
      <br />

      <button onClick={saveBook}>
        {editingId !== null ? "Update Book" : "Add Book"}
      </button>

      <h3>Books</h3>

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Genre</th>
            <th>ISBN</th>
            <th>Quantity</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.genre}</td>
              <td>{book.isbn}</td>
              <td>{book.quantity}</td>

              <td>
                <button onClick={() => editBook(book)}>
                  Update
                </button>

                <button onClick={() => deleteBook(book.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ==================== TRANSACTIONS ====================
function Transactions({ user }) {
  // Get books from local storage
  const savedBooks = localStorage.getItem("libraryBooks");
  const startingBooks = savedBooks ? JSON.parse(savedBooks) : [];

  const [books, setBooks] = useState(startingBooks);

  // Information for the transaction
  const [selectedBook, setSelectedBook] = useState("");
  const [action, setAction] = useState("borrow");
  const [amount, setAmount] = useState(1);

  // Message shown after an action
  const [message, setMessage] = useState("");

  // Transaction history
  const [transactions, setTransactions] = useState(() => {
    const savedTransactions =
      localStorage.getItem("transactions");

    if (savedTransactions) {
      return JSON.parse(savedTransactions);
    }

    return [];
  });

  // Save books whenever they change
  useEffect(() => {
    localStorage.setItem(
      "libraryBooks",
      JSON.stringify(books)
    );
  }, [books]);

  // Save transaction history
  useEffect(() => {
    localStorage.setItem(
      "transactions",
      JSON.stringify(transactions)
    );
  }, [transactions]);

  // Perform the transaction
  function performTransaction() {
    if (selectedBook === "") {
      setMessage("Please select a book.");
      return;
    }

    if (amount < 1) {
      setMessage("Amount must be at least 1.");
      return;
    }

    const book = books.find(
      (book) => book.id === Number(selectedBook)
    );
    // Only Admin can add stock
if (action === "add" && user.role !== "Admin") {
  setMessage("Only the Admin can add stock.");
  return;
}
    if (!book) {
      setMessage("Book not found.");
      return;
    }

    // Borrow a book
    if (action === "borrow") {
      if (book.quantity < Number(amount)) {
        setMessage("Not enough copies available.");
        return;
      }

      const updatedBooks = books.map((book) => {
        if (book.id === Number(selectedBook)) {
          return {
            ...book,
            quantity: book.quantity - Number(amount)
          };
        }

        return book;
      });

      setBooks(updatedBooks);

      const newTransaction = {
  id: Date.now(),
  bookTitle: book.title,
  action: "Borrowed",
  amount: Number(amount),
  memberName: user.name,
  memberId: user.membershipId,
  date: new Date().toLocaleString()
};

      setTransactions([
        ...transactions,
        newTransaction
      ]);

      setMessage("Book borrowed successfully!");
    }

    // Return a book
if (action === "return") {

  // Check whether this member has borrowed this book
  const borrowedAmount = transactions
    .filter(
      (transaction) =>
        transaction.memberId === user.membershipId &&
        transaction.bookTitle === book.title &&
        transaction.action === "Borrowed"
    )
    .reduce(
      (total, transaction) => total + transaction.amount,
      0
    );

  const returnedAmount = transactions
    .filter(
      (transaction) =>
        transaction.memberId === user.membershipId &&
        transaction.bookTitle === book.title &&
        transaction.action === "Returned"
    )
    .reduce(
      (total, transaction) => total + transaction.amount,
      0
    );

  const currentlyBorrowed = borrowedAmount - returnedAmount;

  // Do not allow a member to return a book they did not borrow
  if (user.role === "Member" && currentlyBorrowed < Number(amount)) {
    setMessage("You cannot return more copies than you borrowed.");
    return;
  }

  const updatedBooks = books.map((book) =>
    book.id === Number(selectedBook)
      ? {
          ...book,
          quantity: book.quantity + Number(amount)
        }
      : book
  );

  setBooks(updatedBooks);

  const newTransaction = {
    id: Date.now(),
    bookTitle: book.title,
    action: "Returned",
    amount: Number(amount),
    memberName: user.name,
    memberId: user.membershipId,
    date: new Date().toLocaleString()
  };

  setTransactions([...transactions, newTransaction]);

  setMessage("Book returned successfully!");
}

    // Clear the amount
    setAmount(1);
  }

  return (
    <div>
      <h2>Transactions</h2>

      {/* Message */}
      {message && (
        <p
          style={{
            backgroundColor: "#e8f5e9",
            color: "#2e7d32",
            padding: "10px",
            borderRadius: "5px",
            fontWeight: "bold"
          }}
        >
          {message}
        </p>
      )}

      <h3>Book Transaction</h3>

      {/* Select a book */}
      <select
        value={selectedBook}
        onChange={(event) =>
          setSelectedBook(event.target.value)
        }
      >
        <option value="">Select a book</option>

        {books.map((book) => (
          <option key={book.id} value={book.id}>
            {book.title}
          </option>
        ))}
      </select>

      <br />
      <br />

      {/* Choose an action */}
   <select value={action} onChange={(e) => setAction(e.target.value)}>
  <option value="borrow">Borrow Book</option>

  <option value="return">Return Book</option>

  {/* Only Admin can add stock */}
  {user && user.role === "Admin" && (
    <option value="add">Add Stock</option>
  )}
</select>

      <br />
      <br />

      {/* Amount */}
      <input
        type="number"
        min="1"
        value={amount}
        onChange={(event) =>
          setAmount(Number(event.target.value))
        }
      />

      <br />
      <br />

      <button onClick={performTransaction}>
        Complete Transaction
      </button>

      <h3>Transaction History</h3>

      <h3>Transaction History</h3>

<table>
  <thead>
    <tr>
      <th>Book</th>
      <th>Action</th>
      <th>Amount</th>
      <th>Member</th>
      <th>Date</th>
    </tr>
  </thead>

  <tbody>
    {transactions
      .filter((transaction) => {
        // Admin and Librarian can see all transactions
        if (user.role === "Admin" || user.role === "Librarian") {
          return true;
        }

        // Members can only see their own transactions
        return transaction.memberId === user.membershipId;
      })
      .map((transaction) => (
        <tr key={transaction.id}>
          <td>{transaction.bookTitle}</td>
          <td>{transaction.action}</td>
          <td>{transaction.amount}</td>
          <td>{transaction.memberName}</td>
          <td>{transaction.date}</td>
        </tr>
      ))}
  </tbody>
</table>
    </div>
  );
}

// ==================== USERS ====================

function Users() {
  // Starting users
  const startingUsers = [
    {
      id: 1,
      name: "Admin",
      membershipId: "A05s",
      role: "Admin"
    },
    {
      id: 2,
      name: "Sebolelo Tsheetshe",
      membershipId: "Ao5",
      role: "Librarian"
    }
  ];

  // Get users from local storage
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem("libraryUsers");

    if (savedUsers) {
      return JSON.parse(savedUsers);
    }

    return startingUsers;
  });

  // Form information
  const [name, setName] = useState("");
  const [membershipId, setMembershipId] = useState("");
  const [role, setRole] = useState("Librarian");

  // Used when updating a user
  const [editingId, setEditingId] = useState(null);

  // Message
  const [message, setMessage] = useState("");

  // Save users to local storage
  useEffect(() => {
    localStorage.setItem(
      "libraryUsers",
      JSON.stringify(users)
    );
  }, [users]);

  // Add or update a user
  function saveUser() {
    if (
      name === "" ||
      membershipId === "" ||
      role === ""
    ) {
      setMessage("Please fill in all the fields.");
      return;
    }

    // Update existing user
    if (editingId !== null) {
      const updatedUsers = users.map((user) => {
        if (user.id === editingId) {
          return {
            ...user,
            name: name,
            membershipId: membershipId,
            role: role
          };
        }

        return user;
      });

      setUsers(updatedUsers);
      setEditingId(null);

      setMessage("User updated successfully!");
    }

    // Add new user
    else {
      const newUser = {
        id: Date.now(),
        name: name,
        membershipId: membershipId,
        role: role
      };

      setUsers([...users, newUser]);

      setMessage("User added successfully!");
    }

    // Clear form
    setName("");
    setMembershipId("");
    setRole("Librarian");
  }

  // Edit a user
  function editUser(user) {
    setName(user.name);
    setMembershipId(user.membershipId);
    setRole(user.role);

    setEditingId(user.id);

    setMessage("You are editing this user.");
  }

  // Delete a user
  function deleteUser(id) {
    const remainingUsers = users.filter(
      (user) => user.id !== id
    );

    setUsers(remainingUsers);

    setMessage("User deleted successfully!");
  }

  return (
    <div>
      <h2>User Management</h2>

      {/* Message */}
      {message && (
        <p
          style={{
            backgroundColor: "#e8f5e9",
            color: "#2e7d32",
            padding: "10px",
            borderRadius: "5px",
            fontWeight: "bold"
          }}
        >
          {message}
        </p>
      )}

      {/* User form */}
      <h3>
        {editingId !== null
          ? "Update User"
          : "Add New User"}
      </h3>

      <input
        type="text"
        placeholder="User name"
        value={name}
        onChange={(event) =>
          setName(event.target.value)
        }
      />

      <br />
      <br />

      <input
        type="text"
        placeholder="Membership ID"
        value={membershipId}
        onChange={(event) =>
          setMembershipId(event.target.value)
        }
      />

      <br />
      <br />

      <select
        value={role}
        onChange={(event) =>
          setRole(event.target.value)
        }
      >
        <option value="Librarian">Librarian</option>
        <option value="Admin">Admin</option>
        <option value="Member">Member</option>
      </select>

      <br />
      <br />

      <button onClick={saveUser}>
        {editingId !== null
          ? "Update User"
          : "Add User"}
      </button>

      <h3>Registered Users</h3>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Membership ID</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.membershipId}</td>
              <td>{user.role}</td>

              <td>
                <button onClick={() => editUser(user)}>
                  Update
                </button>

                <button
                  onClick={() => deleteUser(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


// ==================== MAIN APP ====================
function App() { 
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("loggedInUser");

    if (savedUser) {
      return JSON.parse(savedUser);
    }

    return null;
  });
  // Login
  function handleLogin(user) {
    setCurrentUser(user);
  }

  // Logout
  function handleLogout() {
  localStorage.removeItem("loggedInUser");
  setCurrentUser(null);
}

  return (
    <BrowserRouter>

      {/* If nobody is logged in, show Login */}
      {!currentUser ? (

        <Login onLogin={handleLogin} />

      ) : (

        <div className="app">

          {/* ================= NAVIGATION ================= */}
          <nav>

            {/* Show name and role of logged-in user */}
            <span className="logged-in-user">
              {currentUser.name} ({currentUser.role})
            </span>

            {/* Dashboard - everyone can see */}
 {/* Dashboard - everyone can see */}
<Link to="/dashboard">
  Dashboard
</Link>


{/* Books - ADMIN AND LIBRARIAN */}
{(currentUser.role === "Admin" ||
  currentUser.role === "Librarian") && (
    <Link to="/books">
      Books
    </Link>
)}


{/* Transactions - EVERYONE */}
{(currentUser.role === "Admin" ||
  currentUser.role === "Librarian" ||
  currentUser.role === "Member") && (
    <Link to="/transactions">
      Transactions
    </Link>
)}

            {/* Users - ADMIN ONLY */}
            {currentUser.role === "Admin" && (
              <Link to="/users">
                Users
              </Link>
            )}

            {/* Logout */}
            <button onClick={handleLogout}>
              Logout
            </button>

          </nav>


          {/* ================= PAGES ================= */}
          <Routes>

            {/* Dashboard - everyone */}
            <Route
              path="/dashboard"
              element={
                <Dashboard user={currentUser} />
              }
            />


            {/* Books - ADMIN ONLY */}
            <Route
              path="/books"
              element={
                currentUser.role === "Admin" || currentUser.role === "Librarian"
                  ? <Books user={currentUser} />
                  : <Navigate to="/dashboard" />
              }
            />


            {/* Transactions - ADMIN AND LIBRARIAN */}
           <Route
  path="/transactions"
  element={
    currentUser.role === "Admin" ||
    currentUser.role === "Librarian" ||
    currentUser.role === "Member" ? (
      <Transactions user={currentUser} />
    ) : (
      <Navigate to="/dashboard" />
    )
  }
/>


            {/* Users - ADMIN ONLY */}
            <Route
              path="/users"
              element={
                currentUser.role === "Admin"
                  ? <Users user={currentUser} />
                  : <Navigate to="/dashboard" />
              }
            />


            {/* If an unknown page is entered, go to Dashboard */}
            <Route
              path="*"
              element={
                <Navigate to="/dashboard" />
              }
            />

          </Routes>

        </div>
      )}

    </BrowserRouter>
  );
}

export default App;