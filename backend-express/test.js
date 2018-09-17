// var operationCountSchema = mongoose.Schema({
//     month_id: String,
//     count: { type: Number, default: 0 }
// }, {_id : false});

// var userSchema = mongoose.Schema({
//     username : { type: String, unique: true, required: true },
//     email: { type: String, unique: true, required: true },
//     password: String,
//     operation_counts: [operationCountSchema]
// });

// userSchema.statics.incrementOperationCount = function(userID, callback) {
//     var currDate = new Date();
//     var dateIdentifier = currDate.getFullYear() + "-" + currDate.getMonth();
//     //NEED TO INCREMENT OPERATION COUNT IF ONE FOR MONTH EXISTS, 
//     //ELSE IF IT DOES NOT EXIST, CREATE A NEW ONE.
// }


// mongos> db.collection.findOne()    
// {
//     "username" : "mark",
//     "email" : "admin@example.com",
//     "password" : "balalalala",
//     "operation_counts" : [
//         {
//             "month_id" : "2016-05",
//             "count" : 6
//         }
//     ]
// }




// mongos> db.collection.update({username:"mark", "operation_counts.month_id": {$ne:"2016-05"}}, {$addToSet: {"operation_counts":{month_id: "2016-05", count:0}}})
// WriteResult({ "nMatched" : 0, "nUpserted" : 0, "nModified" : 0 })
// // only update when the subdoc of specified month not exists
// mongos> db.collection.update({username:"mark", "operation_counts.month_id": {$ne:"2016-06"}}, {$addToSet: {"operation_counts":{month_id: "2016-06", count:0}}})
// WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })

// mongos> db.collection.findOne()
// {
//     "_id" : ObjectId("575636c21e9b27fe715df654"),
//     "username" : "mark",
//     "email" : "admin@example.com",
//     "password" : "balalalala",
//     "operation_counts" : [
//         {
//             "month_id" : "2016-05",
//             "count" : 6
//         },
//         {
//             "month_id" : "2016-06",
//             "count" : 0
//         }
//     ]
// }

// mongos> db.collection.update({username:"mark", "operation_counts.month_id": "2016-06"}, {$inc:{ "operation_counts.$.count":1 }})
// WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })

// mongos> db.collection.findOne()
// {
//     "_id" : ObjectId("575636c21e9b27fe715df654"),
//     "username" : "mark",
//     "email" : "admin@example.com",
//     "password" : "balalalala",
//     "operation_counts" : [
//         {
//             "month_id" : "2016-05",
//             "count" : 6
//         },
//         {
//             "month_id" : "2016-06",
//             "count" : 1
//         }
//     ]
// }