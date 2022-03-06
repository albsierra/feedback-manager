import { suite, Test, suiteInstance } from '../mocha-setup'
import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import report from './report';
import reportValue from 'mochawesome/addContext'
import { loadSchemaYAPEXIL, ProgrammingExercise } from "programming-exercise-juezlti";
import { performance } from 'perf_hooks';
import fillFile from '../commons/fill';


var programmingExercise;
var strategies = [];
const defineTestSuiteAndAddTests = async() => {
    await loadSchemaYAPEXIL();

    let files = fs.readdirSync(path.join(__dirname, "..", process.env.STRATEGIES_FOLDER));
    files.forEach(file =>
        strategies.push(require(path.join(__dirname, "..", process.env.STRATEGIES_FOLDER, file))));



    programmingExercise = await ProgrammingExercise
        .loadRemoteExercise(report.request.learningObject, {
            'BASE_URL': process.env.BASE_URL,
            'EMAIL': process.env.EMAIL,
            'PASSWORD': process.env.PASSWORD,
        })


    const parentSuiteName = suite('Threshold time testing')
    timingTestBD(parentSuiteName);
    timingTestStrategies(parentSuiteName);


}




const timingTestBD = (parentSuite) => {
    const testSuite = suiteInstance.create(parentSuite, ' MongoDB access time to all instances of form {student_id, exercise_id}');
    //BD check time
    testSuite.addTest(new Test(` {201800388,fd286cb3-5c95-4b0e-b843-56bc058a7713}`, async() => {
        var start = performance.now();
        fillFile("201800388", "fd286cb3-5c95-4b0e-b843-56bc058a7713").then((data) => {
            var end = performance.now();
            var final = end - start;
            reportValue(this, `Execution time: ${final} ms`)
            expect(final).to.be.lessThan(2);
        }).catch((err) => {
            console.log(err)
            res.send(err);

        })
    }))
}

const timingTestStrategies = (parentSuite) => {
    const testSuite = suiteInstance.create(parentSuite, ' First Class of Feedback');

    //Strategies check time
    strategies.forEach(strategy => {

        testSuite.addTest(new Test(`Validate if feedback "${strategy.feedback_name}" finish earlier  than ${strategy.feedback_time} ms`, async() => {
            var start = performance.now();
            let feedbackItem = await strategy.getFeedback(report.reply.report, programmingExercise)
            var end = performance.now();
            var final = end - start;
            reportValue(this, `Execution time: ${final} ms`)
            expect(final).to.be.lessThan(strategy.feedback_time);

        }))
    })





}


module.exports = { defineTestSuiteAndAddTests }