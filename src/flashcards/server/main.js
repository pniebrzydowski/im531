import { Meteor } from 'meteor/meteor';
WordsList = new Mongo.Collection('words');

//UserAccounts = new Mongo.Collection('users');

Meteor.startup(() => {
  // code to run on server at startup
});


if(Meteor.isServer){
    console.log("Hello server");
}