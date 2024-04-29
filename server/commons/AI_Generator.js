require('dotenv').config() // for loading the environment variables from .env file
const { OpenAI } = require('openai'); // don't forget adding "openai": "^4.35.0" on package.json and package-lock.json dependencies
const AI_KEY = process.env.OPENAI_API_KEY; // get your personal openAI API key from .env file
const openai = new OpenAI({ AI_KEY }); // new instance of the OpenAI class with the API key provided as an argument

module.exports = {

    generateByAI: async function generateByIA(isWrongBecauseOfACompilationProblem, isCorrect, full_report) {

        let answer = full_report.request.program; // get the student answer
        let language = full_report.request.language; // get the test code language
        let selectedPrompt = ""; // for getting the best prompt (depends on boolean parameters)
        let expectedOutput = ""; // get the expected output for the test (doesn't exist on isWrongBecauseOfACompilationProblem=true)
        try {
            // change unicode to equivalent plain text
            expectedOutput = full_report.reply.report.tests[0].expectedOutput.replaceAll("&#x2591;", " ").replaceAll("&#x204B;", "");
        } catch (error) {
            // nothing to do because expectedOutput is not used on "compilation error" prompt creation.            
        }

        // Prompt when student provides a CORRECT answer
        if (isCorrect) selectedPrompt =
        `Please, no need to answer immediately, but analyze the following code ${answer} in ${language} language and take 
        note of any relevant aspects.
        Now, in no more than 40 words, if we expect the result of that code to be exactly: ${expectedOutput}, provide me 
        with a brief list indicating any critical code optimization (only if necessary).`

        // Prompt when student provides a WRONG answer
        else if (!isCorrect && !isWrongBecauseOfACompilationProblem) selectedPrompt =
        `Please, no need to answer immediately, but analyze the following code ${answer} in ${language} language and take 
        note of any relevant aspects.
        Now, in no more than 40 words, provide me suggestions on a brief list (without indicating any code in ${language}), 
        so that upon executing the updated code with your suggestions, the output will be exactly as follows: ${expectedOutput}.`

        // Prompt when COMPILATION PROBLEM exists
        else if (isWrongBecauseOfACompilationProblem) selectedPrompt =
        `Please, no need to answer immediately, but analyze the following code ${answer} in ${language} language and take 
        note of any relevant aspects.
        Now, in no more than 40 words, provide me a brief list with the code lines that generate an error when compiling 
        end some help to fix it.`;

        // OpenAI API access
        try {
            const completion = await openai.chat.completions.create({
                messages: [{ "role": "user", "content": selectedPrompt }],
                model: "gpt-3.5-turbo"
            });

            // Convert to a string
            let feedbackText = "";
            completion.choices.forEach(choice => {
                feedbackText += choice.message.content;
            });
            return feedbackText;

        } catch (error) { // Handle the error according to its status code
            if (error.status === 401) { // Incorrect or missing API key
                if (AI_KEY == "") return "IA Authentication Error (401): Missing API key.";
                else return "IA Authentication Error (401): Incorrect API key.";

            } else if (error.status === 400) { //         
                return `IA Bad Request (400):  ${error.message}`;

            } else if (error.status === 500) { // 
                return `IA Internal Server Error (500): ${error.message}`;

            } else { // Other errors
                return `IA Generic Error (${error.status}): ${error.message}`;
            }            
        }
    }
}