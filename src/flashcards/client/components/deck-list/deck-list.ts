import 'reflect-metadata';
import 'zone.js/dist/zone';
import {Component} from 'angular2/core';
import {RouterLink} from 'angular2/router';
import {LoginButtons} from 'angular2-meteor-accounts-ui/login-buttons';
import {AddDeckForm} from '../add-deck-form/add-deck-form';
import {Mongo} from 'meteor/mongo';
import {Decks} from '../../../collections/decks.ts';

//import {Words} from '../../../collections/decks.ts';

@Component({
	selector: 'deck-list',
	templateUrl: '/client/components/deck-list/deck-list.html',
	directives: [RouterLink, LoginButtons, AddDeckForm]
})


export class DeckList {
	decks: Mongo.Cursor<Object>;

	constructor () {
		this.decks = Decks.find({ creator: Meteor.userId() });
		
		//TODO add number of words in each deck
	//	this.decks = [
	//		{_id:1,name:Decks.name,wordCount:3}
	//	];
	}

	removeDeck(deck) {
	Decks.remove(deck._id);
	}
}
