let table = [];
const newWas = document.getElementById('was').value;
const newWieViel = document.getElementById('wieViel').value;
const newWann = document.getElementById('wann').value;
const newWer = document.getElementById('wer').value;
const send = document.getElementById('sendbutton');

send.addEventListener('click', () => {
  console.log(`${newWas}, ${newWieViel}, ${newWann}, ${newWer}`);

});
function lol() {

  console.log(`${newWas}, ${newWieViel}, ${newWann}, ${newWer}`);
}
lol();
