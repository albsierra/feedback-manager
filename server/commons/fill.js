import { db, findWithCriteria } from './dbManager';


export default (student_id, exercise_id, number_of_tests) => {


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
                let most_frequent_incorrect_test_case = []
                let most_frequent_correct_test_case = []

                let aux = [...Array(number_of_tests).keys()];
                aux.forEach(element => {
                    most_frequent_incorrect_test_case[element.toString()] = 0
                    most_frequent_correct_test_case[element.toString()] = 0

                });

                records.forEach(element => {

                    if (feedback_already_reported[element.feedback_name] == undefined)
                        feedback_already_reported[element.feedback_name] = []

                    feedback_already_reported[element.feedback_name].push(element.feedback_text)

                    number_of_submissions = number_of_submissions + 1;

                    if (element.number_of_correct_tests.length == element.number_of_tests)
                        already_solved = true

                    element.number_of_incorrect_tests.forEach(element => {
                        most_frequent_incorrect_test_case[element] = most_frequent_incorrect_test_case[element] + 1
                    })


                    element.number_of_correct_tests.forEach(element => {
                        most_frequent_correct_test_case[element] = most_frequent_incorrect_test_case[element] + 1
                    })


                });

                student_file.student_id = student_id
                student_file.number_of_submissions = number_of_submissions
                student_file.already_solved = already_solved
                student_file.most_frequent_incorrect_test_case = most_frequent_incorrect_test_case
                student_file.most_frequent_correct_test_case = most_frequent_correct_test_case


                resolve({ "feedback_already_reported": feedback_already_reported, "student_file": student_file });


            });
        }, "feedbacks").catch((error) => {
            console.log("error {}")
            reject(error)
        });


    })


}