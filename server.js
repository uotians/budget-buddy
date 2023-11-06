const express = require('express')
const multer = require('multer')
const csv = require('csv-parser')
const fs = require('fs')
const sqlite3 = require('sqlite3').verbose()
const cors = require('cors')

const app = express()
const port = 3000

const upload = multer({ dest: 'uploads/'})

app.use(cors())

let db = new sqlite3.Database('./database/budgetbuddy.db')

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY,
        date DATE,
        recipient_or_payer TEXT,
        definition TEXT,
        reference TEXT,
        amount REAL,
        category TEXT
    )`, (err) => {
        if (err) {
            console.error(err.message)
        }
    })
    db.run(`CREATE UNIQUE INDEX IF NOT EXISTS idx_transaction ON transactions (
        date, recipient_or_payer, definition, amount)`)
    db.run(`CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY,
        name TEXT
    )`, (err) => {
        if (err) {
            console.error(err.message)
        }
    })
})

app.post('/category', express.json(), (req, res) => {
    let sql = 'INSERT INTO categories(name) VALUES(?)'
    let values = [req.body.name]

    db.run(sql, values, function(err) {
        if (err) {
            return console.err(err.message)
        }
        res.json({ id: this.lastID })
    })
})

app.post('/upload', upload.single('file'), (req) => {
    let data = []

    fs.createReadStream(req.file.path)
        .pipe(csv({ separator: ';'}))
        .on('data', (row) => {
            data.push(row)
        })
        .on('end', () => {
            saveFileToDatabase(data)
            console.log('CSV file processed')
        })
})

app.get('/alltransactions', express.json(), (req, res) => {
    let sql = 'SELECT * FROM transactions WHERE category IS NULL'

    db.all(sql, function(err, rows) {
        if (err) {
            return console.error(err.message)
        }
        res.json({ rows })
    })
    
})

app.get('/fetchcategories', express.json(), (req, res) => {
    let sql = 'SELECT * FROM categories'

    db.all(sql, function(err, rows) {
        if (err) {
            return console.log(err.message)
        }
        res.json({ rows })
    })
})

app.post('/addtocategory', express.json(), (req, res) => {
    console.log(req.body.name)
    var category = req.body.name
    var recipient_or_payer = req.body.recipient_or_payer

    let sql = 'UPDATE transactions SET category = ? WHERE recipient_or_payer = ?'
    db.run(sql, [category, recipient_or_payer], function (err, rows) {
        if (err) {
            return console.log(err.message)
        }
        res.json({ rows })
    })
})

app.get('/gettotals', express.json(), (req, res) => {

    let sql = `SELECT 
                    SUM(CASE WHEN Amount > 0 THEN Amount ELSE 0 END) AS Tulot,
                    SUM(CASE WHEN Amount < 0 THEN Amount ELSE 0 END) AS Menot
                FROM transactions`
    db.all(sql, function(err, rows) {
        if (err) {
            return console.log(err.message)
        }
        res.json({ rows })
    })
})

app.post('/gettotals', express.json(), (req, res) =>{
    console.log(req.body.date)
    var startDate = req.body.date[0]
    var endDate = req.body.date[1]
    let sql = `SELECT 
                    SUM(CASE WHEN Amount > 0 THEN Amount ELSE 0 END) AS Tulot,
                    SUM(CASE WHEN Amount < 0 THEN Amount ELSE 0 END) AS Menot
                FROM transactions
                WHERE date BETWEEN ? AND ?`
    db.all(sql, [startDate, endDate], function(err, rows) {
        if (err) {
            return console.log(err.message)
        }
        res.json({ rows })
    })
})

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
})

async function saveFileToDatabase(data) {
    let existing = await fetchExistingCategories()
    //console.log(existing)
    let error = []

    for (let i = 1; i < data.length; i++) {
        let info = []
        for (let key in data[i]) {
            info.push(data[i][key])
        }
        let sql = 'INSERT INTO transactions(date, recipient_or_payer, reference, definition, amount, category) VALUES(?,?,?,?,?,?)'

        info[0] = convertToSqlDateFormat(info[0])

        if (info[1] == "") {
            info[1] = info[2]
        }

        info[3] = info[3].replace("'", "")
        info[4] = info[4].replace(",", ".")
        
        info[5] = null
        let element = existing.find(element => element.recipient_or_payer === info[1])
        if (element) {
            info[5] = element.category
        }

        let values = [info[0], info[1], info[2], info[3], info[4], info[5]]

        db.run(sql, values, function(err) {
            if (err) {
                error.push(info)
                console.log(info)
                return console.error(err.message)
            }
            //console.log(`Row inserted with rowid ${this.lastID}`)
        })
    }
    if (error != null) {
        return error
    }
}

async function fetchExistingCategories() {
    let sql = 'SELECT DISTINCT recipient_or_payer, category FROM transactions WHERE category IS NOT NULL'
    return new Promise(function(resolve, reject) {
        db.all(sql, function(err, rows) {
            if (err) {
                reject(err)
            } else {
                resolve(rows)
            }
        })
    }) 
}

function convertToSqlDateFormat(inputDate) {
    const dateParts = inputDate.split(".");
    const formattedDate = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
    const year = formattedDate.getFullYear();
    let month = formattedDate.getMonth() + 1;
    let day = formattedDate.getDate();

    // Pad month and day with zeros if they are single digits
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;

    return `${year}-${month}-${day}`;
}