// hi! 
// This is a program to annotate yearbook lists.
// If you found your way here, I'm sorry to say that it is an absolute mess
// but have fun peeking around the code :)

var names = []
var grades = []
var save_data

var name_selections = [0, 1, 2]
var grade_column = 3

function init() {
    document.getElementById('fileInput').addEventListener('change', handleFileSelect);
    document.getElementById('textarea_input').addEventListener('input', annotate)
    document.getElementById('textarea_input').addEventListener('selectionchange', annotate)
    document.getElementById('button').addEventListener('click', savebutton)
    attemptLoadSave()
}
  
function handleFileSelect(event) {
    const reader = new FileReader()
    reader.onload = handleFileLoad;
    reader.readAsText(event.target.files[0])

}

// parse the csv file
// convert it into a list of names and a list of grades
function handleFileLoad(event) {
    save_data = event.target.result
    parseCSV(event.target.result)
}

function parseCSV(str) {

    let data = []
    let rows = str.split("\n")

    for (let i = 0; i < rows.length; i++) {
        data.push(rows[i].split(","))
    }

    // parse into names
    for (var i = 0; i < data.length; i++) {
        let name = ""
        
        for (var j = 0; j < name_selections.length; j++) {
            name += data[i][name_selections[j]] + " "
        }

        names.push(name.trim())
        grades.push(data[i][grade_column])
    }

    populateTable(data)
    populateInfo(data)
    annotate()
}

// populate the DECISION TABLE with data
function populateTable(data) {
    let div  = document.getElementById('csvPreviewTableDiv')
    let table = document.createElement("table")
    div.appendChild(table)

    previewLength = Math.min(data.length, 5)



    for (let i = 0; i < previewLength; i++) {
        let r = table.insertRow(i)

        for (let j = 0; j < data[i].length; j++) {
            let p = r.insertCell(j)
            if (i == 0) {p.outerHTML = "<th>"+data[i][j]+"</th>"}
            p.innerHTML = data[i][j]
        }

    }
}

function populateInfo(data) {
    let info = document.getElementById('info')
    info.innerHTML = `${names.length-1} Students loaded!<br>Previewing first 5 students:`
}


// take names apart, check for typos, then add grades
function annotate(event) {
    document.getElementById('warnings').innerHTML = ""
    let entered = document.getElementById('textarea_input').value

    if (entered.length == 0) {return}

    if (names.length == 0) {
        notify("error", "please upload a csv file.")
        return
    }



    entered = entered.split(",")
    out = ""

    for (let i = 0; i < entered.length; i++) {
        let name = entered[i].trim()

        if (name.trim() === "") {continue}

        let match = difflib.getCloseMatches(name, names)
        match = match[0]
        
        if (match === undefined) {
            notify('error', `Could not find ${name}.`)
            out += `${match}, `
            continue

        } 
        
        if (name !== match) {
            notify('warn', `Could not find ${name}, replacing it with ${match}.`)
        } 
        let index = names.indexOf(match)
        out += `${match} (${grades[index].trim()}), `

    }
    document.getElementById('textarea_output').value = out
}

function notify(level, text) {
    let box = document.createElement("p");
    box.innerText = text
    box.className = level

    document.getElementById('warnings').appendChild(box)
}


function savebutton(event) {
    let button = document.getElementById('button')
    let n = localStorage.getItem('save_data');

    if (n === null) {
        localStorage.setItem('save_data', save_data);
        button.innerHTML = "clear save data"
    } else {
        localStorage.clear();
        button.innerHTML = "save csv data (so you don't have to keep reuploading the csv file)"
    }
}


function attemptLoadSave(){
    let button = document.getElementById('button')
    let n = localStorage.getItem('save_data');

    
    if (n !== null && n.length > 0) {
        data = localStorage.getItem('save_data');
        parseCSV(data)
        button.innerHTML = "clear save data"
        
    } else {
        button.innerHTML = "save csv data (so you don't have to keep reuploading the csv file)"
    }
}


