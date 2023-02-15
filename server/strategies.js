var fs = require('fs')
var path = require('path')
var {db, closeConnection, insert, createIndex, cehckIfExist, remove} = require('./commons/dbManager.js')
var feedbackItem = require('./commons/feedbackItem.js')
var {ProgrammingExercise} = require('programming-exercise-juezlti')
var fillFile = require('./commons/fill.js')
require('dotenv').config()

const strategies = [];
const compileErros = ["Output Limit Exceeded",
    "Memory Limit Exceeded",
    "Time Limit Exceeded",
    "Invalid Function",
    "Runtime Error",
    "Compile Time Error",
    "Invalid Submission",
    "Program Size Exceeded",
    "Presentation Error"
]

const FCG = async(programmingExercise, evaluation_report, student_file, feedback_already_reported, resolve, full_report, reject) => {

    if (full_report.request.program != student_file.program) {

        try {
            let allFeedbacks = await Promise.all(strategies.map(s => 
                s.getFeedback(evaluation_report, programmingExercise, student_file)));
            var feedback = new feedbackItem("hmm...", 100, "error", -1);
            var allFeedbacksSorted = []
            if (allFeedbacks.length > 0) {

                for (let f of allFeedbacks) {
                    if (Array.isArray(f)) {
                        allFeedbacks.push(...f);
                    }
                }
                allFeedbacks = allFeedbacks.filter((v) => {
                    return !Array.isArray(v);
                })

                allFeedbacksSorted = allFeedbacks.sort(feedbackItem.compare)
                while (true) {
                    feedback = allFeedbacksSorted[0]
                    if (feedback_already_reported[allFeedbacksSorted[0].name] == undefined) {
                        break;
                    }
                    if (feedback_already_reported[allFeedbacksSorted[0].name].includes(allFeedbacksSorted[0].text)) {
                        allFeedbacksSorted.shift()
                        if (allFeedbacksSorted.length == 0) {
                            feedback = new feedbackItem("hmm... I already give to you all feedbacks", 100, "error", -1);
                            break;
                        }
                    } else {
                        break;
                    }
                }
            }
            persist_feedback(evaluation_report, student_file.student_id, feedback.name, feedback.text, feedback_id => {
                persist_report(feedback_id, full_report);
            });
            resolve(feedback.text);
        } catch (err) {
            console.log(err)
            reject(err)
        }
    } else {
        resolve(`Your current submission is exactly the previous one. Please try to think carefully before sending your answer.`);
    }
}

function readStrategiesAndStart() {
    let files = fs.readdirSync(path.join(__dirname, "/strategies"));
    files.forEach(file =>
        strategies.push(require(path.join(__dirname, "/strategies", file))));
}

function applyStrategies(input, student_file, feedback_already_reported, resolve, reject, full_report) {
    ProgrammingExercise.deserialize(path.join(__dirname, "../public/zip"), `${input.exercise}.zip`).
    then((programmingExercise) => {
        FCG(programmingExercise, input, student_file, feedback_already_reported, resolve, full_report, reject)
    }).catch((err) => {
        ProgrammingExercise
            .loadRemoteExercise(input.exercise, {
                'BASE_URL': process.env.BASE_URL,
                'EMAIL': process.env.EMAIL,
                'PASSWORD': process.env.PASSWORD,
            })
            .then(async(programmingExercise) => {
                    FCG(programmingExercise, input, student_file, feedback_already_reported, resolve, full_report, reject)
                    programmingExercise.serialize(path.join(__dirname, "../public/zip"), `${input.exercise}.zip`)
                }
            ).catch((err) => {
                console.log(err)
                console.log("error at  function applyStrategies when loadRemoteExercise  ");
                reject(err)
            });
    })
}

module.exports = {
getBestFeedback:function getBestFeedback(input, student_id, full_report) {
    return new Promise((resolve, reject) => {
        console.log("input.classify " + full_report.summary.classify)
        const isWrongBecauseOfACompilationProblem = compileErros.includes(full_report.summary.classify);
        const isCorrect = full_report.summary.classify == "Accepted";

        console.log("isCorrect " + isCorrect)
        console.log("isWrongBecauseOfACompilationProblem " + isWrongBecauseOfACompilationProblem)

        if (!isCorrect && !isWrongBecauseOfACompilationProblem){
            console.log("Errado e nao foi erro de compilacao")

            if (strategies.length == 0) {
                readStrategiesAndStart()
            }

            fillFile(student_id, input.exercise, input.tests.length).then(
                (data) => {
                    //console.log("DADOS")
                    //console.log(data)
                    applyStrategies(input, data.student_file, data.feedback_already_reported, resolve, reject, full_report)

                }).catch((err) => {
                //console.log(err)
                //console.log("error in function getBestFeedback")
                reject();

            });
            
        } else if (isCorrect) {
            //console.log("Correto")
            let feedback_text = "Congratulations!!!! you have submitted the correct answer";

            let number_of_correct_tests = [];

            [...Array(input.number_of_tests)].forEach((el, index) => {
                number_of_correct_tests.push(`${index}`);
            });


            persist_feedback(input, student_id, "Congratulations", feedback_text, feedback_id => {
                persist_report(feedback_id, full_report);
            });
            resolve(feedback_text);
        } else if (isWrongBecauseOfACompilationProblem) {
            //console.log("erro de compilacao")
            let evaluation_report = {
                "exercise": input.exercise,
                "compilationErrors": [],
                "number_of_tests": input.number_of_tests,
                "tests": []
            }

            persist_feedback(evaluation_report, student_id, full_report.summary.classify, full_report.summary.feedback, feedback_id => {
                persist_report(feedback_id, full_report);
            });
            resolve(full_report.summary.feedback);
        }
    })
},

remove_feedback:function remove_feedback(obj, callback) {
    let rmv = () => {
        remove(obj).then(() => {
            // console.log(result)
            closeConnection();
            if (callback != undefined) {
                callback();
            }
        });
    }

    db(() => {
        cehckIfExist("feedbacks").then(
            () => {
                rmv();
            }
        ).catch((err) => {
            console.log(err);
        })
    }, "feedbacks");
},

remove_report:function remove_report(obj, callback) {
    let rmv = () => {
        remove(obj).then(() => {
            // console.log(result)
            closeConnection();
            if (callback != undefined) {
                callback();
            }
        });
    }
    db(() => {
        cehckIfExist("reports").then(
            () => {
                rmv();
            }
        ).catch((err) => {
            console.log(err);
        })
    }, "reports");
}
}

function persist_report(feedback_id, full_report, callback) {
    let ins = () => {
        insert({
            "feedback_id": feedback_id,
            "full_report": full_report,
            "reported_time": Date.now()
        }).then((inserted_id) => {
            // console.log(inserted_id)
            closeConnection();
            if (callback != undefined) {
                callback(inserted_id);
            }

        });
    }
    db(() => {
        cehckIfExist("reports").then(
            (flag) => {
                //console.log(flag);
                if (!flag) {
                    createIndex({
                        feedback_id: 1
                    }).then(() => {
                        ins();
                    })
                } else {
                    ins();
                }
            }
        ).catch((err) => {
            //try writing even without created indexes
            console.log(err);
            ins();
        })
    }, "reports");
}

function persist_feedback(evaluation_report, student_id, feedback_name, feedback_text, callback) {
    let ins = () => {
        insert({
                "student_id": student_id,
                "exercise_id": evaluation_report.exercise,
                "correct_tests": (evaluation_report.tests.map((value, index) => { if (value == "Accepted") return index })).filter((value) => { return value != undefined ? true : false }),
                "incorrect_tests": (evaluation_report.tests.map((value, index) => { if (value != "Accepted") return index })).filter((value) => { return value != undefined ? true : false }),
                "feedback_text": feedback_text,
                "feedback_name": feedback_name,
                "reported_time": Date.now()
            }

        ).then((inserted_id) => {
            //console.log(inserted_id)
            closeConnection();
            if (callback != undefined) {
                callback(inserted_id);
            }

        });
    }

    db(() => {
        cehckIfExist("feedbacks").then(
            (flag) => {
                // console.log(flag);
                if (!flag) {
                    createIndex({
                        student_id: 1,
                        exercise_id: 1
                    }).then(() => {
                        ins();
                    })
                } else {
                    ins();
                }
            }
        ).catch((err) => {
            //try writing even without created indexes
            console.log(err);
            ins();
        })
    }, "feedbacks");
}