export function findWeightedScale(name) {
    let scale = 5;
    if(name.includes("Adv")) {
        scale = 5.5;
    } else if(name.includes("AP")) {
        scale = 6;
    }
    return scale;
}

export function findUnweightedScale(grade) {
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

export function findCumulativeWeightedScale(courseCode) {
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

    // // this is a list of all the weighted scales for each class so it can be saved
    // let weightedScales = [{gradeLevel: data.student.grade, courses: []}];

    // // add the current grade level to the weightedScales list if it does not already exist
    // let index = weightedScales.findIndex((year) => year.gradeLevel == data.student.grade);
    // if(index == -1) {
    //     weightedScales.push({gradeLevel: data.student.grade, courses: []});
    //     index = weightedScales.length - 1;
    // }

    data[`q${data.currentQuarter}`].map((course) => {
        let scale = findWeightedScale(course.name);
        // if the scales already exist, then use the existing scale
        if(data.scales) {
            data.scales.map((year, i) => {
                if(year.gradeLevel == data.student.grade) {
                    year.courses.map((c) => {
                        if(c.name == course.name) {
                            scale = c.scale;
                        }
                    })
                }
            })
        }

        let credit = 0.5; // assuming each course is worth 0.5 credits (semester based)

        // if the credits already exist, then use the existing credits
        if(data.credits) {
            data.credits.map((year) => {
                if(year.gradeLevel == data.student.grade) {
                    year.credits.map((c) => {
                        if(c.name == course.name) {
                            credit = c.credit;
                        }
                    })
                }
            })
        }

        if(course.grade) {
            if(Number(course.grade) > 0) {
                const grade = course.grade > 100 ? 100 : course.grade;
                total += (scale - Math.round(100 - Number(grade)) / 10) * credit;
                numClasses += credit;
            }
        }
    })

    // if the scales are already present, then nothing in order to not duplicate the scales
    // if(data.scales) {
    //     if(data.scales[index]) {
    //         weightedScales = [];
    //     }
    // }

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

    // this is a list of all the weighted scales for each class so it can be saved
    let weightedScales = [];
    let credits = [];

    function calculateQuarter(quarter) {
        // add the current grade level to the weightedScales list if it does not already exist
        let scalesIndex = weightedScales.findIndex((year) => year.gradeLevel == data.student.grade);
        if(scalesIndex == -1) {
            weightedScales.push({gradeLevel: data.student.grade, courses: []});
            index = weightedScales.length - 1;
        }

        // add the current grade level to the credits list if it does not already exist
        let creditsIndex = credits.findIndex((year) => year.gradeLevel == data.student.grade);
        if(creditsIndex == -1) {
            credits.push({gradeLevel: data.student.grade, credits: []});
            creditsIndex = credits.length - 1;
        }

        quarter.map((course) => {
            let scale = findWeightedScale(course.name);
            // if the scales already exist, then use the existing scale
            if (data.scales) {
                // Find the correct year by gradeLevel
                const scaleYear = data.scales.find(
                    (year) => year.gradeLevel === data.student.grade
                );
                if (scaleYear) {
                    const scaleCourse = scaleYear.courses.find(
                        (c) => c.name === course.name
                    );
                    if (scaleCourse) {
                        scale = scaleCourse.scale;
                    }
                }
            }

            // add to weightedScales list if not already present
            weightedScales[scalesIndex].courses.push({name: course.name, scale: scale});

            let credit = 0.5; // assuming each course is worth 0.5 credits (semester based)

            // if the credits already exist, then use the existing credits
            if(data.credits) {
                data.credits.map((year) => {
                    if(year.gradeLevel == data.student.grade) {
                        year.credits.map((c) => {
                            if(c.name == course.name) {
                                credit = c.credit;
                            }
                        })
                    }
                })
            }

            // add to credits list if not already present
            credits[creditsIndex].credits.push({name: course.name, credit: credit});

            if(course.grade) {
                if(Number(course.grade) > 0) {
                    const grade = course.grade > 100 ? 100 : course.grade;
                    total += (scale - Math.round(100 - Number(grade)) / 10) * credit;
                    numOfClasses += credit;
                }
            }
        })
    }

    function calculateSemester(quarter1, quarter2) {
        // add the current grade level to the weightedScales list if it does not already exist
        let scalesIndex = weightedScales.findIndex((year) => year.gradeLevel == data.student.grade);
        if(scalesIndex == -1) {
            weightedScales.push({gradeLevel: data.student.grade, courses: []});
            scalesIndex = weightedScales.length - 1;
        }

        // add the current grade level to the credits list if it does not already exist
        let creditsIndex = credits.findIndex((year) => year.gradeLevel == data.student.grade);
        if(creditsIndex == -1) {
            credits.push({gradeLevel: data.student.grade, credits: []});
            creditsIndex = credits.length - 1;
        }

        quarter2.map((course, index) => {
            if(course.grade) {
                // round the grades to the nearest integer and cap it at 100
                const quarter1Grade = Math.round(Number(quarter1[index].grade)) > 100 ? 100 : Math.round(Number(quarter1[index].grade));
                const quarter2Grade = Math.round(Number(course.grade)) > 100 ? 100 : Math.round(Number(course.grade));

                let average = 0;

                if(course.grade > 0) {
                    average = Math.round((quarter1Grade + quarter2Grade) / 2);
                }
                else {
                    average = Math.round(quarter1Grade);
                }
                
                let scale = findWeightedScale(course.name);
                // if the scales already exist, then use the existing scale
                if (data.scales) {
                    // Find the correct year by gradeLevel
                    const scaleYear = data.scales.find(
                        (year) => year.gradeLevel === data.student.grade
                    );
                    if (scaleYear) {
                        const scaleCourse = scaleYear.courses.find(
                            (c) => c.name === course.name
                        );
                        if (scaleCourse) {
                            scale = scaleCourse.scale;
                        }
                    }
                }

                weightedScales[scalesIndex].courses.push({name: course.name, scale: scale});

                let credit = 0.5; // assuming each course is worth 0.5 credits (semester based)

                // if the credits already exist, then use the existing credits
                if(data.credits) {
                    data.credits.map((year) => {
                        if(year.gradeLevel == data.student.grade) {
                            year.credits.map((c) => {
                                if(c.name == course.name) {
                                    credit = c.credit;
                                }
                            })
                        }
                    })
                }

                // add to credits list if not already present
                credits[creditsIndex].credits.push({name: course.name, credit: credit});

                total += (scale - Math.round(100 - Number(average)) / 10) * credit;
                numOfClasses += credit;
            }
        })
    }

    //console.log(JSON.stringify(data.credits))

    data.transcript.slice(1).map((schoolYear) => {
        if(schoolYear.gradeLevel != data.student.grade) {
            weightedScales.push({gradeLevel: schoolYear.gradeLevel, courses: []});
            credits.push({gradeLevel: schoolYear.gradeLevel, credits: []});
            const scalesIndex = weightedScales.length - 1;
            const creditsIndex = credits.length - 1;
            schoolYear.courses.map((course) => {
                const sem1Grade = Number(course.sem1Grade);      
                const sem2Grade = Number(course.sem2Grade);          
                let scale = findCumulativeWeightedScale(course.courseCode);

                // if the scales already exist, then use the existing scale
                if(data.scales) {
                    data.scales.map((year) => {
                        if(year.gradeLevel == schoolYear.gradeLevel) {
                            year.courses.map((c) => {
                                if(c.name == course.courseName) {
                                    scale = c.scale;
                                }
                            })
                        }
                    })
                }

                // add to weightedScales list if not already present
                weightedScales[scalesIndex].courses.push({name: course.courseName, scale: scale});

                let credit = Number(course.credit); // the transcript already has the credit value

                // if the credits already exist, then use the existing credits
                if(data.credits) {
                    data.credits.map((year) => {
                        if(year.gradeLevel == schoolYear.gradeLevel) {
                            year.credits.map((c) => {
                                if(c.name == course.courseName) {
                                    credit = c.credit;
                                }
                            })
                        }
                    })
                }

                // add to credits list if not already present
                credits[creditsIndex].credits.push({name: course.courseName, credit: credit});

                if(sem1Grade && sem2Grade) {
                    total += (scale - Math.round(100 - sem1Grade) / 10) * (credit / 2);
                    total += (scale - Math.round(100 - sem2Grade) / 10) * (credit / 2);
                    numOfClasses += 0.5;
                    numOfClasses += 0.5;
                } else {
                    total += (scale - Math.round(100 - sem1Grade) / 10) * credit;
                    numOfClasses += credit;
                }
            })
        }
    })

    if(data.currentQuarter == 1) {
        calculateQuarter(data.q1);
    } else if(data.currentQuarter == 2) {
        calculateSemester(data.q1, data.q2);
    } else if(data.currentQuarter == 3) {
        calculateSemester(data.q1, data.q2);
        calculateQuarter(data.q3);
    } else if(data.currentQuarter == 4) {
        calculateSemester(data.q1, data.q2);
        calculateSemester(data.q3, data.q4);
    }

    // if the scales are already present, then return the existing scales and credits so it remains unchanged 
    // (if scales are present, that means credits are also present)
    if(data.scales) {
        // even if scales are present, we still need to check whether the last item in the scales are the same as the scales which was just calculated
        // (after the schoolyear, the names of the courses will change as they are removed from current grades and found in transcript)
        // this is checked by comparing the name of the first course present in each set of scales
        if(data.scales.at(-1).courses[0].name == weightedScales.at(-1).courses[0].name) {
            weightedScales = data.scales;
            credits = data.credits;
        }
    }

    gpa = (total / numOfClasses).toFixed(3);
    if(gpa) {
        return [gpa, weightedScales, credits];
    } else {
        return [0.000, weightedScales, credits];
    }
}

export const findCumulativeUnweighted = (data) => {
    let total = 0;
    let gpa = 0;
    let numOfClasses = 0;

    function calculateQuarter(quarter) {
        quarter.map((course) => {
            if(course.grade) {
                if(Number(course.grade) > 0) {
                    total += findUnweightedScale(Number(course.grade));
                    numOfClasses++;
                }
            }
        })
    }

    function calculateSemester(quarter1, quarter2) {
        quarter2.map((course, index) => {
            if(course.grade) {
                const quarter1Grade = Math.round(Number(quarter1[index].grade));
                const quarter2Grade = Math.round(Number(course.grade));

                let average = 0;

                if(course.grade > 0) {
                    average = Math.round((quarter1Grade + quarter2Grade) / 2);
                }
                else {
                    average = Math.round(quarter1Grade);
                }

                
                if(average > 100) {
                    average = 100;
                }

                let credit = 0.5; // assuming each course is worth 0.5 credits (semester based)

                // if the credits already exist, then use the existing credits
                if(data.credits) {
                    data.credits.map((year) => {
                        if(year.gradeLevel == data.student.grade) {
                            year.credits.map((c) => {
                                if(c.name == course.name) {
                                    credit = c.credit;
                                }
                            })
                        }
                    })
                }

                total += findUnweightedScale(Number(average)) * credit;
                numOfClasses += credit;
            }
        })
    }

    data.transcript.slice(1).map((schoolYear) => {
        //THIS NEEDS TO BE CHANGED AS IT IS ONLY LOOKING AT TRANSCRIPT
        if(schoolYear.gradeLevel != data.student.grade) {
            schoolYear.courses.map((course) => {
                let grade = Number(course.sem1Grade);

                let credit = Number(course.credit); // the transcript already has the credit value

                // if the credits already exist, then use the existing credits
                if(data.credits) {
                    data.credits.map((year) => {
                        if(year.gradeLevel == schoolYear.gradeLevel) {
                            year.credits.map((c) => {
                                if(c.name == course.courseName) {
                                    credit = c.credit;
                                }
                            })
                        }
                    })
                }

                if(grade) {
                    total += findUnweightedScale(grade) * (credit / 2);
                    numOfClasses += credit / 2;
                }
                grade = Number(course.sem2Grade);
                if(grade) {
                    total += findUnweightedScale(grade) * (credit / 2);
                    numOfClasses += credit / 2;
                }
            })
        }
    })

    if(data.currentQuarter == 1) {
        calculateQuarter(data.q1);
    } else if(data.currentQuarter == 2) {
        calculateSemester(data.q1, data.q2);
    } else if(data.currentQuarter == 3) {
        calculateSemester(data.q1, data.q2);
        calculateQuarter(data.q3);
    } else if(data.currentQuarter == 4) {
        calculateSemester(data.q1, data.q2);
        calculateSemester(data.q3, data.q4);
    }

    gpa = (total / numOfClasses).toFixed(3);
    if(gpa) {
        return gpa;
    } else {
        return 0.000;
    }
}