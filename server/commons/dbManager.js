const { MongoClient } = require('mongodb');
import 'regenerator-runtime/runtime'
const client = new MongoClient(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true });
var collection


export async function db(callback, document) {
    // Use connect method to connect to the server
    client.connect(err => {
        collection = client.db("JUEZLTI").collection(document);
        callback()
    })

}


export function cehckIfExist(collection_name) {
    let list = client.db.getCollectionNames()
    return list.includes(collection_name);
}
export async function insert(obj) {

    const insertResult = await collection.insert(obj);
    console.log(`Inserted`);
}

export async function insertMany(objs) {


    const insertResult = await collection.insertMany(objs);
    console.log(`Inserted documents =>  ${insertResult}`);
}

export async function findAll() {
    const findResult = await collection.find({}).toArray();
    console.log(`Found documents =>  ${findResult}`);

}
export async function findWithCriteria(obj, sort_fields) {
    if (sort_fields != undefined)
        return await collection.find(obj).sort(sort_fields).toArray();
    else
        return await collection.find(obj).toArray();



}

export async function update() {
    const updateResult = await collection.updateOne({ a: 3 }, { $set: { b: 1 } });
    console.log(`Updated documents => ${updateResult}`);

}
export async function remove() {
    const deleteResult = await collection.deleteMany({ a: 3 });
    console.log(`Deleted documents => ${deleteResult}`);

}
export async function removeAll() {
    const deleteResult = await collection.deleteMany({});
    console.log(`Deleted documents => ${deleteResult}`);

}

export function closeConnection() {
    client.close();

}