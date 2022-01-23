const inputElement = document.getElementById("file");
inputElement.addEventListener("change", handleFiles, false);

function handleFiles() {
  input = inputElement.files[0];
  const reader = new FileReader();
  reader.readAsText(input);

  reader.onload = function (e) {
    const text = e.target.result;
    const data = csvToArray(text);

    console.log(data);

    var sortedByProject = data.sort(function (a, b) {
      return a[1] - b[1];
    });
    const fileList = findPairs(sortedByProject);

    console.log(fileList);
    const max = fileList.reduce(function (prev, current) {
      return prev[3] > current[3] ? prev : current;
    });

    var tablearea = document.getElementById("employee-list"),
      table = document.createElement("table"),
      th = document.createElement("tr");

    th.appendChild(document.createElement("th"));
    th.appendChild(document.createElement("th"));
    th.appendChild(document.createElement("th"));
    th.appendChild(document.createElement("th"));

    th.cells[0].appendChild(document.createTextNode("Employee ID#1"));
    th.cells[1].appendChild(document.createTextNode("Employee ID#2"));
    th.cells[2].appendChild(document.createTextNode("Project ID"));
    th.cells[3].appendChild(document.createTextNode("Days worked"));

    table.appendChild(th.cloneNode(true));

    tr = document.createElement("tr");

    tr.appendChild(document.createElement("td"));
    tr.appendChild(document.createElement("td"));
    tr.appendChild(document.createElement("td"));
    tr.appendChild(document.createElement("td"));

    tr.cells[0].appendChild(document.createTextNode(max[0]));
    tr.cells[1].appendChild(document.createTextNode(max[1]));
    tr.cells[2].appendChild(document.createTextNode(max[2]));
    tr.cells[3].appendChild(document.createTextNode(max[3]));

    table.appendChild(tr.cloneNode(true));
    tablearea.appendChild(table);
  };
}

function findPairs(data) {
  const newArray = new Array();
  data.forEach((element, index) => {
    let next;
    if (element == data[data.length - 1]) {
      next = data[0];
    } else {
      next = data[index + 1];
    }
    for (let i = 0; i < data.length; i++) {
      let temp = data[i];
      console.log(temp);
      if (
        element.ProjectID === temp.ProjectID &&
        element.EmpID !== temp.EmpID
      ) {
        const daysWorked = overlap(
          element.DateFrom,
          element.DateTo,
          temp.DateFrom,
          temp.DateTo
        );
        newArray.push([
          element.EmpID,
          temp.EmpID,
          element.ProjectID,
          daysWorked,
        ]);
        console.log(newArray);
      }
    }
  });
  return newArray;
}

function overlap(emp1d1, emp1d2, emp2d1, emp2d2) {
  const startDate1 = new Date(emp1d1);
  const endDate1 = emp1d2 === null ? new Date() : new Date(emp1d2);
  const startDate2 = new Date(emp2d1);
  const endDate2 = emp2d2 === null ? new Date() : new Date(emp2d2);

  const start = startDate1 < startDate2 ? startDate2 : startDate1;
  const end = endDate1 < endDate2 ? endDate1 : endDate2;

  if (end >= start) {
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  return 0;
}

function populateTable(table, rows, cells, content) {
  if (!table) table = document.createElement("table");
  for (var i = 0; i < rows; ++i) {
    var row = document.createElement("tr");
    for (var j = 0; j < cells; ++j) {
      row.appendChild(document.createElement("td"));
      row.cells[j].appendChild(document.createTextNode(content + (j + 1)));
    }
    table.appendChild(row);
  }
  return table;
}

function csvToArray(str, delimiter = ",") {
  const headers = str.slice(0, str.indexOf("\n")).split(delimiter);

  const rows = str.slice(str.indexOf("\n") + 1).split("\n");

  const arr = rows.map(function (row) {
    const values = row.split(delimiter);
    const el = headers.reduce(function (object, header, index) {
      object[header] = values[index];
      return object;
    }, []);
    return el;
  });

  return arr;
}
