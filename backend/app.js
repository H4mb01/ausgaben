const bodyParser = require('body-parser');
const http = require('http');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
const fs = require('fs');
let table = JSON.parse(fs.readFileSync('table.json'));

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.get('/', function(req, res) {
  res.sendFile(path.join(process.cwd() + '/index.html'));
});
app.get('/getTable', function (req, res) {
  res.send(JSON.parse(fs.readFileSync('table.json')));
  res.end();
})
app.post('/addTableRow', function (req, res) {
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
app.post('/deleteTableRow', function (req, res) {
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
      console.log(oldTableRow[0].wieViel);}
    const index = newTable.findIndex(fIndex)
    console.log(oldTableRow[0]);
    console.log(index);
    if (index > -1){
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
app.listen(8000, e=>console.log("Running..."));

