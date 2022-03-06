export default class {
    student_id = null;
    class_id = null;
    last_given_feedback = null
    current_target_exercise = null;
    current_target_exercise_wrong_test_cases = null;
    current_target_exercise_correct_test_cases = null;
    exercises_already_solved = null;
    average_submission_interval = null;

    constructor(init) {
        this.student_id = init.student_id
        this.class_id = init.class_id
        this.last_given_feedback = init.last_given_feedback
        this.current_target_exercise = init.current_target_exercise
        this.current_target_exercise_wrong_test_cases = init.current_target_exercise_wrong_test_cases
        this.exercises_already_solved = init.exercises_already_solved
        this.average_submission_interval = init.average_submission_interval
        this.current_target_exercise_correct_test_cases = init.current_target_exercise_correct_test_cases
    }

}