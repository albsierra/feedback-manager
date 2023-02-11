//import { db, findWithCriteria } from './dbManager.js';
var {db, findWithCriteria} = require('./dbManager.js');


module.exports = (student_id, exercise_id, number_of_tests) => {
    return new Promise((resolve, reject) => {
        db(() => {
            findWithCriteria({
                "student_id": student_id,
                "exercise_id": exercise_id
            }).then((records) => {
                let student_file = {}
                let feedback_already_reported = {}

                let number_of_submissions = 0
                let already_solved = false
                let date_of_already_solved_exercise = 0
                let incorrect_test_case_frequency = []
                let correct_test_case_frequency = []
                let last_feedback_reported = undefined
                let aux = [...Array(number_of_tests).keys()];
                aux.forEach(element => {
                    incorrect_test_case_frequency[element.toString()] = 0
                    correct_test_case_frequency[element.toString()] = 0

                });

                records.forEach(element => {

                    if (last_feedback_reported == undefined)
                        last_feedback_reported = element
                    else
                    if (new Date(element.reported_time) > new Date(last_feedback_reported.reported_time))
                        last_feedback_reported = element


                    if (feedback_already_reported[element.feedback_name] == undefined)
                        feedback_already_reported[element.feedback_name] = []

                    feedback_already_reported[element.feedback_name].push(element.feedback_text)

                    number_of_submissions = number_of_submissions + 1;


                    if (element.correct_tests.length == number_of_tests) {
                        already_solved = true
                        date_of_already_solved_exercise = element.reported_time
                    }


                    element.incorrect_tests.forEach(element => {
                        incorrect_test_case_frequency[element] = incorrect_test_case_frequency[element] + 1
                    })


                    element.correct_tests.forEach(element => {
                        correct_test_case_frequency[element] = correct_test_case_frequency[element] + 1
                    })


                });
                student_file.student_id = student_id
                student_file.number_of_submissions = number_of_submissions
                student_file.already_solved = already_solved
                student_file.date_of_already_solved_exercise = date_of_already_solved_exercise
                student_file.incorrect_test_case_frequency = incorrect_test_case_frequency
                student_file.correct_test_case_frequency = correct_test_case_frequency
                student_file.last_feedback_reported = last_feedback_reported
                console.log(student_file)
                if (student_file.last_feedback_reported != undefined) {
                    console.log("Last feedback nao undefined")
                    db(() => {
                        findWithCriteria({
                            "feedback_id": last_feedback_reported._id,
                        }).then((record) => {
                            student_file.program = record[0].full_report.request.program
                            resolve({ "feedback_already_reported": feedback_already_reported, "student_file": student_file });
                        })

                    }, "reports")
                } else {
                    console.log("Last feedback undefined")
                    console.log(last_feedback_reported)
                    resolve({ "feedback_already_reported": feedback_already_reported, "student_file": student_file });
                }

            });
        }, "feedbacks");


    })


}