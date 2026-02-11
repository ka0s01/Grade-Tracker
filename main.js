const form = document.getElementById("form")
let row = document.getElementById("row-insert")
function addCourse(e){
    if(e.target.dataset.action=="add"){
        let name = document.getElementById("course-name").value;
        let credits = document.getElementById("course-credits").value;
        state.subjects.push({
            courseName: name,
            courseCredits:credits,
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

        })
        render()
    }
}
function handleInputs(e){
    const input = e.target;
    const row = parseInt(input.dataset.row); 
    const key = input.dataset.key;
    const value = input.type === "number" ? parseFloat(input.value) || 0 : input.value;
    
    state.subjects[row][key] = value;  
}
function handleKeyPress(e){
    if(e.key === "Enter"){
        
        render();
    }
}
function handleBlur(e){
    render();
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
                
                input.style.border = "2px solid red";
                input.style.minWidth = "100px";
                input.style.backgroundColor = "yellow";
                td.append(input);
                table_row.append(td);

                

            }
            else if (col.label=="Course"){
                let td = document.createElement("td");
                td.textContent=subject.course_name;
                table_row.append(td);
            }

        })
        row.appendChild(table_row);


    })
}


form.addEventListener("click",addCourse)
