
let users = [];
let user;


function clearElement(element){
while (element.firstChild){
  element.removeChild(element.firstChild);
}
}

function waitSomeTime(time) {
    return new Promise(resolve => {
        setTimeout(()=> {
            resolve('resolved');
        }, time );
    })
}

async function waitWithGetUsers() {
    console.log('calling');
    const result = await waitSomeTime(500);
    getUsers()
    console.log("got Users");
    console.log(result);
}

function renderUsers() {
    console.log('users: ', users)
    users.forEach(e => {
        console.log(e);
        let div = document.createElement('div');
        div.classList.add('deleteDiv');
        let parent = document.getElementById('deleteContainer');
        parent.appendChild(div);
        let p = document.createElement('p');
        p.innerText = e;
        div.appendChild(p);
        div.classList.add = "deleteUserBtn";
        let btn = document.createElement('button');
        btn.onclick = () => {
            deleteUser(e);
            clearElement(parent);
            waitWithGetUsers();
        };
        btn.id = e;
        div.appendChild(btn);
        btn.innerText = "diesen Benutzer löschen";
        btn.classList.add('deleteUserBtn');
    })
    console.log(users);
}

function getUsers() {   
    console.log('führe getUsers() aus');
    fetch('http://localhost:8000/user/delete', {
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('jwt.token') }
    })
        .then(response => response.json())
        .then(data => {
            users= [];
            data.forEach(e => {
                users.push(e);
            }
            )
            console.log('users geladen:', users);
            renderUsers();
        }).catch(function (error) {
            console.log("error: " + error);
            //window.location.href = '/index.html'
        });
}

function deleteUser(user) {
    console.log('führe deleteUser() aus');
    console.log(user);
    let userJSON = {name: user}; 
    console.log(userJSON);
    window.fetch('http://localhost:8000/user/deleteUser', {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('jwt.token')},
        body: JSON.stringify(userJSON)
    })
        .then(response => {
            console.log(response);
        }).catch(function (error) {
            console.log("error: " + error);
        });
}
getUsers();
