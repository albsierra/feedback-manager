const axios = require('axios')

main();

function main() {
    let student_id = [];
    [...Array(100000).keys()].forEach(() => {
        student_id.push(makeid(9))
    })
    setInterval(() => {


        let d = new Date()
        let p_ID = [
            "6c882692-0583-4f96-969a-b601ea0a89be",
            "c9d68b4f-e306-41f5-bba3-cafdcd024bfb",
            "fd286cb3-5c95-4b0e-b843-56bc058a7713",
            "be3bf258-895f-4f5b-bbe9-b716d75f4261"
        ];

        let body = {
            "studentID": student_id[Math.floor(Math.random() * 100)],
            "date": d.toISOString(),
            "program": "/bsookstore/book/price//text()",
            "learningObject": "fd286cb3-5c95-4b0e-b843-56bc058a7713"
        }


        //   setTimeout(function() {
        console.log(body)
        axios
            .post('http://localhost:8080/eval', body)
            .then(res => {
                console.log(`statusCode: ${res.status}`)
                console.log(res.data)
            })
            .catch(error => {
                console.error(error)
            })





        //    }, Math.floor((Math.random() * 100)));





    }, 10);
}


function makeid(length) {
    var result = '';
    var characters = '0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}