import feedbackItem from '../commons/feedbackItem';

const feedback_name = "gotBetter";
const feedback_time = 1;
module.exports = {
    "feedback_name": feedback_name,
    "feedback_time": feedback_time,
    "getFeedback": async(report, exercise, student_file) => {
        if (student_file.last_feedback_reported != undefined) {
            let feedback = ""

            let current_number_of_correct_tests_case = 0
            let old_number_of_correct_tests_case = student_file.last_feedback_reported.correct_tests.length
            report.tests.forEach(element => {
                if (element.mark) {
                    current_number_of_correct_tests_case++;
                }
            });
            if (old_number_of_correct_tests_case == current_number_of_correct_tests_case) {

                feedback = `You don't make any improvements between the last submission and the current one. However, don't give up!! You can `;

            } else if (old_number_of_correct_tests_case < current_number_of_correct_tests_case) {
                feedback = `You improved!!. In the last submission, you got ${old_number_of_correct_tests_case
                    } test case right, now you got test case ${current_number_of_correct_tests_case}. Congratulations `;
            } else {
                feedback = `Hey, take care. The last submission passed more test cases than this current submission`;

            }



            return (new feedbackItem(feedback, 1, "INF", -1, feedback_name))
        }



    }


}