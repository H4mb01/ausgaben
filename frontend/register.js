function isLoggedIn() {
  if (localStorage.getItem('jwt.token')) {
    console.log('user is logged in');
  } else {
    window.location.href="login.html";
  }
}

function clearElement(element){
  while (element.firstChild){
    element.removeChild(element.firstChild);
  }
}

function register() {
  let newName = document.getElementById('name').value; 
  window.fetch("http://localhost:8000/register", {
    method: 'post',
    headers: {'Content-Type' : 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('jwt.token')},
    body: JSON.stringify({ name: document.getElementById('name').value, password: document.getElementById('password').value})
  })
    .then(response => response.text())
    .then((text) => {
      console.log("text: ", text);
      let para = document.createElement('div');
      para.innerText = text;
      para.classList.add("erstellt");
      let parent = document.getElementById('register');
      clearElement(parent);
      parent.appendChild(para);
      let back = document.createElement('a');
      back.innerText = "Zurück";
      back.href = "index.html";
      back.classList.add('btn');
      back.classList.add('back');
      para.appendChild(back);
      let again = document.createElement('a');
      again.innerText = 'Nochmal';
      again.href= "register.html";
      again.classList.add('btn');
      again.classList.add('again');
      para.appendChild(again);
    } )
    .catch((error) => {
      console.log("Error: ", error);
    })
}


isLoggedIn();