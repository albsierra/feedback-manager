var expect = require('chai')
var fs = require("fs")
var path = require("path")
var report = require('./report')
var reportValue = require('mochawesome/addContext.js')
var {loadSchemaYAPEXIL, ProgrammingExercise} = require("programming-exercise-juezlti")
var performance = require('perf_hooks')
var fillFile = require('../commons/fill.js')
var feedbackItem = require('../commons/feedbackItem.js')
var {persist_feedback, persist_report} = require('../strategies.js')
require('dotenv').config()

var feedbacks_id_list = []
var reports_id_list = []
var programmingExercise;
var strategies = [];


const defineTestSuiteAndAddTests = async(suite, Test, suiteInstance, type) => {
    // reports_id_list = []
    // feedbacks_id_list = []
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

    if (type == 1) {
        const parentSuiteName = suite(`Threshold time testing -${Math.random() * 10000}- `)

        const start = performance.now();
        console.log("Inicio")
        const data = await fillFile(report.request.studentID, report.reply.report.exercise, report.reply.report.number_of_tests);
        console.log("Fim")
        const end = performance.now();
        const DBaccessCoast = (end - start)
        timingTestStrategies(Test, suiteInstance, parentSuiteName, data.student_file, data.feedback_already_reported, DBaccessCoast);

    } else
    if (type == 2) {
        const parentSuiteName = suite(`scalableStrategiesTest -${Math.random() * 10000}- `)
        scalableStrategiesTest(Test, suiteInstance, parentSuiteName);
    }
}

const timingTestStrategies = (Test, suiteInstance, parentSuite, student_file, feedback_already_reported, DBaccessCost) => {
    const testSuite = suiteInstance.create(parentSuite, `-${Math.random() * 10000} - `);
    testSuite.dispose();
    //Strategies check time
    strategies.forEach(strategy => {
        testSuite.addTest(new Test(`Validate if feedback "${strategy.feedback_name}" finish earlier  than ${strategy.feedback_time} ms`, async() => {
            const start = performance.now();
            await (strategy.getFeedback(report.reply.report, programmingExercise, student_file));
            const end = performance.now();
            const final = (end - start) + DBaccessCost;
            reportValue(this, `Execution time: ${final} ms`)
            expect(final).to.be.lessThan(strategy.feedback_time);
        }))
    })

}

const scalableStrategiesTest = (Test, suiteInstance, parentSuite) => {
    const testSuite = suiteInstance.create(parentSuite, `-${Math.random() * 10000} - `);
    let feedback_list = []
    let feedback = undefined;
    testSuite.dispose();
    testSuite.addTest(new Test(`Validating the scaling of feedback items`, async() => {

        const fn = async() => {
            feedback = undefined;
            let data = await fillFile(report.request.studentID, report.reply.report.exercise, report.reply.report.number_of_tests);
            let allFeedbacksSorted = await Promise.all(strategies.map(s => s.getFeedback(report.reply.report, programmingExercise, data.student_file)))
            allFeedbacksSorted = allFeedbacksSorted.sort(feedbackItem.compare).filter(element => { return element !== undefined })
            while (true) {
                feedback = allFeedbacksSorted[0]

                if (data.feedback_already_reported[feedback.name] == undefined) {
                    break
                } else if (data.feedback_already_reported[feedback.name].includes(feedback.text)) {
                    allFeedbacksSorted.shift()
                } else if (allFeedbacksSorted.length == 0) {
                    break;
                } else {
                    break;
                }
            }
            if (feedback != undefined) {
                feedback_list.push(feedback)
                persist_feedback(report.reply.report, report.request.studentID, feedback.name, feedback.text, feedback_id => {
                    console.log("inserido feedback")
                    feedbacks_id_list.push(feedback_id)
                    persist_report(feedback_id, report, report_id => {
                        reports_id_list.push(report_id)
                            console.log("inserido report")
                        fn();
                    });
                });
            }
        }
        await fn();
    }));
}

module.exports = { defineTestSuiteAndAddTests, feedbacks_id_list, reports_id_list }