# feedback-manager

Need to add new line on .env file:

OPENAI_API_KEY="your personal key from OPENAI API"

Updates on files:
-----------------
+ package-lock.json: now includes "openai": "^4.35.0" on dependencies.

+ package.json: now includes "openai": "^4.35.0" on dependencies.

+ strategies.js:

    - New function "getExercise", with the logic of rescue the programming exercise.
    
    - "applyStrategies" function simplified by extracting the logic of "getExercise" function.
    
    - Add lines on "getBestFeedback" function to "getExercise" and check if exists "withAI" on the "keywords" array property.
 
    - Other changes on lines that call the original feedback, to add the AI generated feedback too.
    
    
+ /commons/AI_generator.js: new file to create prompts, depending of boolean "isWrongBecauseOfACompilationProblem" and "isCorrect" values. The prompts are sending to OpenAI for getting a string type response to offer help to the student.
