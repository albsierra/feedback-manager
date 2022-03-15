import feedbackItem from '../commons/feedbackItem';

const feedback_name = "submissionNumbers";
const feedback_time = 1;
module.exports = {
    "feedback_name": feedback_name,
    "feedback_time": feedback_time,
    "getFeedback": async(report, exercise, student_file) => {

        let feedback = ""
        let target = []

        feedback = `Total numbers of submissions until now: ${student_file.number_of_submissions} `;


        return (new feedbackItem(feedback, -1, "INF", target, feedback_name))


    }


}