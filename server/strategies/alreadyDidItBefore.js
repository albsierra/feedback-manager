var feedbackItem = require('../commons/feedbackItem')

const feedback_name = "alreadyDidItBefore";
const feedback_time = 200;
module.exports = {
    "feedback_name": feedback_name,
    "feedback_time": feedback_time,
    "getFeedback": async(report, exercise, student_file) => {

        let feedback = ""
        let target = []
        feedback = ""
        if (student_file.already_solved) {
            feedback = `You have already solved this exercise. Maybe try to review your old code submitted at ${(new Date(student_file.date_of_already_solved_exercise))}`;
        } else {
            feedback = "You never have solved this exercise. Keep Calm and code on \n\n";
        }
        return (new feedbackItem(feedback, 1, "INF", target, feedback_name))
    }
}