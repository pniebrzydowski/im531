import 'reflect-metadata';
import 'zone.js/dist/zone';
import {Component} from 'angular2/core';
import {RouteParams} from 'angular2/router';
import {Mongo} from 'meteor/mongo';
import {AddWordForm} from '../add-word-form/add-word-form';
import {Words} from '../../../collections/words';
 
@Component({
	selector: 'word-list',
	templateUrl: '/client/components/word-list/word-list.html',
	directives: [AddWordForm]
})

export class WordList {
	deckId;
	words: Mongo.Cursor<Object>;
  
	constructor (params: RouteParams) {
    	this.words = Words.find( { $and: [ { creator:  Meteor.userId()  }, { deckid: params.get('deckId')  } ] } );

    	this.deckId = params.get('deckId');
	}
  
	removeWord(word) {
    	Words.remove(word._id);
	}
}
