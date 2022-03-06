import feedbackItem from '../commons/feedbackItem';


const feedback_name = "inputTestCase";
const feedback_time = 1;
module.exports = {
    "feedback_name": feedback_name,
    "feedback_time": feedback_time,
    "getFeedback": async(report, exercise) => {

        try {
            let feedback = ""
            let target = []
            Object.keys(report.compilationErrors).forEach(function(key) {
                feedback += JSON.stringify(exercise.tests_contents_in[exercise.tests[key].id]);
                feedback += "\n";
                target.push(key)
            });

            return (new feedbackItem(feedback, 1, "INF", target, feedback_name))
        } catch (err) {
            console.log(err)
            return (err);
        }

    }


}