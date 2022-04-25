var firebase = require('firebase-admin');
var serviceAccount = require('./serviceAccountKey.json');

/*
Examples:
Write:
firebaseService.write('notification', 1, {
    a: 1,
    b: 'd',
    c:['a','w'],
    d: [{a:1},{b:2}]
})
Read Once:
firebaseService.read('notification', 1).then(function(notification){
            console.log(notification);
        });
Update:
firebaseService.update('notification', 1, {a:2});
usersRef.update({
  "alanisawesome/nickname": "Alan The Machine",
  "gracehop/nickname": "Amazing Grace"
});    
Read On Listeners:
ref.on("value", function(snapshot) {
  console.log(snapshot.val());
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});
Read Previous Listener:
ref.on("child_added", function(snapshot, prevChildKey) {
  var newPost = snapshot.val();
  console.log("Author: " + newPost.author);
  console.log("Title: " + newPost.title);
  console.log("Previous Post ID: " + prevChildKey);
});

Child Changed Listener:
// Get the data on a post that has changed
ref.on("child_changed", function(snapshot) {
  var changedPost = snapshot.val();
  console.log("The updated post title is " + changedPost.title);
});

Child Removed Listener:
// Get the data on a post that has been removed
ref.on("child_removed", function(snapshot) {
  var deletedPost = snapshot.val();
  console.log("The blog post titled '" + deletedPost.title + "' has been deleted");
});
Order By Listener:
ref.orderByChild("height").on("child_added", function(snapshot) {
  console.log(snapshot.key + " was " + snapshot.val().height + " meters tall");
});

Order By key:
var ref = db.ref("dinosaurs");
ref.orderByKey().on("child_added", function(snapshot) {
  console.log(snapshot.key);
});

Limited:
var ref = db.ref("dinosaurs");
ref.orderByChild("weight").limitToLast(2).on("child_added", function(snapshot) {
  console.log(snapshot.key);
});

var ref = db.ref("dinosaurs");
  ref.orderByChild("height").startAt(3).on("child_added", function(snapshot) {
    console.log(snapshot.key);
  });

var ref = db.ref("dinosaurs");
ref.orderByKey().endAt("pterodactyl").on("child_added", function(snapshot) {
  console.log(snapshot.key);
});

var ref = db.ref("dinosaurs");
ref.orderByKey().startAt("b").endAt("b\uf8ff").on("child_added", function(snapshot) {
  console.log(snapshot.key);
});
Equal To:
var ref = db.ref("dinosaurs");
ref.orderByChild("height").equalTo(25).on("child_added", function(snapshot) {
  console.log(snapshot.key);
});  
 */
function FirebaseService() {
  this._transporter = firebase.initializeApp(
    {
      // credential: firebase.credential.cert('./serviceAccountKey.json'),
      credential: firebase.credential.cert(serviceAccount),
      databaseURL: 'https://konfer-243320.firebaseio.com',
    },
    // , 'flashbid-prod'
  );
  console.log('Prod Firebase');
  this._database = this._transporter.database();
  this._messaging = this._transporter.messaging();

  this.write = function (table, id, payload) {
    return this._database.ref(table + '/' + id).set(payload);
  };

  this.read = function (table, id) {
    return this._database
      .ref(table + '/' + id)
      .once('value')
      .then(function (snapshot) {
        return snapshot.val();
      });
  };

  this.update = function (table, id, payload) {
    const ref = this._database.ref(table).child(id);
    ref.update(payload);
  };

  this.updateSpecific = function (table, id, payload) {
    return this._database.ref(table + '/' + id).update(payload);
  };

  this.pushToList = function (table, id, listField, payload) {
    const ref = this._database.ref(table).child(id).child(listField).push();
    ref.set(payload);
  };

  this.sendPushNotification = function (
    id,
    title,
    subs,
    description,
    deviceId,
  ) {
    // This registration token comes from the client FCM SDKs.

    // See the "Defining the message payload" section above for details
    // on how to define a message payload.
    var payload = {
      notification: {
        title: title,
        body: description,
      },
      data: {
        title: subs.text,
        body: subs.desc,
        action: subs.action,
        id: id,
      },
    };

    // Set the message as high priority and have it expire after 24 hours.
    var options = {
      priority: 'high',
      timeToLive: 60 * 60 * 24,
    };

    console.log('payload', payload);
    console.log('device id', deviceId);

    // Send a message to the device corresponding to the provided
    // registration token with the provided options.
    return this._messaging.sendToDevice(deviceId, payload, options);
  };
}

module.exports = FirebaseService;
