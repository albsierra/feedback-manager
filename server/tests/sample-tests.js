import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import report from './report';
import reportValue from 'mochawesome/addContext'
import { loadSchemaYAPEXIL, ProgrammingExercise } from "programming-exercise-juezlti";
import { performance } from 'perf_hooks';
import fillFile from '../commons/fill';
import feedbackItem from '../commons/feedbackItem'


var programmingExercise;
var strategies = [];
const defineTestSuiteAndAddTests = async(suite, Test, suiteInstance) => {
    await loadSchemaYAPEXIL();
    strategies = [];
    let files = fs.readdirSync(path.join(__dirname, "..", process.env.STRATEGIES_FOLDER));
    files.forEach(file =>
        strategies.push(require(path.join(__dirname, "..", process.env.STRATEGIES_FOLDER, file))));



    programmingExercise = await ProgrammingExercise
        .loadRemoteExercise(report.request.learningObject, {
            'BASE_URL': process.env.BASE_URL,
            'EMAIL': process.env.EMAIL,
            'PASSWORD': process.env.PASSWORD,
        })


    var start = performance.now();

    let data = await fillFile(report.reply.report.user_id, report.reply.report.exercise, report.reply.report.number_of_tests);
    var end = performance.now();
    var DBaccessCoast = (end - start)

    const parentSuiteName = suite(`Threshold time testing -${Math.random() * 10000}- `)

    timingTestStrategies(Test, suiteInstance, parentSuiteName, data.student_file, data.feedback_already_reported, DBaccessCoast);


}
const timingTestStrategies = (Test, suiteInstance, parentSuite, student_file, feedback_already_reported, DBaccessCost) => {
    var testSuite = suiteInstance.create(parentSuite, `-${ Math.random() * 10000 } - `);
    testSuite.dispose();

    //Strategies check time
    strategies.forEach(strategy => {
        testSuite.addTest(new Test(`Validate if feedback "${strategy.feedback_name}" finish earlier  than ${strategy.feedback_time} ms`, async() => {
            var start = performance.now();

            const allFeedbacks = await Promise.all(strategies.map(s => s.getFeedback(report.reply.report, programmingExercise, student_file)));
            var feedback = new feedbackItem("hmm...", 100, "error", -1);
            var allFeedbacksSorted = []
            if (allFeedbacks.length > 0) {
                allFeedbacksSorted = allFeedbacks.sort(feedbackItem.compare)
                while (true) {
                    feedback = allFeedbacksSorted[0]
                    if (feedback_already_reported[allFeedbacksSorted[0].name] == undefined) {
                        break;
                    }

                    if (feedback_already_reported[allFeedbacksSorted[0].name].includes(allFeedbacksSorted[0].text)) {

                        allFeedbacksSorted.shift()
                        if (allFeedbacksSorted.length == 0) {
                            var feedback = new feedbackItem("hmm... I already give to you all feedbacks", 100, "error", -1);
                            break;
                        }


                    } else {
                        break;
                    }

                }

            }

            var end = performance.now();
            var final = (end - start) + DBaccessCost;

            reportValue(this, `Execution time: ${final} ms`)

            expect(final).to.be.lessThan(strategy.feedback_time);

        }))
    })





}


module.exports = { defineTestSuiteAndAddTests }