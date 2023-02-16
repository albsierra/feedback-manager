var assert = require('assert')
var { loadSchemaYAPEXIL } = require("programming-exercise-juezlti");

var { getBestFeedback, remove_feedback, remove_report } = require('../strategies')
var PEAR_tests_all_ok = require('./reportExamples/PEAR_tests_all_ok.json')
var PEAR_tests_all_wrong = require('./reportExamples/PEAR_tests_all_wrong.json')
var PEAR_tests_compile_error = require('./reportExamples/PEAR_tests_compile_error.json')

describe('BasicTest', () => {
    
    describe("Correct Tests", () => {
        
        before(async() => {
            await loadSchemaYAPEXIL();
            let feedback = await getBestFeedback(PEAR_tests_all_ok.reply.report, PEAR_tests_all_ok.request.studentID, PEAR_tests_all_ok)
            PEAR_tests_all_ok.summary.feedback = feedback[0]
            await remove_feedback({_id: feedback[1]})
            await remove_report({_id: feedback[2]})
        })

        it("All tests right feedback", async () => {
                let expectedFeedback = "Congratulations!!!! you have submitted the correct answer"
                assert.equal(PEAR_tests_all_ok.summary.feedback, expectedFeedback)
        }).timeout(5000)

    })

   /*  describe("Wrong Tests", () => {

        it("First time submitting a wrong answer", async () => {
            await loadSchemaYAPEXIL();
            await getBestFeedback(PEAR_tests_all_wrong.reply.report, PEAR_tests_all_ok.request.studentID, PEAR_tests_all_ok)
            .then((feedback) => {
                let expectedFeedback = "Congratulations!!!! you have submitted the correct answer"
                assert.equal(feedback[0], expectedFeedback)
            })
        })

    }) */
/*
    describe("Compilation Error", () => {

        it("Compilation error feedback unchanged (store in BD only)", async () => {
            let expectedFeedback = PEAR_tests_compile_error.summary.feedback
            await loadSchemaYAPEXIL();          
            await getBestFeedback(PEAR_tests_compile_error.reply.report, PEAR_tests_compile_error.request.studentID, PEAR_tests_compile_error)
            .then((feedback) => {                
                PEAR_tests_compile_error.summary.feedback = feedback
                assert.equal(PEAR_tests_compile_error.summary.feedback, expectedFeedback)
            })
        })

    }) */
})