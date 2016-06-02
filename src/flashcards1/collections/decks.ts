import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';

export var Decks = new Mongo.Collection('decks');

Decks.allow({
  insert: function() {
    let user = Meteor.user();
    
    return !!user;
  },
  update: function() {
    let user = Meteor.user();
    
    return !!user;
  },
  remove: function() {
    let user = Meteor.user();
    
    return !!user;
  }
});