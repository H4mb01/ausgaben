const tableContainer = document.querySelector('[data-table]');
const LOCAL_STORAGE_TABLE_KEY = 'ausgaben.table'

let table = JSON.parse(localStorage.getItem(LOCAL_STORAGE_TABLE_KEY)) || [];


function logValues() {
  console.log(`die werte sind: ${newWas}, ${newWieViel}, ${newWann}, ${newWer}.`)
}

function render() {
  clearElement(tableContainer);
  constructHeader();
  constructInput();
  constructTable(table);
}

function clearElement(element){
  while (element.firstChild){
    element.removeChild(element.firstChild);
  }
}

function constructHeader(){
  // row erstellen
  const headRow = document.createElement('tr');
  headRow.classList.add("headrow");
  tableContainer.appendChild(headRow);
  //Elemente erstellen
  let headDataWas = document.createElement('th');
  let headDataWieViel = document.createElement('th');
  let headDataWann = document.createElement('th');
  let headDataWer = document.createElement('th');
  //Werte setzen
  headDataWas.innerText = 'Was';
  headDataWieViel.innerText = 'Wie Viel';
  headDataWann.innerText = 'Wann';
  headDataWer.innerText = 'Wer';
  //Elemente einbetten
  headRow.appendChild(headDataWas);
  headRow.appendChild(headDataWieViel);
  headRow.appendChild(headDataWann);
  headRow.appendChild(headDataWer);

}

function constructInput(){
  //row erstellen
  const inputRow = document.createElement('tr');
  inputRow.classList.add("inputrow");
  tableContainer.appendChild(inputRow);
  //Elemente erstellen
  let DataWas = document.createElement('td');
  let DataWieViel = document.createElement('td');
  let DataWann = document.createElement('td');
  let DataWer = document.createElement('td');
  //input erstellen
  let inputDataWas = document.createElement('input');
  let inputDataWieViel = document.createElement('input');
  let inputDataWann = document.createElement('input');
  let inputDataWer = document.createElement('input');
  //input styling
  inputDataWas.id = "was";
  inputDataWas.size="5";
  inputDataWas.type="text";
  inputDataWieViel.id = "wieViel";
  inputDataWieViel.size="5";
  inputDataWieViel.type="text";
  inputDataWann.id = "wann";
  inputDataWann.size="5";
  inputDataWann.type="date";
  inputDataWer.id = "wer";
  inputDataWer.size="5";
  inputDataWer.list= "werList";
  //Elemente einbetten
  inputRow.appendChild(DataWas);
  inputRow.appendChild(DataWieViel);
  inputRow.appendChild(DataWann);
  inputRow.appendChild(DataWer);
  //input einbetten
  DataWas.appendChild(inputDataWas);
  DataWieViel.appendChild(inputDataWieViel);
  DataWann.appendChild(inputDataWann);
  DataWer.appendChild(inputDataWer);
  //datalist erstellen
  let dataList = document.createElement('datalist');
  dataList.id = 'werList';
  DataWer.appendChild(dataList);
  //optionen erstellen
  let option1 = document.createElement('option');
  let option2 = document.createElement('option');
  option1.value = "Manu";
  option2.value = "Laui";
  //optionen einbetten
  dataList.appendChild(option1);
  dataList.appendChild(option2);
  //button erstellen
  let buttonElement = document.createElement('td');
  let button = document.createElement('button');
  button.id = "sendbutton";
  button.innerText = "neu";
  button.type = "button";
  //button einbetten
  inputRow.appendChild(buttonElement);
  buttonElement.appendChild(button);
  button.addEventListener("click", () => {
    if (
      document.getElementById("was").value === ''  
      || document.getElementById("wieViel").value === ''  
      || document.getElementById("wann").value === ''  
      || document.getElementById("wer").value === ''  
    ) {
      console.log('rippchen, da haste mist gemacht')
    } else {
    createRow();  
    saveAndRender();

    }
  });

}

function constructTable(table){
  table.forEach( row => {
    const tableRow = document.createElement('tr');
    tableRow.classList.add("table-row");
    tableContainer.appendChild(tableRow);
    let tableDataWas = document.createElement('td');
    let tableDataWieViel = document.createElement('td');
    let tableDataWann = document.createElement('td');
    let tableDataWer = document.createElement('td');
    tableDataWas.innerText = row.was;
    tableRow.appendChild(tableDataWas);
    tableDataWieViel.innerText = row.wieViel + ' €';
    tableRow.appendChild(tableDataWieViel);
    tableDataWann.innerText = row.wann;
    tableRow.appendChild(tableDataWann);
    tableDataWer.innerText = row.wer;
    tableRow.appendChild(tableDataWer);
    let buttonElement = document.createElement('td');
    let button = document.createElement('button');
    button.type = 'button';
    button.innerText = 'löschen';
    button.classList.add("deleteButton");
    button.addEventListener('click', () => {
      deleteRow(row);
      saveAndRender();
    })
    tableRow.appendChild(buttonElement);
    buttonElement.appendChild(button);
  } )
} 
function createRow(){
  let tempWieViel = 0;
  let tempWann = document.getElementById('wann').value;
  if (document.getElementById('wieViel').value.includes('.')
    || !document.getElementById('wieViel').value.includes(',')){
    tempWieViel = parseFloat(document.getElementById('wieViel').value).toFixed(2);
    } else {
    tempWieViel = parseFloat((document.getElementById('wieViel').value).replace(",", ".")).toFixed(2);
    }
  if (tempWann.startsWith('0')){
    let tempTempWann = '2' + tempWann.slice(1, tempWann.lenght);
    tempWann = tempTempWann;
  }
  table.push({
    was: document.getElementById('was').value,
    wieViel: tempWieViel,
    wann: tempWann,
    wer: document.getElementById('wer').value,
  });
}

function deleteRow(row){
  for (let i=0; i < table.length; i++){
    if (table[i].was === row.was && table[i].wieViel === row.wieViel && table[i].wann == row.wann && table[i].wer === row.wer){
      table.splice(i, 1);
    }
  }
}

function saveAndRender(){
  save();
  render();
}

function save(){
  localStorage.setItem(LOCAL_STORAGE_TABLE_KEY, JSON.stringify(table));  
}


render();
