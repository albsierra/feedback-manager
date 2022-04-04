import feedbackItem from '../commons/feedbackItem';

const feedback_name = "frequemcy";
const feedback_time = 200;
module.exports = {
    "feedback_name": feedback_name,
    "feedback_time": feedback_time,
    "getFeedback": async(report, exercise, student_file) => {



        let feedback = ""
        let target = [];

        (student_file.most_frequent_correct_test_case.sort()).forEach((element, index) => {
            feedback += `The test case ${index} has  ${(element / student_file.number_of_submissions) * 100}% of acceptance \n`
        });


        (student_file.most_frequent_incorrect_test_case.sort()).forEach((element, index) => {
            feedback += `The test case ${index} has  ${(element / student_file.number_of_submissions) * 100}% of rejection \n`
        });


        return (new feedbackItem(feedback, 1, "INF", target, feedback_name))


    }


}