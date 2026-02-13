const form = document.getElementById("form")
let row = document.getElementById("row-insert")

function loadFromLocalStorage() {
    const saved = localStorage.getItem("subjects");
    if (saved) {
        state.subjects = JSON.parse(saved);
    }
}

loadFromLocalStorage();
const savedGpa = localStorage.getItem("gpa");
if(savedGpa){
    render_gpa(Number(savedGpa));
}

render();


function addCourse(e){
    if(e.target.dataset.action=="add"){
        let name = document.getElementById("course-name").value;
        let credits = Number(document.getElementById("course-credits").value);

        if(!name || credits <= 0){
            if(!name){
                alert("Course name is required");
            }
            else{
                alert("Credits must be greater than 0");
            }
            return;
        }

        state.subjects.push({
            courseName: name,
            courseCredits: credits,   // now stored as Number
            cat1: 0,
            cat2: 0,
            da1: 0,
            da2: 0,
            da3: 0,
            fat : 0,
            cat1weightage:0,
            cat2weightage:0,
            fatweightage:0,
            total:0,
            gradepoint:0,
            grade: ""
        });

        saveToLocalStorage();
        render();
    }
}

function calculateGpa(){
    let gradepointSum = 0;
    let totalCredits = 0;

    state.subjects.forEach((subject)=>{
        gradepointSum += subject.gradepoint;
        totalCredits += Number(subject.courseCredits);
    });

    if(totalCredits === 0){
        render_gpa(0);
        return;
    }

    let gpa = gradepointSum / totalCredits;

    localStorage.setItem("gpa", gpa);

    render_gpa(gpa);
}


function saveToLocalStorage() {
    localStorage.setItem("subjects", JSON.stringify(state.subjects));
}

function handleInputs(e){
    const input = e.target;
    const rowIndex = parseInt(input.dataset.row); 
    const key = input.dataset.key;

    let rawValue = input.value;

    if (input.type === "number" && (rawValue.startsWith("-") || rawValue.includes("e"))) {
        input.value = "";
        return;
    }

    let value = input.type === "number" ? parseFloat(rawValue) : rawValue;

    function reject(){
        input.value = "";
        input.style.border = "2px solid red";
        return;
    }

    input.style.border = "1px solid #ccc";

    if ((key === "cat1" || key === "cat2") && value > 50) {
        return reject();
    }

    if (key === "fat" && value > 100) {
        return reject();
    }

    if ((key === "da1" || key === "da2" || key === "da3") && value > 10) {
        return reject();
    }
    if (key === "grade") {
        const validGrades = ["S","A","B","C","D"];
        if (!validGrades.includes(rawValue.toUpperCase())) {
            return reject();
        }
        value = rawValue.toUpperCase();
        input.value = value;
    }

    state.subjects[rowIndex][key] = input.type === "number" ? (value || 0) : value;
    saveToLocalStorage();
}



function handleKeyPress(e){
    if(e.key === "Enter"){
        
        render();
    }
}
function handleBlur(e){
    render();
}
function render_gpa(gpa){
    const gpaDiv = document.querySelector(".gpa-display");

    gpaDiv.innerHTML = `
        <h2>Current GPA</h2>
        <p>${gpa.toFixed(2)}</p>
    `;
}


function render(){
    row.innerHTML=``
    state.subjects.forEach((subject,i) =>{
        const table_row = document.createElement("tr");

        columns.forEach((col,j)=>{
            if(col.type=="derived"){
                let td = document.createElement("td");
                switch(col.key){
                    case "cat1weightage":
                        let cat1_marks = subject.cat1;
                        let cat1_weightage = catWeightage(cat1_marks) 
                        subject.cat1weightage= cat1_weightage; 
                        td.textContent = cat1_weightage;
                        table_row.append(td);
                        break;
                    case "cat2weightage":
                        let cat2_marks = subject.cat2;
                        let cat2_weightage = catWeightage(cat2_marks) 
                        subject.cat2weightage= cat2_weightage; 
                        td.textContent = cat2_weightage;
                        table_row.append(td);
                        break;
                    case "fatweightage":
                        let fat_marks = subject.fat;
                        let fat_weightage = fatWeightage(fat_marks);
                        subject.fatweightage= fat_weightage; 
                        td.textContent=fat_weightage;
                        table_row.append(td);
                        break;

                    case "total" :
                        let total = subject.cat1weightage + subject.cat2weightage + subject.fatweightage + subject.da1 + subject.da2 + subject.da3;
                        td.textContent = total;
                        subject.total= total; 
                        table_row.append(td);
                        break;

                    case "gradepoint":
                        let gp = gradePoint(subject.grade)*subject.courseCredits;
                        td.textContent = gp;
                        subject.gradepoint= gp; 
                        table_row.append(td);
                        break;


                }   

            }
            else if(col.type=="input"){
                
                let td = document.createElement("td");
                const input = document.createElement("input");
                input.dataset.row = i;
                input.type = col.inputType;
                input.dataset.key = col.key;
                input.value = subject[col.key] ?? "";
                // event listener for inputs
                input.addEventListener("input",handleInputs);
                input.addEventListener("keydown", handleKeyPress);
                input.addEventListener("blur",handleBlur);
                
                
                td.append(input);
                table_row.append(td);

                

            }
            else if (col.label=="Course"){
                let td = document.createElement("td");
                td.textContent=subject.courseName;
                table_row.append(td);
            }

        })
        row.appendChild(table_row);


    })
    // Set limits
    if (col.key === "cat1" || col.key === "cat2") {
        input.max = 50;
    }

    if (col.key === "fat") {
        input.max = 100;
    }

    if (col.key === "da1" || col.key === "da2" || col.key === "da3") {
        input.max = 10;
    }

    if (col.key === "grade") {
        input.style.textTransform = "uppercase";
    }

    saveToLocalStorage();

}


form.addEventListener("click",addCourse)
