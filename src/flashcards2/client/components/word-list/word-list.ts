import 'reflect-metadata';
import 'zone.js/dist/zone';
import {Component} from 'angular2/core';
import {RouteParams} from 'angular2/router';
import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {AddWordForm} from '../add-word-form/add-word-form';
import {Words} from '../../../collections/words';
import {Decks} from '../../../collections/decks';
 
@Component({
	selector: 'word-list',
	templateUrl: '/client/components/word-list/word-list.html',
	styleUrls: ['/client/components/word-list/style.css'],
	directives: [AddWordForm]
})

export class WordList {
	words: Mongo.Cursor<Object>;
  
	constructor (private params: RouteParams) {
		let deckId = params.get('deckId');
	    this.words = Words.find( { $and: [ { creator:  Meteor.userId() }, { deckid: deckId  } ] } );
	}
	
	addNewCard() {
	
	}
	
	openImport() {
	
	}
	
	removeWord(word) {
    	Words.remove(word._id);
	}
}
