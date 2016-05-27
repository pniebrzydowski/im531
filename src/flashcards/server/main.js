import { Meteor } from 'meteor/meteor';
import {Words} from '../collections/words.ts';
import {Decks} from '../collections/decks.ts';

//UserAccounts = new Mongo.Collection('users');

Meteor.startup(() => {
  // code to run on server at startup
});


if(Meteor.isServer){
    console.log("Hello server");
}

