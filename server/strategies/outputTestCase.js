var feedbackItem = require('../commons/feedbackItem')

const feedback_name = "outputTestCase";
const feedback_time = 200;

module.exports = {
    "feedback_name": feedback_name,
    "feedback_time": feedback_time,
    getFeedback: async(report, exercise, student_file) => {
        try {
            let feedback = "The correct results would be:\n"
            const incorrect_tests = (report.tests.map((value, index) => { if (value.classify != "Accepted") return index })).filter((value) => { return value != undefined ? true : false });
            incorrect_tests.forEach(function(key) {
                feedback += report.tests[key].expectedOutput
                feedback += "\n";
            });
            return (new feedbackItem(feedback, 5, "INF", incorrect_tests, feedback_name))
        } catch (err) {
            console.log(err);
            return err
        }
    }
}