let user = waitForGetUser();
const token = localStorage.getItem('jwt.token');

function waitSomeTime(time) {
    return new Promise(resolve => {
        setTimeout(()=> {
            resolve('resolved');
        }, time );
    })
}

async function waitForGetUser() {
    const result = await waitSomeTime(200);
    console.log("got User");
    return getUser()
}

async function waitForGenerateOptions() {
  const result = await waitSomeTime(600);
  generateOptions();
}

async function getUser(){
  window.fetch ( "http://localhost:8000/user", {
  headers: {'Content-Type' : 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('jwt.token')}
  })
  .then(response => response.text())
  .then(text => {
    user = text;
      return text;
  })
}


function isLoggedIn() {
  if (localStorage.getItem('jwt.token')) {
    console.log('user is logged in');
  } else {
    window.location.href="login.html";
  }
}

function generateLink( parent, link, text ) {
  let li = document.createElement('li');
  let a = document.createElement('a');
  parent.appendChild(li);
  li.appendChild(a);
  a.href = link;
  a.innerText = text;
}


function generateOptions() {
  const parent = document.getElementById('optionsList'); 
  if (token) {
    //user registrieren
    generateLink( parent, 'register.html', "Benutzer anlegen");
  }
  if (user == 'admin'){
    //user löschen
    generateLink( parent, 'delete.html', "Benutzer löschen");
    //user passwort ändern
    //generateLink( parent, '#', "Passwort eines Benutzers ändern");
  }
    
}







isLoggedIn();
console.log(user);
waitForGenerateOptions();