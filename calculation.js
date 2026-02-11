function gradePoint(grade){
    switch (grade.toLowerCase()){
        case "s":
            return 10;
        case "a":
            return 9;
        case "b":
            return 8;
        case "c":
            return 7; 
        case "d":
            return 6; 
        default:
            return 0;
    }
}
function catWeightage(c){
    return (c/50)*15;
}
function fatWeightage(f){
    return (f/100)*40;
}