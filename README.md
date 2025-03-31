# Buy-Sell Platform for IIIT Family

This is a Buy-Sell platform designed specifically for the IIIT community. It allows users to register, log in, search and sell items, and perform transactions with other members of the IIIT family. The platform also includes essential features like authentication, user dashboards, and item management.

## Features

###  **Login and Registration**

- **Registration Page**: Users can create an account by filling out required details such as First Name, Last Name, Email, Age, Contact Number, and Password.
- **Login Portal**: Registered users can log in to access their profile and dashboard.
- **Session Persistence**: Once logged in, users do not need to log in again unless they explicitly log out (even after a restart of the website/browser).
- **Logout**: Users can log out at any time.
- **Authentication & Authorization**: 
  - Passwords are hashed using `bcrypt.js` before being stored in the database.
  - All pages are protected, requiring the user to log in first before accessing them. Unauthorized users are redirected to the login page.
  - Backend routes are secured using JWT (JSON Web Token) for token-based authentication.
  

###  **Search Items Page**

- **Search Bar**: Allows buyers to search for items. The search is case-insensitive.
- **Item Filters**: Buyers can filter items by category. Multiple categories can be selected at once.
- **Displaying Items**: If the search bar is empty or no results are found, all items are shown. If a filter is applied, only the relevant items are displayed.
- **Item Page**: Clicking on an item in the search results opens its detailed page.

###  **Item Page**

- Displays detailed information about the item, such as the name, price, and vendor.
- **Add to Cart**: Users can add the item to their shopping cart.

###  **Orders History**

- **Pending Orders**: Shows orders placed by the user that are yet to be processed, along with a randomly generated OTP.
- **Bought Items**: Displays items bought by the user earlier.
- **Sold Items**: Displays items sold by the user earlier.
- **Separate Tabs**: Each of the above sections is displayed in separate tabs for better readability.

### **Deliver Items Page**

- Displays items that need to be delivered to different buyers.
- **OTP for Transaction Closure**: Sellers need the OTP from the buyer to complete the transaction. The transaction is closed when the correct OTP is entered.
- **Order Removal**: After a successful transaction, the item is removed from the Deliver Items page and updates the buyer's Orders History page.

###  **My Cart**

- Displays all the items added to the cart by the user.
- **Remove Items**: Users can remove items from the cart.
- **Total Cost**: The total cost of the items in the cart is displayed.
- **Final Order**: The user can place an order for all the items in the cart. Upon success, the cart is emptied, and the order is reflected in both the buyer's and seller's Order History pages.

## Setup

To run this project locally, follow the instructions below:

### Prerequisites

1. **Node.js** and **npm** installed on your machine.
2. **MongoDB** database running locally or through a cloud service like MongoDB Atlas.

### Backend Setup

1. Clone the repository and navigate to the `backend` folder:
    ```bash
    git clone <repo-url>
    cd backend
    ```

2. Install the required dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file in the `backend` folder with the following variables:
    ```env
    DATABASE_URL=<your-mongodb-url>
    PORT=5000
    JWT_SECRET=<your-jwt-secret>
    ```

4. Run the backend server:
    ```bash
    npm run dev
    ```

### Frontend Setup

1. Navigate to the `frontend` folder:
    ```bash
    cd frontend
    ```

2. Install the required dependencies:
    ```bash
    npm install
    ```

3. Start the frontend development server:
    ```bash
    npm run dev
    ```
