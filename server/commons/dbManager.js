require('dotenv').config()
const { MongoClient } = require('mongodb');
require('regenerator-runtime/runtime.js')

var client = new MongoClient(process.env.FEEDBACK_MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
var collection

module.exports = {
    
db:function db(callback, document) {
    // Use connect method to connect to the server
    client.connect(err => {
        if(err) throw err;
        collection = client.db("JUEZLTI").collection(document);
        callback()
    })
},

createIndex:async function createIndex(index) {
    const result = await collection.createIndex(index);
    // console.log(`Index created: ${result}`);
},

checkIfExist:function checkIfExist(collection_name) {
    return new Promise((resolve, reject) => {
        let flag = false;
        client.db("JUEZLTI").collections(function(e, cols) {
            if (e) {
                console.log(e)
                reject(e);
            }
            cols.forEach(function(col) {
                if (collection_name == col.collectionName) {
                    flag = true
                }
            });
            resolve(flag);
        });


    })

},

remove:function remove(obj) {
    return new Promise((resolve, reject) => {
        collection.deleteOne({_id: obj._id}, function(err, result) {
            if (err) {
                console.log(err);
                reject(err)
            } else {
                resolve()
            }

        });
    })
},


insert:function insert(obj) {
    return new Promise((resolve, reject) => {
        collection.insert(obj, function(err, result) {
            if (err) {
                console.log(err);
                reject(err)
            } else {
                resolve(result.insertedIds['0'])
            }

        });
    })


},

findWithCriteria:async function findWithCriteria(obj, sort_fields) {
    if (sort_fields != undefined)
        return await collection.find(obj).sort(sort_fields).toArray();
    else
        return await collection.find(obj).toArray();
},

closeConnection:function closeConnection() {
    if (!!client && !!client.topology && client.topology.isConnected()) {
        client.close();
    }
}

}