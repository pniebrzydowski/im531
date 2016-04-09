import { Meteor } from 'meteor/meteor';
WordsList = new Mongo.Collection('words');
Meteor.startup(() => {
  // code to run on server at startup
});


if(Meteor.isServer){
    console.log("Hello server");
}