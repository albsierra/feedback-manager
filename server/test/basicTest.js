var assert = require('assert')
var { loadSchemaYAPEXIL } = require("programming-exercise-juezlti");

var { getBestFeedback, remove_feedback, remove_report } = require('../strategies')
var PEAR_tests_all_ok = require('./reportExamples/PEAR_tests_all_ok.json')
var PEAR_tests_all_wrong = require('./reportExamples/PEAR_tests_all_wrong.json')
var PEAR_tests_compile_error = require('./reportExamples/PEAR_tests_compile_error.json')


describe("Correct Tests", () => {
    
    before(async function(){
        await loadSchemaYAPEXIL();
        let feedback = await getBestFeedback(PEAR_tests_all_ok.reply.report, PEAR_tests_all_ok.request.studentID, PEAR_tests_all_ok)
        PEAR_tests_all_ok.summary.feedback = feedback[0]
        remove_feedback({_id: feedback[1]})
        remove_report({_id: feedback[2]})            
    })

    it("All tests right feedback", function(){
            let expectedFeedback = "Congratulations!!!! you have submitted the correct answer"
            assert.equal(PEAR_tests_all_ok.summary.feedback, expectedFeedback)
    })

})

describe("Wrong Tests", () => {

    beforeEach(async function(){
        await loadSchemaYAPEXIL();
    })

    it("Compilation error", async function(){
        let expectedFeedback = PEAR_tests_compile_error.summary.feedback    
        await getBestFeedback(PEAR_tests_compile_error.reply.report, PEAR_tests_compile_error.request.studentID, PEAR_tests_compile_error)
        .then((feedback) => {
            remove_feedback({_id: feedback[1]})
            remove_report({_id: feedback[2]})     
            assert.equal(feedback[0], expectedFeedback)
        })
    })

    it("First time submitting a wrong answer", async function(){
        await getBestFeedback(PEAR_tests_all_wrong.reply.report, PEAR_tests_all_wrong.request.studentID, PEAR_tests_all_wrong)
        .then((feedback) => {
            remove_feedback({_id: feedback[1]})
            remove_report({_id: feedback[2]})
            let expectedFeedback = "You never have solved this exercise. Keep Calm and code on \n\n"
            assert.equal(feedback[0], expectedFeedback)
        })
    })

    it("New submision equal to previous attempt", async function(){
        await getBestFeedback(PEAR_tests_all_wrong.reply.report, PEAR_tests_all_wrong.request.studentID, PEAR_tests_all_wrong)
        .then(function(feedback){
            getBestFeedback(PEAR_tests_all_wrong.reply.report, PEAR_tests_all_wrong.request.studentID, PEAR_tests_all_wrong)
            .then((newFeedback) => {
                remove_feedback({_id: feedback[1]})
                remove_report({_id: feedback[2]})
                let expectedFeedback = "Your current submission is exactly the previous one. Please try to think carefully before sending your answer."
                assert.equal(newFeedback[0], expectedFeedback)
            })
        })
    })
})