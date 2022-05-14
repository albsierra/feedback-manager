import feedbackItem from '../commons/feedbackItem';

const HINTS = [
    "work harder",
    "never give up on your dreams",
    "get real"
];
const feedback_name = "percentage";
const feedback_time = 200;
module.exports = {


    "feedback_name": feedback_name,
    "feedback_time": feedback_time,
    getFeedback: async(report, exercise, student_file) => {
        if (report.tests != undefined && report.tests.length > 0) {
            const nWrong = (report.tests.map((value, index) => { return value.classify == "Accepted" ? 1 : 0 })).reduce((partialSum, a) => partialSum + a, 0);

            const percentage = (nWrong / report.tests.length);

            const item = new feedbackItem(` The exercise is ${percentage * 100}% correct `, 1, "INF", -1, feedback_name);

            return item;
        } else {
            return new feedbackItem(``, 0, "INF", -1, feedback_name);

        }

    }
};