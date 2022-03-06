import feedbackItem from '../commons/feedbackItem';

const HINTS = [
    "work harder",
    "never give up on your dreams",
    "get real"
];
const feedback_name = "percentage";
const feedback_time = 100;
module.exports = {


    "feedback_name": feedback_name,
    "feedback_time": feedback_time,
    getFeedback: async(report, exercise) => {


        const percentage = report.compilationErrors.length / report.number_of_tests;

        const item = new feedbackItem(percentage.toString(), 1, "INF", -1, feedback_name);

        return item;
    }
};