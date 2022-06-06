export default {
    "summary":{
        "classify" :  "Wrong Answer",
        "feedback":""
    },
    "request": {
        "studentID": 201800388,
        "date": "2022-03-31T22:49:55-10:00",
        "program": "import java.util.Scanner;\r\n\r\n\r\npublic class Patinagem {\r\n\t\r\n\tScanner in = new Scanner(System.in);\r\n\t\r\n\tPatinagem() {\r\n\t\t\r\n\t\tint n = in.nextInt();\r\n\t\t\r\n\t\tint max = 0;\r\n\t\tint min = 100;\r\n\t\t\r\n\t\tint countMax = 1;\r\n\t\tint countMin = 0;\r\n\t\t\r\n\t\tint sum = 0;\r\n\t\t\r\n\t\tfor(int i=0; i<n; i++) {\r\n\t\t\tint v = in.nextInt();\r\n\t\t\tsum += v;\r\n\t\t\tif(v > max) {\r\n\t\t\t\tmax = v;\r\n\t\t\t\tcountMax = 0;\r\n\t\t\t}\r\n\t\t\tif(v == max)\r\n\t\t\t\tcountMax++;\r\n\t\t\t\r\n\t\t\tif(v < min) {\r\n\t\t\t\tmin = v;\r\n\t\t\t\tcountMin = 0;\r\n\t\t\t}\r\n\t\t\tif(v == min)\r\n\t\t\t\tcountMin++;\r\n\t\t}\r\n\t\tcountMax = 1;\r\n\t\tif(countMax == 1) {\r\n\t\t\tsum -= max;\r\n\t\t\tn--;\r\n\t\t}\r\n\t\tif(countMin == 1) {\r\n\t\t\tsum -= min;\r\n\t\t\tn--;\r\n\t\t}\r\n\r\n\t\tint average = sum / n;\r\n\t\tSystem.out.println(average);\r\n\t}\r\n\t\r\n\t\r\n\tpublic static void main(String... strings) {\r\n\t\tnew Patinagem();\r\n\t}\r\n\r\n}",
        "learningObject": "6efa218e-2001-4e4d-ae6e-4068aa4f69ec"
    },
    "reply": {
        "report": {
            "capability": {
                "id": "Java-evaluator",
                "features": [{
                        "name": "language",
                        "value": "Java"
                    },
                    {
                        "name": "version",
                        "value": "openjdk 11.0.12"
                    },
                    {
                        "name": "engine",
                        "value": "https://www.npmjs.com/package/java"
                    }
                ]
            },
            "programmingLanguage": "Java",
            "exercise": "6efa218e-2001-4e4d-ae6e-4068aa4f69ec",
            "compilationErrors": [],
            "tests": [{
                    "input": "8\n2\n2\n4\n3\n4\n5\n6\n6\n",
                    "expectedOutput": "4\n",
                    "obtainedOutput": "3\n",
                    "outputDifferences": "[{\"count\":1,\"removed\":true,\"value\":\"4\\n\"},{\"count\":1,\"added\":true,\"value\":\"3\\n\"}]",
                    "classify": "Undefined",
                    "mark": 0,
                    "feedback": "take care with limit values.",
                    "environmentValues": []
                },
                {
                    "input": "7\n2\n4\n3\n4\n5\n6\n6\n",
                    "expectedOutput": "4\n",
                    "obtainedOutput": "4\n",
                    "outputDifferences": "[{\"value\":\"4\\n\",\"count\":1}]",
                    "classify": "Undefined",
                    "mark": 1,
                    "feedback": "Test passed!!",
                    "environmentValues": []
                },
                {
                    "input": "6\n81\n29\n36\n12\n26\n43\n",
                    "expectedOutput": "33\n",
                    "obtainedOutput": "33\n",
                    "outputDifferences": "[{\"value\":\"33\\n\",\"count\":1}]",
                    "classify": "Undefined",
                    "mark": 1,
                    "feedback": "Test passed!!",
                    "environmentValues": []
                },
                {
                    "input": "5\n45\n55\n43\n55\n44\n",
                    "expectedOutput": "49\n",
                    "obtainedOutput": "48\n",
                    "outputDifferences": "[{\"count\":1,\"removed\":true,\"value\":\"49\\n\"},{\"count\":1,\"added\":true,\"value\":\"48\\n\"}]",
                    "classify": "Undefined",
                    "mark": 0,
                    "feedback": "take care with limit values.",
                    "environmentValues": []
                },
                {
                    "input": "5\n92\n3\n76\n37\n45\n",
                    "expectedOutput": "52\n",
                    "obtainedOutput": "52\n",
                    "outputDifferences": "[{\"value\":\"52\\n\",\"count\":1}]",
                    "classify": "Undefined",
                    "mark": 1,
                    "feedback": "Test passed!!",
                    "environmentValues": []
                },
                {
                    "input": "5\n53\n35\n43\n54\n72\n",
                    "expectedOutput": "50\n",
                    "obtainedOutput": "50\n",
                    "outputDifferences": "[{\"value\":\"50\\n\",\"count\":1}]",
                    "classify": "Undefined",
                    "mark": 1,
                    "feedback": "Test passed!!",
                    "environmentValues": []
                },
                {
                    "input": "8\n39\n49\n67\n49\n6\n51\n14\n51\n",
                    "expectedOutput": "42\n",
                    "obtainedOutput": "42\n",
                    "outputDifferences": "[{\"value\":\"42\\n\",\"count\":1}]",
                    "classify": "Undefined",
                    "mark": 1,
                    "feedback": "Test passed!!",
                    "environmentValues": []
                },
                {
                    "input": "7\n2\n2\n4\n3\n4\n5\n6\n",
                    "expectedOutput": "3\n",
                    "obtainedOutput": "3\n",
                    "outputDifferences": "[{\"value\":\"3\\n\",\"count\":1}]",
                    "classify": "Undefined",
                    "mark": 1,
                    "feedback": "Test passed!!",
                    "environmentValues": []
                },
                {
                    "input": "6\n33\n17\n12\n49\n52\n47\n",
                    "expectedOutput": "36\n",
                    "obtainedOutput": "36\n",
                    "outputDifferences": "[{\"value\":\"36\\n\",\"count\":1}]",
                    "classify": "Undefined",
                    "mark": 1,
                    "feedback": "Test passed!!",
                    "environmentValues": []
                },
                {
                    "input": "4\n65\n9\n59\n39\n",
                    "expectedOutput": "49\n",
                    "obtainedOutput": "49\n",
                    "outputDifferences": "[{\"value\":\"49\\n\",\"count\":1}]",
                    "classify": "Undefined",
                    "mark": 1,
                    "feedback": "Test passed!!",
                    "environmentValues": []
                }
            ]
        }
    }
}
