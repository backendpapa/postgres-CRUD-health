const LocalStrategy = require('passport-local').Strategy;
const { pool } = require('./dbConfig')
const bcrypt = require('bcrypt');

function initialize(passport) {
    const authenticateUser = (email, password, done) => {
        pool.query(
            `SELECT * FROM users WHERE email=$1`, [email], (err, results) => {
                if (err) {
                    throw err;

                }
                console.log("account")
                console.log(results.rows)

                if (results.rows.length > 0) {
                    console.log("results is greater than 0")
                    const user = results.rows[0]

                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) {
                            throw err;

                        }
                        if (isMatch) {
                            console.log(user, "user")

                            return done(null, user)
                        } else {
                            console.log("password incorrect")

                            return done(null, false, { message: "password incorrect" })
                        }
                    })
                } else {
                    console.log("email not regustered")
                    return done(null, false, { message: "email is not registered" })
                }
            }
        )
    }


    passport.use(
        new LocalStrategy(
            {
                usernameField: "email",
                passwordField: "password"
            },
            authenticateUser
        )
    )
    passport.serializeUser((user, done) => done(null, user.id));
    // passport.serializeUser((user,done)=>{
    console.log("we are here")
    passport.deserializeUser((id, done) => {
        pool.query(`
        SELECT * FROM users WHERE id=$1
        `, [id], (err, results) => {
            if (err) {
                throw err;
            }
            console.log("go")


            return done(null, results.rows[0]);
        })
    })

}

module.exports = initialize;
