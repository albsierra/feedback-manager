// routes/index.js and users.js
import express from "express";
import { getBestFeedback, remove_feedback, remove_report } from '../strategies'
import { defineTestSuiteAndAddTests, reports_id_list, feedbacks_id_list } from '../tests/sample-tests';
import { loadSchemaYAPEXIL } from "programming-exercise-juezlti";
import moment from 'moment-timezone';
import path, { format } from 'path'
var router = express.Router();

router.get("/feedback/performance/:intent", async(req, res) => {
    var intent = req.params.intent;
    delete require.cache[require.resolve('mocha')];
    var Mocha = require('mocha');
    const currentDateTime = moment().tz('Portugal').format('YYYY/MM/DD/HH/mm/ss');
    const reportDirectory = path.resolve(__dirname, `../../public/execution-report/${currentDateTime}`)
    var mocha = new Mocha({
        timeout: 200000,
        reporter: 'mochawesome',
        reporterOptions: {
            reportDir: reportDirectory,
            reportTitle: "Test Execution Report",
            reportPageTitle: "Test Report",
            charts: true
        }
    });
    mocha.cleanReferencesAfterRun(true)
    var suite = (suiteName = `-${Math.random() * 10000}-`) => Mocha.Suite.create(mocha.suite, suiteName);
    let result = await defineTestSuiteAndAddTests(suite, Mocha.Test, Mocha.Suite, intent);


    mocha.run((failures) => {
        setTimeout(() => {
            if (intent == 2) {
                console.log("intent == 2")
                const r = (call, i) => {
                    if (feedbacks_id_list[i] != undefined) {
                        console.log("removendo feedback" + feedbacks_id_list[i] + "--" + i)
                        remove_feedback({ _id: feedbacks_id_list[i] }, () => {
                            i = i + 1;
                            call(call, i)
                        })
                    } else {
                        res.redirect(`/execution-report/${currentDateTime}/mochawesome.html`)

                    }

                }
                const v = (call, i) => {
                    if (reports_id_list[i] != undefined) {
                        console.log("removendo report" + reports_id_list[i] + "--" + i)
                        remove_report({ _id: reports_id_list[i] }, () => {
                            i = i + 1;
                            call(call, i)
                        })
                    } else {

                        r(r, 0);
                    }

                }

                v(v, 0);

            } else {
                console.log("intent == 1")
                res.redirect(`/execution-report/${currentDateTime}/mochawesome.html`)
            }
        }, 3000)


    }).catch((err) => {
        console.log(err);
        res.sendStatus(500);
    });


});


router.get("/configuration", async(req, res) => {
    let config = JSON.parse(req.body)
    Object.keys(config).forEach(function(key) {
        process.env[key] = jsonData[key];
    });


});
router.post("/", async function(req, res) {
    await loadSchemaYAPEXIL();
    var input = req.body //JSON.parse();
    if (input) {
        if (input.reply.report) {
            getBestFeedback(input.reply.report, input.request.studentID, input).then((feedback) => {
                if (("summary" in input) == false) {
                    input.summary = {}
                }
                input.summary.feedback = feedback
                res.json(input);
            }).catch((error) => {
                console.log(error)
                res.status(500).send(error)
            });

        } else {
            res.status(400).send(new Error('Wrong PEARL object received by feedback.'));
        }
    }

});


export default router;