
import feedbackItem from '../commons/feedbackItem';
import { db, closeConnection, insert, removeAll, findWithCriteria } from '../commons/dbManager';

import { loadSchemaYAPEXIL, ProgrammingExercise } from "programming-exercise-juezlti";



module.exports = {
    getFeedback: (report) => {
        return new Promise((resolve, reject) => {

            loadSchemaYAPEXIL().then(async () => {
                ProgrammingExercise
                    .loadRemoteExercise(report.exercise, {
                        'BASE_URL': process.env.BASE_URL,
                        'EMAIL': process.env.EMAIL,
                        'PASSWORD': process.env.PASSWORD,
                    })
                    .then((programmingExercise) => {
                        //TODO crate this user id in the report obj
                        /* 
                        The following code tries to give feedback that was not given before.
                        To achieve this goal first is needed to get all the previous feedback reported
                        Then the code compares the current wrong cases to see what feedback is passive to report
                        after eliminating the wrong cases that the code already report the first one is selected.
                        */
                        db(() => {

                            findWithCriteria({ "user_id": report.user_id, "exercise_id": report.exercise }).then((records) => {
                                const wrong_cases = []
                                for (var key in report.compilationErrors) {
                                    wrong_cases.push(key)
                                }
                                const already_shown = []

                                for (var record in records) {
                                    already_shown.push(record.test_case)
                                }
                                const not_shown_yet = wrong_cases.filter((element) => {
                                    return (!already_shown.includes(element))
                                });
                                console.log("not_shown_yet")
                                console.log(not_shown_yet)
                                console.log(programmingExercise.tests[not_shown_yet[0]].feedback)
                                const feedback = programmingExercise.tests[not_shown_yet[0]].feedback
                                closeConnection();
                                resolve(new feedbackItem(feedback, 1000, "assertive", not_shown_yet[0]))
                            });
                        }).catch((error) => {
                            console.log(error)
                            console.log("LearningObj not found or could not be loaded at hint.js ");
                            reject(error)
                        });
                       

                    });



            })

        })


    }
};