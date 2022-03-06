import feedbackItem from '../commons/feedbackItem';
import { ProgrammingExercise } from "programming-exercise-juezlti";

const feedback_name = "hint";
const feedback_time = 1;
module.exports = {
    "feedback_name": feedback_name,
    "feedback_time": feedback_time,
    "getFeedback": async(report, exercise, student_file) => {

        let feedback = ""
        let target = []
        Object.keys(report.compilationErrors).forEach(function(key) {
            feedback += `input : ${exercise.tests[key].input} -- output: ${exercise.tests[key].output} -- hint: ${exercise.tests[key].feedback.message} `;
            feedback += "\r\n";
            target.push(key)
        });

        return (new feedbackItem(feedback, 1, "INF", target, feedback_name))


    }


}