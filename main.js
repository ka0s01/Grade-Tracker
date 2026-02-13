const form = document.getElementById("form")
let row = document.getElementById("row-insert")

function loadFromLocalStorage() {
    const saved = localStorage.getItem("subjects");
    if (saved) {
        state.subjects = JSON.parse(saved);
    }
}

loadFromLocalStorage();
const gpaDiv = document.querySelector(".gpa-display");
gpaDiv.style.display = "none";


render();


function addCourse(e){
    if(e.target.dataset.action == "add"){

        const nameInput = document.getElementById("course-name");
        const creditInput = document.getElementById("course-credits");

        const name = nameInput.value.trim();
        const credits = Number(creditInput.value);

        // Reset borders
        nameInput.style.border = "1px solid #ccc";
        creditInput.style.border = "1px solid #ccc";

        if(name === ""){
            nameInput.style.border = "2px solid red";
            return;
        }

        if(!Number.isInteger(credits) || credits <= 0){
            creditInput.style.border = "2px solid red";
            return;
        }

        state.subjects.push({
            courseName: name,
            courseCredits: credits,
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

        nameInput.value = "";
        creditInput.value = "";

        saveToLocalStorage();
        render();
    }
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

function deleteCourse(index){
    state.subjects = state.subjects.filter((_, i) => i !== index);
    saveToLocalStorage();
    render();
}


function handleKeyPress(e){
    if(e.key === "Enter"){
        
        render();
    }
}
function handleBlur(e){
    render();
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
function render_gpa(gpa){
    const gpaDiv = document.querySelector(".gpa-display");

    gpaDiv.innerHTML = `
        <h2>Current GPA</h2>
        <p>${gpa.toFixed(2)}</p>
    `;

    gpaDiv.style.display = "flex"; 
}


function render(){
    row.innerHTML = "";

    state.subjects.forEach((subject,i) => {
        const table_row = document.createElement("tr");

        columns.forEach((col) => {
            if(col.type == "derived"){
                let td = document.createElement("td");

                switch(col.key){

                    case "cat1weightage":
                        subject.cat1weightage = catWeightage(subject.cat1);
                        td.textContent = subject.cat1weightage;
                        break;

                    case "cat2weightage":
                        subject.cat2weightage = catWeightage(subject.cat2);
                        td.textContent = subject.cat2weightage;
                        break;

                    case "fatweightage":
                        subject.fatweightage = fatWeightage(subject.fat);
                        td.textContent = subject.fatweightage;
                        break;

                    case "total":
                        subject.total =
                            subject.cat1weightage +
                            subject.cat2weightage +
                            subject.fatweightage +
                            subject.da1 +
                            subject.da2 +
                            subject.da3;

                        td.textContent = subject.total;
                        break;

                    case "gradepoint":
                        subject.gradepoint =
                            gradePoint(subject.grade) * subject.courseCredits;

                        td.textContent = subject.gradepoint;
                        break;
                }

                table_row.append(td);
            }

            else if(col.type == "input"){

                let td = document.createElement("td");
                const input = document.createElement("input");

                input.dataset.row = i;
                input.dataset.key = col.key;
                input.type = col.inputType;
                input.value = subject[col.key] ?? "";

                if(col.inputType === "number"){
                    input.min = 0;

                    if(col.key === "cat1" || col.key === "cat2"){
                        input.max = 50;
                    }

                    if(col.key === "fat"){
                        input.max = 100;
                    }

                    if(col.key === "da1" || col.key === "da2" || col.key === "da3"){
                        input.max = 10;
                    }

                    input.addEventListener("keydown", function(e){
                        if(e.key === "-" || e.key === "e"){
                            e.preventDefault();
                        }
                    });
                }

                if(col.key === "grade"){
                    input.style.textTransform = "uppercase";
                }

                input.addEventListener("input",handleInputs);
                input.addEventListener("keydown", handleKeyPress);
                input.addEventListener("blur",handleBlur);

                td.append(input);
                table_row.append(td);
            }
            else if(col.label == "Course"){
                let td = document.createElement("td");
                td.textContent = subject.courseName;
                table_row.append(td);
            }

            else if(col.type === "action"){
                let td = document.createElement("td");
                const btn = document.createElement("button");

                btn.textContent = "❌";
                btn.classList.add("delete-btn");

                btn.addEventListener("click", function(){
                    deleteCourse(i);
                });

                td.append(btn);
                table_row.append(td);
            }


        });

        row.appendChild(table_row);
    });

    saveToLocalStorage();
}



form.addEventListener("click",addCourse)
