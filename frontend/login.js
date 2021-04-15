const LOCAL_STORAGE_TOKEN = 'jwt.token';



function saveLogin(){
  window.fetch("http://localhost:8000/login", {
    method: 'post',
    headers: {'Content-Type' : 'application/json'},
    body: JSON.stringify({ name: document.getElementById('name').value, password: document.getElementById('password').value})
  })
    .then(response => response.text())
    .then((text) => {
      console.log("text: ", text);
      localStorage.setItem(LOCAL_STORAGE_TOKEN, text);  
      console.log(localStorage.getItem(LOCAL_STORAGE_TOKEN));
      window.location.href= '/index.html';
    } )
    .catch((error) => {
      console.log("Error: ", error);
    })
}