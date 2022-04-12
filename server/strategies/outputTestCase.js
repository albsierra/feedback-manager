import feedbackItem from '../commons/feedbackItem';


const feedback_name = "outputTestCase";
const feedback_time = 200;
module.exports = {

    "feedback_name": feedback_name,
    "feedback_time": feedback_time,
    getFeedback: async(report, exercise, student_file) => {
        try {
            let feedback = ""
            let target = []
            const incorrect_tests = (report.tests.map((value, index) => { if (value != "Accepted") return index })).filter((value) => { return value != undefined ? true : false });

            incorrect_tests.forEach(function(key) {
                feedback += exercise.tests_contents_out[exercise.tests[key].id];
                feedback += "\n";
                target.push(key)
            });
            return (new feedbackItem(feedback, 1, "INF", target, feedback_name))
        } catch (err) {
            console.log(err);
            return err
        }





    }


}