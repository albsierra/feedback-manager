var feedbackItem = require('../commons/feedbackItem')

const HINTS = [
    "work harder !!",
    "never give up on your dreams !!",
    "get real !!"
];
const feedback_name = "motivateHarder";
const feedback_time = 200;

module.exports = {
    "feedback_name": feedback_name,
    "feedback_time": feedback_time,
    "getFeedback": async(report, exercise, student_file) => {
        const some = Math.floor(Math.random() * HINTS.length);
        const relevance = Math.floor(Math.random() * 2);
        const item = new feedbackItem(HINTS[some], 6, "APO", -1, feedback_name);
        return item;
    }
};