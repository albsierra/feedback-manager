var feedbackItem = require('../commons/feedbackItem')

const feedback_name = "testCasePassed";
const feedback_time = 200;

module.exports = {
    "feedback_name": feedback_name,
    "feedback_time": feedback_time,
    "getFeedback": async(report, exercise, student_file) => {
        let feedback = ""
        let current_number_of_correct_tests_case = 0
        report.tests.forEach(element => {
            if (element.mark) {
                current_number_of_correct_tests_case++;
            }
        });

        if (current_number_of_correct_tests_case == 0) {
            feedback = `Your submission did not pass any test case. `

        } else if (current_number_of_correct_tests_case < 1) {
            feedback = `Your submission passed ${current_number_of_correct_tests_case} test case. Keep trying until you got all. `

        } else {
            feedback = `Your submission passed ${current_number_of_correct_tests_case} test cases. Keep trying until you got all. `

        }
        return (new feedbackItem(feedback, 1, "INF", -1, feedback_name))
    }
}