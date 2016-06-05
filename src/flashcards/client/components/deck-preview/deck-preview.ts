import 'reflect-metadata';
import {Component} from 'angular2/core';
import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {FormBuilder, ControlGroup, Validators, Control} from 'angular2/common';
import {RouteParams, RouterLink} from 'angular2/router';
import {Decks} from '../../../collections/decks';
import {Words} from '../../../collections/words';

@Component({
  selector: 'deck-preview',
  templateUrl: '/client/components/deck-preview/deck-preview.html',
  styleUrls: ['/client/components/deck-settings/style.less'],
  directives: [RouterLink]  
})

export class DeckPreview {
  deck;
  words: Array<Object>;
 
  constructor (private params: RouteParams) {
  	let deckId = params.get('deckId');
  	this.deck = Decks.findOne({_id: deckId});
    this.words = Words.find( { $and: [ { creator:  Meteor.userId()  }, { deckid: params.get('deckId')  } ] } ).fetch();
  }
}