import fs from 'fs'
import path from 'path'
import { db, closeConnection, insert, removeAll, findWithCriteria, cehckIfExist } from './commons/dbManager'
import feedbackItem from './commons/feedbackItem'
import { loadSchemaYAPEXIL, ProgrammingExercise } from "programming-exercise-juezlti";
import StudentFile from "./model/studentFile"
import fillFile from './commons/fill';

const strategies = [];
const cache = [];
const FCG = async(programmingExercise, evaluation_report, student_file, feedback_already_reported, resolve) => {

    const allFeedbacks = await Promise.all(strategies.map(s => s.getFeedback(evaluation_report, programmingExercise, student_file)));
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
    persist(evaluation_report, feedback.name, feedback.text);
    resolve(feedback.text);

}



function readStrategiesAndStart() {
    let files = fs.readdirSync(path.join(__dirname, process.env.STRATEGIES_FOLDER));
    files.forEach(file =>
        strategies.push(require(path.join(__dirname, process.env.STRATEGIES_FOLDER, file))));

}

export function getBestFeedback(input) {
    return new Promise((resolve, reject) => {
        if (strategies.length == 0) {
            readStrategiesAndStart()
        }
        fillFile(input.user_id, input.exercise, input.number_of_tests).then(
            (data) => {

                applyStrategies(input, data.student_file, data.feedback_already_reported, resolve, reject)

            }).catch((err) => {
            console.log(err)
            console.log("error in function getBestFeedback")
            reject();

        })

    })



}

function applyStrategies(input, student_file, feedback_already_reported, resolve, reject) {

    if (cache.includes(input.exercise)) {
        ProgrammingExercise.deserialize(path.join(__dirname, "../public/zip"), `${input.exercise}.zip`).
        then((programmingExercise) => {
            FCG(programmingExercise, input, student_file, feedback_already_reported, resolve)
        }).catch((err) => {
            console.log(err)
            reject("The learning object request is already in cache but was not possible to read")
        })

    } else {
        cache.push(input.exercise)
        loadSchemaYAPEXIL().then(() => {
            ProgrammingExercise
                .loadRemoteExercise(input.exercise, {
                    'BASE_URL': process.env.BASE_URL,
                    'EMAIL': process.env.EMAIL,
                    'PASSWORD': process.env.PASSWORD,
                })
                .then(async(programmingExercise) => {
                        FCG(programmingExercise, input, student_file, feedback_already_reported, resolve)
                        programmingExercise.serialize(path.join(__dirname, "../public/zip"), `${input.exercise}.zip`)
                    }

                ).catch((err) => {
                    console.log(err)
                    console.log("erro at  function applyStrategies when loadRemoteExercise  ");
                    resolve(null)
                });
        }).catch((err) => {
            console.log(err)
            console.log("erro at  function applyStrategies when loadSchemaYAPEXIL  ");
            resolve(null)
        })
    }
}

function persist(evaluation_report, feedback_name, feedback_text, callback) {

    db(() => {
        insert(

            {
                "student_id": evaluation_report.user_id,
                "compilationErrors": evaluation_report.compilationErrors,
                "number_of_tests": evaluation_report.number_of_tests,
                "number_of_correct_tests": evaluation_report.number_of_correct_tests,
                "number_of_incorrect_tests": evaluation_report.number_of_incorrect_tests,
                "feedback_text": feedback_text,
                "feedback_name": feedback_name,
                "reported_time": Date.now()
            }


        ).then(() => {
            if (callback != undefined) {
                callback();
            }
            closeConnection();
        });
    }, `exercise_${evaluation_report.exercise}`);








}