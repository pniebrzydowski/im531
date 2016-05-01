import 'reflect-metadata';
import 'zone.js/dist/zone';
import {Component} from 'angular2/core';
import {Mongo} from 'meteor/mongo';
//import {Words} from '../../../collections/decks.ts';
 
@Component({
  selector: 'deck-list',
  templateUrl: '/client/components/deck-list/deck-list.html'
})

export class DeckList {
  /*decks: Mongo.Cursor<Object>;
  
  constructor () {
    this.decks = Decks.find();
  }
  
  removeDeck(deck) {
    Decks.remove(deck._id);
  }*/
}
