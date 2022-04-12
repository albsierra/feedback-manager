import feedbackItem from '../commons/feedbackItem';
import { ProgrammingExercise } from "programming-exercise-juezlti";

const feedback_name = "hint";
const feedback_time = 100;
module.exports = {
    "feedback_name": feedback_name,
    "feedback_time": feedback_time,
    "getFeedback": async(report, exercise, student_file) => {

        let feedback = ""
        let target = []
        const incorrect_tests = (report.tests.map((value, index) => { if (value != "Accepted") return index })).filter((value) => { return value != undefined ? true : false });

        incorrect_tests.forEach(function(key) {
            if (exercise.tests[key].feedback != undefined) {
                feedback += ` -- hint: ${exercise.tests[key].feedback.message} `;
                feedback += "\r\n";
                target.push(key)
            } else {
                feedback += ":(";
                feedback += "\r\n";
                target.push(key)
            }

        });

        return (new feedbackItem(feedback, 1, "INF", target, feedback_name))


    }


}