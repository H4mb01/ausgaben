const bodyParser = require('body-parser');
const http = require('http');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
const fs = require('fs');
let table = JSON.parse(fs.readFileSync('table.json'));
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();
const jwt = require('jsonwebtoken');
const path = require('path');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.json());

// user-auth Anfang
let users = JSON.parse(fs.readFileSync('users.json'));
app.get('/users', (req, res) => {
  res.json(users);
})

app.get('/user', authenticateToken, (req, res) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  console.log(token);
  if (token == null) return res.status(401).send()
  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
  
    if (err) return res.sendStatus(403)

    console.log(user.username);
    res.send(user.username);
  })
})

//user-registration
app.post('/register', authenticateToken, async (req, res) => {
  try {
    console.log('Beginn User-registration');
    let names = [];
    users.forEach( e => {names.push(e.name);})
    console.log(names.find(e => e === req.body.name));
    if (names.find( e => e === req.body.name)) {
      console.log('user already exists');
      res.send('user already exists');
    } else {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      console.log(salt);
      console.log(hashedPassword);
      const token = generateAccessToken({ username: req.body.username });
      const user = { name: req.body.name, password: hashedPassword }
      let newUsers = users;
      newUsers.push(user);
      console.log(users);
      fs.writeFile(__dirname + "/" + 'users.json', JSON.stringify(newUsers), (err) => {
        if (err) throw err;
        console.log("You have been registered!");
        users = newUsers;
      })

      res.status(201).send("Benutzer wurde registriert");
    }
    console.log('Ende User-registration')
  } catch (e) {
    res.status(500).send(e);
  }
})

//user-login
app.post('/login', async (req, res) => {
  console.log('wir sind im login Pfad')
  const user = users.find(user => user.name == req.body.name);
  console.log(user);
  if (user === null) {
    console.log("cannot find user");
    return res.status(400).send('Cannot find user');
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      const token = generateAccessToken({username: req.body.name});
      console.log('Passwort korrekt. Token: ', token);
      res.send(token);
    } else {
      console.log('Passwort inkorrekt.');
      return res.status(401).send();
    }
  } catch (e) {
    res.status(500).send(e);
    console.log("fehler");
    console.log(e);
  }
  console.log("ende");
})


function generateAccessToken(username) {
  return jwt.sign(username, process.env.TOKEN_SECRET, {expiresIn: '1800s'});
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.status(401).send()

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    console.log(err)

    if (err) return res.sendStatus(403)

    req.user = user

    next()
  })
}

function isAdmin(req, res, next) {
  console.log('start isAdmin');
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  console.log(authHeader);
  console.log(token);
  if (token == null) return res.status(401).send()
  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    console.log(err)

    if (err) return res.sendStatus(403)

    console.log(req.body)
    console.log(req.user);
    console.log(user);
    console.log(user.username);
    req.user = user
    if (user.username != 'admin') return res.sendStatus(403)
    else console.log('user is admin');

    next()
  })

  console.log('Ende isAdmin');
}
//user-auth Ende

app.use(express.static(__dirname));
app.use(bodyParser.json());

app.post('/user/deleteUser', isAdmin, function (req, res) {
  console.log('starting Process to delete a User');
  console.log(req.body);
  let user = req.body;
  if (user.name == 'admin' || user.name == 'Manu') {
    console.log('unable to delete this user!')
    res.send('unable to delete user');
  } else {
    console.log('trying to delete user ', user);
    let oldUsers = JSON.parse(fs.readFileSync('users.json'));
    let newUsers = oldUsers;
    console.log("oldUsers: ", oldUsers);
    const fi = (e) => {
      let a = e.name;
      let b = user.name;
      if (a === b) { return e }
    };
    const index = newUsers.findIndex(fi);
    console.log("index:", index);
    console.log("user.name:", user.name);
    if (index > -1) {
      newUsers.splice(index, 1);
      console.log(newUsers);
      fs.writeFile(__dirname + "/" + "users.json", JSON.stringify(newUsers), err => {
        if (err) throw err;
        console.log("The user has been deleted!");
        users = newUsers;
      })
    } else {
      console.log("ooops, something went wrong...");
    }
  }
})

app.get('/user/delete', isAdmin, function (req, res) {
  console.log('start GET/user/delete');
  let tempTable = JSON.parse(fs.readFileSync('users.json'));
  let tempNames = [];
  console.log(tempNames);
  console.log(tempTable);
  tempTable.forEach( e => {tempNames.push(e.name);})
  console.log(tempNames);
  res.send(tempNames);
  res.end();
})

app.get('/getTable', authenticateToken, function (req, res) {
  res.send(JSON.parse(fs.readFileSync('table.json')));
  res.end();
})

app.post('/addTableRow', authenticateToken, function (req, res) {
  let newTable = table;
  let newTableRow = [];
  newTableRow.push(req.body);
  if (
    newTableRow[0].was &&
    newTableRow[0].wieViel &&
    newTableRow[0].wann &&
    newTableRow[0].wer
  ) {
    newTable.push(newTableRow[0]);
    table = newTable;
    fs.writeFile(__dirname + "/" + 'table.json', JSON.stringify(newTable), (err) => {
      if (err) throw err;
      console.log("The file has been saved!");
    })
  } else {
    console.log("Irgendetwas ist beim speichern schief gelaufen");
  }

  res.end();
})

app.post('/deleteTableRow', authenticateToken, function (req, res) {
  let newTable = table;
  console.log(newTable);
  let oldTableRow = [];
  oldTableRow.push(req.body);
  console.log(oldTableRow);
  if (
    oldTableRow[0].was &&
    oldTableRow[0].wieViel &&
    oldTableRow[0].wann &&
    oldTableRow[0].wer
  ) {
    console.log('eingabe valide');
    const fIndex = (e) => {
      let was = e.was;
      let wieViel = e.wieViel;
      let wann = e.wann;
      let wer = e.wer;
      let oWas = oldTableRow[0].was;
      let oWieViel = oldTableRow[0].wieViel;
      let oWann = oldTableRow[0].wann;
      let oWer = oldTableRow[0].wer;
      if (
        was === oWas &&
        wieViel === oWieViel &&
        wann === oWann &&
        wer === oWer
      ) {
        return e;
      }
      console.log(e.wieViel);
      console.log(oldTableRow[0].wieViel);
    }
    const index = newTable.findIndex(fIndex)
    console.log(oldTableRow[0]);
    console.log(index);
    if (index > -1) {
      newTable.splice(index, 1);
      console.log(newTable);
      fs.writeFile(__dirname + "/" + 'table.json', JSON.stringify(newTable), (err) => {
        if (err) throw err;
        console.log("The row has been deleted!");
        table = newTable;
      })
    } else {
      console.log("Irgendetwas ist beim löschen schief gelaufen");
    }
  }
  res.end();

})

app.listen(8000, e => console.log("Running..."));

