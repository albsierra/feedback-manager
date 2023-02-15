var feedbackItem = require('../commons/feedbackItem')


const feedback_name = "inputTestCase";
const feedback_time = 200;
module.exports = {
    "feedback_name": feedback_name,
    "feedback_time": feedback_time,
    "getFeedback": async(report, exercise, student_file) => {

        try {
            let feedback = "Test evaluation was performed using the following inputs:\n"
            let target = [];
            const incorrect_tests = (report.tests.map((value, index) => { if (value.classify != "Accepted") return index })).filter((value) => { return value != undefined ? true : false });
            incorrect_tests.forEach(function(key) {
                feedback += JSON.stringify(exercise.tests_contents_in[exercise.tests[key].id]);
                feedback += "\n";
                target.push(key)
            });

            return (new feedbackItem(feedback, 5, "INF", target, feedback_name))
        } catch (err) {
            console.log(err)
            return (err);
        }

    }


}