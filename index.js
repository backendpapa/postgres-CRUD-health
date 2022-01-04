const express = require('express')
const app = express()
const PORT = process.env.PORT || 4000
const bcrypt = require("bcrypt");
const session = require('express-session');
const flash = require('express-flash')
const { pool } = require('./dbConfig');
const cors = require('cors')


const InitializePassport = require('./passportConfig');
const passport = require('passport');
InitializePassport(passport)


app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))


app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())


/* 
** Register Route
*/


app.post('/users/register', async (req, res) => {
    let { username, email, password, password2 } = req.body;
    console.log(
        req.body
    )
    let errors = []
    if (!email || !password || !password2 || !username) {
        errors.push({ message: "Please enter all feed" })
    }
    if (password.length < 6) {
        errors.push({ messahe: "Password should be at least 6 characters" })
    }

    if (password != password2) {
        errors.push({ message: "Password does not match" })
    }

    // Change this
    if (errors.length > 0) {
        res.send({ errors })
    } else {
        let hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword)
        pool.query(
            `SELECT * FROM users
            WHERE email=$1
            `, [email], (err, results) => {
            if (err) {
                throw err;
            }
            // res.send(results.rows)
            if (results.rows > 0) {
                errors.push({ message: 'user already exists' })
            } else {
                pool.query(
                    `INSERT INTO users (username,email,password)
                        VALUES ($1,$2,$3)
                        RETURNING id,password,email,username
                        `, [username, email, hashedPassword], (err, results) => {
                    if (err) {
                        throw err;
                    }

                    req.flash({ "success": "you are now registered, please log in" })
                    res.send(results.rows);
                }
                )
            }
        }
        )
    }


})

app.get('/users', (req, res) => {
    pool.query(`SELECT * FROM users`, (err, results) => {
        if (err) {
            throw err;
        }
        res.send(results.rows)
    })
})


app.post('/users/login', passport.authenticate('local'), (req, res) => {
    res.send(req.user)

})

// Post patients
app.post('/patient', (req, res) => {
    const { firstname, lastname, dob, patientid, accession, procedure } = req.body
    console.log(req.body)
    pool.query(
        `INSERT INTO patient(firstname,lastname,dob,patientid,accession,procedure) VALUES ($1,$2,$3,$4,$5,$6)`, [firstname, lastname, dob, patientid, accession, procedure], (err, results) => {
            if (err) {
                throw err;
            }
            res.send(results.rows)
        }
    )
})

app.get('/patient', (req, res) => {
    pool.query(`SELECT * FROM patient`, (err, results) => {
        if (err) {
            throw err;
        }
        res.send(results.rows)
    })

})


app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
})
