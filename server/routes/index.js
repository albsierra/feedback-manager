// routes/index.js and users.js
import express from "express";
import { getBestFeedback } from '../strategies'
import fillFile from '../commons/fill';

import fs from 'fs'
import { runMochaTests } from '../mocha-setup';
import { defineTestSuiteAndAddTests } from '../tests/sample-tests';

var router = express.Router();
// ..stuff below
const match = (array, substring) => {

    let result = false;
    array.find((element) => {


        if (element == ("impossibleToEvaluate")) {
            result = true;
        }
    });
    return result;
}
router.get("/test", (req, res) => {
    fillFile("201800388", "2").then((data) => {
        res.send(data);
    }).catch((err) => {
        console.log(err)
        res.send(err);

    })
})
router.get("/feedback/performance", async(req, res) => {
    await defineTestSuiteAndAddTests();
    const result = await runMochaTests()
    res.send("end");
})

router.post("/", function(req, res) {
    const input = JSON.parse(req.body.PEARL);
    let feedback = "";

    if (input) {
        if (input.reply.report) {
            if (input.reply.report.compilationErrors.length > 0) {
                {
                    getBestFeedback(input.reply.report).then((feedback) => {
                        console.log(feedback)
                        res.send(feedback);
                    }).catch((error) => {
                        console.log(error)
                        res.sendStatus(500)
                    });
                }
            } else {
                res.send("Correct answer");
            }
        } else {
            res.sendStatus(500);
        }
    } else {
        console.log("Compilation error.");
        res.send("Compilation error. You should try to verify if the XPath expression that you submit is correct.");
    }


});


export default router;