const overviewContainer = document.getElementById('overviewContainer');
const tableContainer = document.querySelector('[data-table]');
const LOCAL_STORAGE_TABLE_KEY = 'ausgaben.table'

let table = JSON.parse(localStorage.getItem(LOCAL_STORAGE_TABLE_KEY)) || [];
let sort = 'dateNeg';

function logValues() {
  console.log(`die werte sind: ${newWas}, ${newWieViel}, ${newWann}, ${newWer}.`)
}

function render() {
  sortArray();
  clearElement(overviewContainer);
  constructOverview();
  clearElement(tableContainer);
  constructHeader();
  constructInput();
  constructTable(table);
  constructSum();
}

function renderList(){
  constructTable(table);
}

function clearElement(element){
  while (element.firstChild){
    element.removeChild(element.firstChild);
  }
}

function constructOverview(){
  const overviewHeader = document.createElement('h2');
  overviewHeader.innerText = 'Überblick';
  overviewContainer.appendChild(overviewHeader);
//  const overviewList = document.createElement('ul');
//  overviewList.classList.add("overviewList");
//  overviewContainer.appendChild(overviewList);
  constructWerList();
  constructTimeOverview();
}
function constructWerList() {
  const werList = document.createElement('table');
  werList.classList.add("tabelle");
  overviewContainer.appendChild(werList);
  const werListHeader = document.createElement('tr');
//  werListHeader.classList.add("");
  werList.appendChild(werListHeader);
  let werZahlt = [];
  let werZahltWieViel = [];
  for (let i=0; i<table.length; i++){
    if (werZahlt.includes(table[i].wer)){
      let a = werZahlt.indexOf(table[i].wer);
      werZahltWieViel[a] += parseFloat(table[i].wieViel);
      werZahltWieViel[a];
    } 
    else { 
      let temp = table[i].wer;
      werZahlt.push(temp);
      let tempWV = parseFloat(table[i].wieViel);
      werZahltWieViel.push(tempWV);
    }
  }
  let werArray = [];
  for (i=0; i<werZahlt.length; i++){
    werArray[i]= [werZahlt[i], werZahltWieViel[i]];
  }
  console.log(werArray);
  werArray.sort();
  console.log(werArray);

  const werListHeaderWer = document.createElement('th');
  werListHeader.appendChild(werListHeaderWer);
  werListHeaderWer.innerText = 'Wer' ;
  const werListHeaderWieViel = document.createElement('th');
  werListHeader.appendChild(werListHeaderWieViel);
  werListHeaderWieViel.innerText = 'Wie Viel' ;
  const werListHeaderAnteil = document.createElement('th');
  werListHeader.appendChild(werListHeaderAnteil);
  werListHeaderAnteil.innerText = 'Anteil' ;
  for (let i=0; i<werZahlt.length; i++){
    const werZahltList = document.createElement('tr');
    werList.appendChild(werZahltList);
    const werZahltListName = document.createElement('td');
    werZahltList.appendChild(werZahltListName);
    werZahltListName.innerText = werZahlt[i];
    const werZahltListWieViel = document.createElement('td');
    werZahltList.appendChild(werZahltListWieViel);
    werZahltListWieViel.classList.add("text-align-right");
    werZahltListWieViel.innerText = `${werZahltWieViel[i].toFixed(2)} €`;
    const werZahltListAnteil = document.createElement('td');
    werZahltList.appendChild(werZahltListAnteil);
    werZahltListAnteil.classList.add("text-align-right");
    werZahltListAnteil.innerText = `${(werZahltWieViel[i] / parseFloat(gesamtAusgaben()) * 100).toFixed(2)} %`;

//    werZahltListEintrag.innerText = `${werZahlt[i]}: ${werZahltWieViel[i].toFixed(2)} €   Anteil: ${(werZahltWieViel[i] / parseFloat(gesamtAusgaben()) * 100).toFixed(2)} %`;
  }
 }

function constructTimeOverview() {
  //construct Table
  const overviewTime = document.createElement('table');
  overviewTime.classList.add('tabelle');
  overviewContainer.appendChild(overviewTime);
  //construct Header
  const overviewTimeHeaderRow = document.createElement('tr');
  overviewTime.appendChild(overviewTimeHeaderRow);
  const overviewTimeHeaderRowTimespan = document.createElement('th');
  const overviewTimeHeaderRowSum = document.createElement('th');
  overviewTimeHeaderRowTimespan.innerText = "Zeitraum";
  overviewTimeHeaderRowSum.innerText = "Wert";
  overviewTimeHeaderRow.appendChild(overviewTimeHeaderRowTimespan);
  overviewTimeHeaderRow.appendChild(overviewTimeHeaderRowSum);

  //construct rows
  let years = [];
  for (let i=0; i<table.length; i++){
    if (years.includes(table[i].wann.substr(0, 4))){

    }
    else {
      years.push(table[i].wann.substr(0, 4));

    }
  }
  years.sort(compareNumbers);
  for (let i=0; i<years.length; i++){
    const yearRow = document.createElement('tr');
    overviewTime.appendChild(yearRow);
    const yearName = document.createElement('td');
    yearName.innerText = `Jahr ${years[i]}`;
    yearRow.appendChild(yearName);
    const yearValue = document.createElement('td');
    let tempValue = 0;
    for (let j=0; j<table.length; j++){
      if (table[j].wann.substr(0, 4) === years[i]){
        tempValue += parseFloat(table[j].wieViel);
      }
    }
    yearValue.innerText = `${tempValue.toFixed(2)} €`;
    yearRow.appendChild(yearValue);
    let months = [];
    for (let ii=0; ii<table.length; ii++){
      if (months.includes(table[ii].wann.substr(0, 7))){}
      //    else if(table[ii].wann.substr(0,7) !== years[i]){}
      else {months.push(table[ii].wann.substr(0,7));}
    }
    months.sort(compareMonths);
    for (let k=0; k<months.length; k++){
      if (months[k].substr(0,4) === years[i]){
        const monthRow = document.createElement('tr');
        overviewTime.appendChild(monthRow);
        const monthName = document.createElement('td');
        const monthsName = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'Spetember', 'Oktober', 'November', 'Dezember'];
        monthName.innerText = `${monthsName[parseInt(months[k].substr(5,2))-1]} ${years[i]}`;
        monthRow.appendChild(monthName);
        const monthValue = document.createElement('td');
        let tempMonthValue = 0;
        for (let l=0; l<table.length; l++){
          if (table[l].wann.substr(0, 7) === months[k]){
            tempMonthValue += parseFloat(table[l].wieViel);
          }
        }
        monthValue.innerText = `${tempMonthValue.toFixed(2)} €`;
        monthRow.appendChild(monthValue);

      }
    }
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
  headDataWann.classList.add('text-align-center');
  headDataWer.innerText = 'Wer';
  //Headrow klickbar machen
  headDataWas.classList.add = 'hdClick';
  headDataWas.addEventListener("click", () => {
    /*if (document.getElementById('hdActive')){
    document.getElementById('hdActive').id = 'inactive';}
    headDataWas.id = 'hdActive';    Das sollte eine Möglichkeit sein, die aktuelle Sortierung anzuzeigen, aber sie überschreibt sich durch's neurendern. vielleicht findest du ja eine Möglichkeit, nur die Liste nue zu rendern, ohne dabei den header und den input neu zu rendern. ich hab es eben versucht, aber es hat nicht so geklappt, wie ich mir das vorgestellt hatte. Primär das lösen nur der tabelle. */
    setSort('was');
    sortArray();
    saveAndRender();
  })
  headDataWieViel.classList.add = 'hdClick';
  headDataWieViel.addEventListener("click", () => {
    /*if (document.getElementById('hdActive')){
    document.getElementById('hdActive').id = 'inactive';}
    headDataWieViel.id = 'hdActive';*/
    setSort('wieViel');
    sortArray();
    saveAndRender();
  })
  headDataWann.classList.add = 'hdClick';
  headDataWann.addEventListener("click", () => {
    /*if (document.getElementById('hdActive'));{
    document.getElementById('hdActive').id = 'inactive';}
    headDataWann.id = 'hdActive';*/
    setSort('date');
    sortArray();
    saveAndRender();
  })
  headDataWer.classList.add = 'hdClick';
  headDataWer.addEventListener("click", () => {
    /*if (document.getElementById('hdActive')){
    document.getElementById('hdActive').id = 'inactive';}
    headDataWer.id = 'hdActive';*/
    setSort('wer');
    sortArray();
    saveAndRender();
  })
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
    tableDataWieViel.classList.add("text-align-right");
    tableRow.appendChild(tableDataWieViel);
    tableDataWann.innerText = zuDtDatum(row.wann);
    tableDataWann.classList.add('text-align-center')
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
function constructSum(){
    const tableRow = document.createElement('tr');
    tableRow.classList.add("sum-row");
    tableContainer.appendChild(tableRow);
    let tableDataWas = document.createElement('td');
    let tableDataWieViel = document.createElement('td');
    let tableDataWann = document.createElement('td');
    let tableDataWer = document.createElement('td');
    tableDataWieViel.innerText = gesamtAusgaben() + ' €';
    tableDataWas.innerText = 'Summe:';
    tableDataWieViel.classList.add('summe', 'text-align-right')
    tableRow.appendChild(tableDataWas);
    tableRow.appendChild(tableDataWieViel);
    tableRow.appendChild(tableDataWann);
    tableRow.appendChild(tableDataWer);
 
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

function getSumYear() {

}

function getSumMonth() {
  
}

function setSort(newSort) {
  if (newSort === 'date' && sort === 'date'){
    sort = 'dateNeg';
  } else if (newSort === 'wieViel' && sort === 'wieViel'){
    sort = 'wieVielNeg';
  } else if (newSort === 'was' && sort === 'was'){
    sort = 'wasNeg';
  } else if (newSort === 'wer' && sort === 'wer'){
    sort = 'werNeg';
  } else {
    sort = newSort;
  }
}

function compareNumbers(a,b){
  return a-b;
}

function compareMonths(a,b){
  a=parseInt(a.substr(5,2));
  b=parseInt(b.substr(5,2));
  return a-b;
}

function werSort(a, b) {
  const dateA = a.wer;
  const dateB = b.wer;

  let comparison = 0; 
  if (dateA > dateB){comparison = 1}
  else if (dateA < dateB){comparison = -1}
  return comparison;

}

function wasSort(a, b) {
  const dateA = a.was;
  const dateB = b.was;

  let comparison = 0; 
  if (dateA > dateB){comparison = 1}
  else if (dateA < dateB){comparison = -1}
  return comparison;

}

function wieVielSort(a, b) {
  const dateA = a.wieViel;
  const dateB = b.wieViel;

  let comparison = 0; 
  if (dateA > dateB){comparison = 1}
  else if (dateA < dateB){comparison = -1}
  return comparison;

}

function dateSort(a, b){
  const dateA = a.wann;
  const dateB = b.wann;

  let comparison = 0; 
  if (dateA > dateB){comparison = 1}
  else if (dateA < dateB){comparison = -1}
  return comparison;
}

function dateSortNeg(a,b){return - dateSort(a,b);}
function wieVielSortNeg(a,b){return - wieVielSort(a,b);}
function wasSortNeg(a,b){return - wasSort(a,b);}
function werSortNeg(a,b){return - werSort(a,b);}

function sortArray() {
  if (sort === 'dateNeg'){
  table.sort(dateSortNeg)
  } else if (sort=== 'wieVielNeg') {
  table.sort(wieVielSortNeg)
  } else if (sort === 'wasNeg') {
  table.sort(wasSortNeg)
  } else if (sort === 'werNeg') {
  table.sort(werSortNeg)
  } else if (sort === 'date'){
  table.sort(dateSort)
  } else if (sort=== 'wieViel') {
  table.sort(wieVielSort)
  } else if (sort === 'was') {
  table.sort(wasSort)
  } else if (sort === 'wer') {
  table.sort(werSort)
  } else {
    sort = 'date';
    table.sort(dateSort);
  }
}

function gesamtAusgaben(){
  let sum = 0;
  for (let i = 0; i<table.length; i++){
    sum += parseFloat(table[i].wieViel);
  }
  return sum.toFixed(2);
}

function zuDtDatum(wann){
  return `${wann.substr(8,2)}.${wann.substr(5,2)}.${wann.substr(0,4)}`;
}

function saveAndRender(){
  save();
  render();
}

function save(){
  localStorage.setItem(LOCAL_STORAGE_TABLE_KEY, JSON.stringify(table));  
}


render();
