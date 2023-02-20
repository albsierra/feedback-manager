var assert = require('assert')
var { loadSchemaYAPEXIL } = require("programming-exercise-juezlti");

var { getBestFeedback, remove_feedback, remove_report } = require('../strategies')
var PEAR_tests_all_ok = require('./reportExamples/PEAR_tests_all_ok.json')
var PEAR_tests_all_wrong = require('./reportExamples/PEAR_tests_all_wrong.json')
var PEAR_tests_compile_error = require('./reportExamples/PEAR_tests_compile_error.json')
var PEAR_tests_first_wrong = require('./reportExamples/PEAR_tests_first_wrong.json')
var PEAR_tests_five_wrong = require('./reportExamples/PEAR_tests_five_wrong.json')


describe("Correct Tests", function(){
    this.timeout(5000)
    before(async function(){
        await loadSchemaYAPEXIL();  
    })

    it("All tests right feedback", async function(){
        await getBestFeedback(PEAR_tests_all_ok.reply.report, PEAR_tests_all_ok.request.studentID, PEAR_tests_all_ok)
        .then(function(feedback){
            remove_feedback({_id: feedback[1]})
            remove_report({_id: feedback[2]}, true)
            let expectedFeedback = "Congratulations!!!! you have submitted the correct answer"
            assert.equal(feedback[0], expectedFeedback)
        })
    })

})

describe("Wrong Tests", function(){
    this.timeout(5000)
    before(async function(){
        await loadSchemaYAPEXIL();
    })

    it("Compilation error", async function(){
        var expectedFeedback = "Command failed: javac /tmp/compiled2023114-745-12jc9mo.2fs/Signos.java\n/tmp/compiled2023114-745-12jc9mo.2fs/Signos.java:14: error: ';' expected\n\t\tif(ano <0) ano++\n\t\t                ^\n1 error\n"
        await getBestFeedback(PEAR_tests_compile_error.reply.report, PEAR_tests_compile_error.request.studentID, PEAR_tests_compile_error)
        .then((feedback) => {
            remove_feedback({_id: feedback[1]})
            remove_report({_id: feedback[2]}, true)     
            assert.equal(feedback[0], expectedFeedback)
        })
    })

    it("First time submitting a wrong answer", async function(){
        var expectedFeedback = "You have never solved this exercise. Keep Calm and code on \n\n"
        await getBestFeedback(PEAR_tests_all_wrong.reply.report, PEAR_tests_all_wrong.request.studentID, PEAR_tests_all_wrong)
        .then((feedback) => {
            remove_feedback({_id: feedback[1]})
            remove_report({_id: feedback[2]}, true)
            assert.equal(feedback[0], expectedFeedback)
        })
    })

    it("New submision equal to previous attempt", async function(){
        var expectedFeedback = "Your current submission is exactly the previous one. Please try to think carefully before sending your answer."
        await getBestFeedback(PEAR_tests_all_wrong.reply.report, PEAR_tests_all_wrong.request.studentID, PEAR_tests_all_wrong)
        .then(async function(feedback){
            await getBestFeedback(PEAR_tests_all_wrong.reply.report, PEAR_tests_all_wrong.request.studentID, PEAR_tests_all_wrong)
            .then(function(newFeedback){
                remove_feedback({_id: feedback[1]})
                remove_report({_id: feedback[2]}, true)
                assert.equal(newFeedback[0], expectedFeedback)
            })
        })
    })

    it("Better attempt", async function(){
        var expectedFeedback = 'You improved!!. In the last submission, you got 8 test case right, now you got test case 9. Congratulations '
        await getBestFeedback(PEAR_tests_first_wrong.reply.report, PEAR_tests_first_wrong.request.studentID, PEAR_tests_first_wrong)
        .then(async function(feedback){
            PEAR_tests_first_wrong.request.program = "Test"
            PEAR_tests_first_wrong.reply.report.tests[0].classify = "Accepted"
            await getBestFeedback(PEAR_tests_first_wrong.reply.report, PEAR_tests_first_wrong.request.studentID, PEAR_tests_first_wrong)
            .then(function(newFeedback){
                removeFromDB(feedback[1], feedback[2], newFeedback[1], newFeedback[2])
                assert.equal(newFeedback[0], expectedFeedback)
            })
        })
    })

    it("Worse attempt", async function(){
        var expectedFeedback = 'Hey, take care. The last submission passed more test cases than this current submission'
        await getBestFeedback(PEAR_tests_five_wrong.reply.report, PEAR_tests_five_wrong.request.studentID, PEAR_tests_five_wrong)
        .then(function(feedback){
            PEAR_tests_five_wrong.request.program = "Test"
            PEAR_tests_five_wrong.reply.report.tests[2].classify = "Wrong Answer"
            getBestFeedback(PEAR_tests_five_wrong.reply.report, PEAR_tests_five_wrong.request.studentID, PEAR_tests_five_wrong)
            .then(async function(newFeedback){
                removeFromDB(feedback[1], feedback[2], newFeedback[1], newFeedback[2])
                assert.equal(newFeedback[0], expectedFeedback)
            })
        })
    })
})

function removeFromDB(feedback1, report1, feedback2, report2){
    remove_feedback({_id: feedback1})
    remove_report({_id: report1})
    remove_feedback({_id: feedback2})
    remove_report({_id: report2}, true)
}