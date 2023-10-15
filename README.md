# Budget Buddy
This is a Vue.js 2, Express, and SQLite app that sorts personal bank account incomes and outcomes. It reads in CSV files, sorts transactions to user-defined categories, and saves data to an SQLite database.

# Features
Sorts personal bank account incomes and outcomes
Reads in CSV files (working only with POP bank ATM)
Sorts transactions to user-defined categories
Saves data to an SQLite database
Shows summary of transactions
Shows all transactions between selected dates and/or category

# Installation
Clone the repository:
```javascript
git clone https://github.com/your-username/budget-buddy.git
```

## Install the dependencies:
```javascript
cd budget-buddy
npm install
```

## Start the frontend:
```javascript
npm run start
```

## Start the backend:
```javascript
node server.js
```

## Open the app in your browser:
```javascript
http://localhost:8080/
```

# Usage
Upload a CSV file from a POP bank.
Define categories for your transactions.
View a summary of your transactions.
Filter transactions by date and/or category.
