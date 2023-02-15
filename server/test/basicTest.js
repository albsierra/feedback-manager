var assert = require('assert')
var { loadSchemaYAPEXIL } = require("programming-exercise-juezlti");

var { getBestFeedback, remove_feedback, remove_report } = require('../strategies')
var correctReport = require('./reportExamples/correct.json')
var halfCorrectReport = require('./reportExamples/halfcorrect.json')

describe('BasicTest', () => {
    describe("Addition", () => {
        it("1 plus 1 equals 2", () => {
            var result = 1 + 1
            assert.equal(result, 2)
        })
    })

    describe("Correct Answer", () => {
        
        before(async () => {
            await loadSchemaYAPEXIL();
            await getBestFeedback(correctReport.reply.report, correctReport.request.studentID, correctReport)
            .then((feedback) => {
                correctReport.summary.feedback = feedback
            })

        })

        it("Both tests right feedback", () => {
            let expectedFeedback = "Congratulations!!!! you have submitted the correct answer"
            assert.equal(correctReport.summary.feedback, expectedFeedback)
        })

    })

    describe("Half Correct Answer", () => {
        
        before(async () => {
            await loadSchemaYAPEXIL();
            await getBestFeedback(halfCorrectReport.reply.report, halfCorrectReport.request.studentID, halfCorrectReport)
            .then((feedback) => {
                console.log("FEEDBACK:")
                console.log(feedback)
                halfCorrectReport.summary.feedback = feedback
            })
        })

        it("One test right, one test wrong feedback", (done) => {
            let expectedFeedback = "Congratulations!!!! you have submitted the correct answer"
            assert.equal(halfCorrectReport.summary.feedback, expectedFeedback)
        })

    })
})