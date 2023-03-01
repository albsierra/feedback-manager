var feedbackItem = require('../commons/feedbackItem')

const feedback_name = "hint";
const feedback_time = 100;
module.exports = {
    "feedback_name": feedback_name,
    "feedback_time": feedback_time,
    "getFeedback": async(report, exercise, student_file) => {
        if (report.tests != undefined && report.tests.length > 0) {
            let feedbacks = []
            if(exercise != null){
                const incorrect_tests = (report.tests.map((value, index) => { if (value.classify != "Accepted") return index })).filter((value) => { return value != undefined ? true : false });
                incorrect_tests.forEach(function(key) {
                    if (exercise.tests[key].feedback != undefined) {
                        if (Symbol.iterator in Object(exercise.tests[key].feedback)) {
                            for (let h of exercise.tests[key].feedback) {
                                let feedback = `Hint:\n${h.message} `;
                                feedbacks.push(new feedbackItem(feedback, 1, "INF", -1, feedback_name))
                            }
                        }
                    }
                })
            }else{
                let feedback = await `Hint:\n${report.hint}`;
                feedbacks.push(new feedbackItem(feedback, 1, "INF", -1, feedback_name))
            }
            return feedbacks;
        } else {
            return new feedbackItem(``, 0, "INF", -1, feedback_name);
        }
    }
}