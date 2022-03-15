// routes/index.js and users.js
import express from "express";
import { getBestFeedback } from '../strategies'
import { defineTestSuiteAndAddTests } from '../tests/sample-tests';
import Mocha from 'mocha';
import moment from 'moment-timezone';
import path from 'path'

var router = express.Router();

router.get("/feedback/performance", async(req, res) => {
    delete require.cache[require.resolve('mocha')];
    require('mocha');
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
    var suite = (suiteName = 'Suite Name') => Mocha.Suite.create(mocha.suite, suiteName);
    await defineTestSuiteAndAddTests(suite, Mocha.Test, Mocha.Suite);
    mocha.run((failures) => {


        res.redirect(`/execution-report/${currentDateTime}/mochawesome.html`)

    }).catch((err) => {
        console.log(err);
        res.sendStatus(500);
    });
})

router.get("/configuration", async(req, res) => {
    //todo public encryption to decode body 
    let config = JSON.parse(req.body)
    Object.keys(config).forEach(function(key) {
        process.env[key] = jsonData[key];
    });


});
router.post("/", function(req, res) {
    const input = JSON.parse(req.body.PEARL);
    let feedback = "";
    if (input) {
        if (input.reply.report) {


            getBestFeedback(input.reply.report, input.request.studentID, input).then((feedback) => {
                console.log(feedback)
                res.send(feedback);
            }).catch((error) => {
                console.log(error)
                res.sendStatus(500)
            });

        } else {
            res.sendStatus(500);
        }
    } else {
        console.log("Compilation error.");
        res.send("Compilation error. You should try to verify if the XPath expression that you submit is correct.");
    }


});


export default router;