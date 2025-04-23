function findWeightedScale(name) {
    let scale = 5;
    if(name.includes("Adv")) {
        scale = 5.5;
    } else if(name.includes("AP")) {
        scale = 6;
    }
    return scale;
}

function findUnweightedScale(grade) {
    if(grade >= 90) {
        return 4;
    } else if(grade >= 80) {
        return 3;
    } else if(grade >= 70) {
        return 2;
    } else if(grade >= 60) {
        return 1;
    } else {
        return 0;
    }
}

function findCumulativeWeightedScale(courseCode) {
    let scale = 5;
    if(courseCode.startsWith("0310") || 
       courseCode.startsWith("0322") || 
       courseCode.startsWith("030") || 
       courseCode.startsWith("0358")) {
        scale = 5.5;
    } else if(courseCode.includes("A") || courseCode.includes("N")) {
        scale = 6;
    }
    return scale;
}

export const findCurrentWeighted = (data) => {
    let total = 0;
    let gpa = 0;
    let numClasses = 0;
    data[`q${data.currentQuarter}`].map((course) => {
        if(course.grade) {
            if(Number(course.grade) > 0) {
                total += findWeightedScale(course.name) - Math.round(100 - Number(course.grade)) / 10;
                numClasses++;
            }
        }
    })

    gpa = (total / numClasses).toFixed(3);
    if(gpa) {
        return gpa;
    } else {
        return 0.000;
    }
}

export const findCurrentUnweighted = (data) => {
    let total = 0;
    let gpa = 0;
    let numClasses = 0;

    data[`q${data.currentQuarter}`].map((course) => {
        if(course.grade) {
            if(Number(course.grade) > 0) {
                total += findUnweightedScale(Number(course.grade));
                numClasses++;
            }
        }
    })

    gpa = (total / numClasses).toFixed(3);
    if(gpa) {
        return gpa;
    } else {
        return 0.000;
    }
}

export const findCumulativeWeighted = (data) => {
    let total = 0;
    let gpa = 0;
    let numOfClasses = 0;

    data.transcript.map((schoolYear) => {
        //THIS NEEDS TO BE CHANGED AS IT IS ONLY LOOKING AT TRANSCRIPT
        schoolYear.courses.map((course) => {
            let grade = Number(course.sem1Grade);
            if(grade) {
                total += findCumulativeWeightedScale(course.courseCode) - Math.round(100 - grade) / 10;
                console.log(course.courseName + ": " + findCumulativeWeightedScale(course.courseCode))
                numOfClasses++;
            }
            grade = Number(course.sem2Grade);
            if(grade) {
                total += findCumulativeWeightedScale(course.courseCode) - Math.round(100 - grade) / 10;
                numOfClasses++;
            }
        })
    })

    gpa = (total / numOfClasses).toFixed(3);
    if(gpa) {
        return gpa;
    } else {
        return 0.000;
    }
}