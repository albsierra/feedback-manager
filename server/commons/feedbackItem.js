const { urlToHttpOptions } = require("url");

module.exports = class {

    constructor(text, relevance, type, target_test_case, name) {
        this.text = text;
        this.relevance = relevance;
        this.type = type;
        this.target_test_case = target_test_case;
        this.name = name
    }

    static compare(a, b) {
        return b.relevance - a.relevance;
    }
}