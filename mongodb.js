const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager";

MongoClient.connect(
  connectionURL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (error, client) => {
    if (error) return console.log("unable to connect to database", error);

    console.log("connected successfully!");

    const db = client.db(databaseName);

    // db.collection("users")
    //   .insertOne({
    //     name: "UCylvester",
    //     age: 23,
    //   })
    //   .then((result) => console.log({ ops: result.ops }))
    //   .catch((error) => console.log("unable to insert user", error));

    db.collection("users").insertMany(
      [
        { name: "Dan Eich", age: 23 },
        { name: "stephen", age: 24 },
      ],
      (error, result) => {
        if (error) return console.log("unable to insert users", error);

        console.log(result.ops);
      }
    );
  }
);
