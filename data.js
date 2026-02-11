let state = {
    subjects :[]
}

let columns = [
    { label: "Course", key: "courseName", type: "static" },
    { label: "Cat-1", key: "cat1", type: "input", inputType: "number" },
    { label: "Cat-1-Weightage", key: "cat1weightage", type: "derived" },
    { label: "Cat-2", key: "cat2", type: "input", inputType: "number" },
    { label: "Cat-2-Weightage", key: "cat2weightage", type: "derived" },
    { label: "DA-1", key: "da1", type: "input", inputType: "number" },
    { label: "DA-2", key: "da2", type: "input", inputType: "number" },
    { label: "DA-3", key: "da3", type: "input", inputType: "number" },
    { label: "FAT", key: "fat", type: "input", inputType: "number" },
    { label: "FAT-Weightage", key: "fatweightage", type: "derived" },
    { label: "Total", key: "total", type: "derived" },   // move this up
    { label: "Grade", key: "grade", type: "input", inputType: "text" },
    { label: "Grade-Points", key: "gradepoint", type: "derived" }
];