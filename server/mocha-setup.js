import Mocha from 'mocha';
import moment from 'moment-timezone';
import path from 'path'

// for reporting
const currentDateTime = moment().tz('Portugal').format('YYYY/MM/DD/HH:mm:ss');
const reportDirectory = path.resolve(__dirname, `../public/execution-report/${currentDateTime}`)

// mocha setup
const Test = Mocha.Test;

const suiteInstance = Mocha.Suite;

const mocha = new Mocha({
    timeout: 200000,
    reporter: 'mochawesome',
    reporterOptions: {
        reportDir: reportDirectory,
        reportTitle: "Test Execution Report",
        reportPageTitle: "Test Report",
        charts: true
    }
});

const suite = (suiteName = 'Suite Name') => suiteInstance.create(mocha.suite, suiteName);

const runMochaTests = () => {
    return new Promise((resolve, reject) => {
        mocha.run((failures) => {
            if (failures) reject('at least one test is failed, check detailed execution report')
            resolve(`${reportDirectory}/mochawesome.html`)
        });
    });
}

module.exports = { suite, Test, runMochaTests, suiteInstance }