require('dotenv').config() // for loading the environment variables from .env file
const { OpenAI } = require('openai'); // don't forget adding "openai": "^4.35.0" on package.json and package-lock.json dependencies
const AI_KEY = process.env.OPENAI_API_KEY; // get your personal openAI API key from .env file
const openai = new OpenAI({ AI_KEY }); // new instance of the OpenAI class with the API key provided as an argument

module.exports = {

    generateIA: async function generateIA(isWrongBecauseOfACompilationProblem, isCorrect, full_report) {

        let answer = full_report.request.program; // get the student answer
        let language = full_report.request.language; // get the test code language
        let selectedPrompt = ""; // for getting the best prompt (depends on boolean parameters)
        let expectedOutput = ""; // get the expected output for the test (doesn't exist on isWrongBecauseOfACompilationProblem=true)
        try {
            // change unicode to equivalent plain text
            expectedOutput = full_report.reply.report.tests[0].expectedOutput.replaceAll("&#x2591;", " ").replaceAll("&#x204B;", "");
        } catch (error) {
            // nothing to do because expectedOutput is not used on "compilation error" prompt.            
        }

        // Prompt when the student provides a CORRECT answer
        if (isCorrect) selectedPrompt =
            `In no more than 40 words, first using ${language} code language, analyze the following code: ${answer}, then, 
        if necessary, provide a brief list indicating any crucial code optimization while maintaining the output as: 
        ${expectedOutput}.`

        // Prompt cuando la respuesta es INCORRECTA
        else if (!isCorrect && !isWrongBecauseOfACompilationProblem) selectedPrompt =
            `En no mas de 40 palabras, primero usando lenguaje ${language} estudia el siguiente código: ${answer}, y luego 
        dame alguna sugerencia sin indicar código ${language}, mediante una breve lista, para que al ejecutar dicho 
        código la salida sea exactamente lo siguiente: ${expectedOutput}.`


        // Prompt cuando hay ERROR DE COMPILACION
        else if (isWrongBecauseOfACompilationProblem) selectedPrompt =
            `En no mas de 40 palabras, primero usando lenguaje ${language} estudia el siguiente código: ${answer}, y luego 
        dime una lista con las lineas que generen un error al compilar dicho código.`;

        //Petición a ChatGPT
        try {
            const completion = await openai.chat.completions.create({
                messages: [{ "role": "user", "content": selectedPrompt }],
                model: "gpt-3.5-turbo"
            });

            //Pasamos todos los content de cada message a un solo string y devolvemos el feedback generado
            let feedbackText = "";
            completion.choices.forEach(choice => {
                feedbackText += choice.message.content;
            });
            return feedbackText;

        } catch (error) { // Handle the error according to its type

            if (error.status === 401) { // Incorrect or missing API key
                if (AI_KEY == "") return "Authentication error: Missing API key.";
                else return "Authentication error: Incorrect API key.";

            } else if (error.status === 400) { //         
                return `IA 2 Error:  ${error.message}`;

            } else if (error.status === 500) { // 
                return `IA 3 Error: ${error.message}`;

            } else { // Other errors
                return `IA Generic Error: ${error.message} - (status code: ${error.status})`;
            }            
        }
    }
}
