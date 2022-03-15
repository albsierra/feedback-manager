import Mocha from 'mocha';
import moment from 'moment-timezone';
import path from 'path'

// for reporting
const currentDateTime = moment().tz('Portugal').format('YYYY/MM/DD/HH/mm/ss');
const reportDirectory = path.resolve(__dirname, `../public/execution-report/${currentDateTime}`)


var Test = Mocha.Test;

var suiteInstance = Mocha.Suite;

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

var suite = (suiteName = 'Suite Name') => suiteInstance.create(mocha.suite, suiteName);

const runMochaTests = () => {

    mocha.cleanReferencesAfterRun(true);
    return new Promise((resolve, reject) => {
        mocha.run((failures) => {

            resolve(`/execution-report/${currentDateTime}/mochawesome.html`)
        });
    });
}

module.exports = { suite, Test, runMochaTests, suiteInstance, reportDirectory }