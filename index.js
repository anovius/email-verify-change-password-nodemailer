const express = require('express');
const app = express()
const router = express.Router()
const nodemailer = require('nodemailer');

app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use('/', router)

var users = []
var token = 0

function createEmailTemplate(req){
    token = Math.floor(Math.random()* 9000) + 1000 
    const htmlTemplate = `
    <p>
        Your otp is ${token} to verify your account
    </p>
    `
    return htmlTemplate
}

app.post('/createAccount', (req, res) => {
    const {email} = req.body
    const {password} = req.body
    const emailTemplate = createEmailTemplate(req)

    var messageToSend = {
        from: "Your Email Here",
        to: email, 
        subject:  'Verify Account',
        text: "",
        html: emailTemplate
    }

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth:{
            user: 'Your Email Here',
            pass: 'Your Password Here'
        }
    })

    transporter.sendMail(messageToSend, (err, info) => {
        if(err) 
            res.status(421).send({message: 'Invalid Email address provided!'})
        else{
            users.push({
                email: email,
                password: password
            })
            res.status(200).send({message: 'An email sent to your account to verify your identity'})
        }
    })
})

app.post('/verify/:emailToken', (req, res) => {
    const {emailToken} = req.params
    if(emailToken == token){ 
        res.status(200).send({message: 'User account Verified'})
    }
    else
    res.status(421).send({message: 'Invalid identity'})
})


app.get('/changePassword/:email', (req, res)=>{
    const {email} = req.params
    const emailTemplate = createEmailTemplate(req)

    var messageToSend = {
        from: "Your Email Here",
        to: email, 
        subject:  'Verify Account',
        text: "",
        html: emailTemplate
    }

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth:{
            user: 'Your Email Here',
            pass: 'Your Password Here'
        }
    })

    transporter.sendMail(messageToSend, (err, info) => {
        if(err) 
            res.status(421).send({message: 'Invalid Email address provided!'})
        else{
            res.status(200).send({message: 'An email sent to your account to verify your identity'})
        }
    })
})

app.post('/changePassword', (req, res) => {
    const {emailToken} = req.body
    const {email} = req.body
    const {password} = req.body
    if(emailToken == token){
        var ind = users.findIndex((user) => user.email === email)
        users[ind].password = password
        res.status(200).send({message: 'Password Changed'})
    }
    else
        res.status(421).send({message: 'Invalid otp'})
})
app.listen(3000)