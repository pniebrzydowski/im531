import 'reflect-metadata';
import 'zone.js/dist/zone';
import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {Component} from 'angular2/core';
import {RouterLink} from 'angular2/router';
import {LoginButtons} from 'angular2-meteor-accounts-ui/login-buttons';
import {AddDeckForm} from '../add-deck-form/add-deck-form';
import {Decks} from '../../../collections/decks.ts';

//import {Words} from '../../../collections/decks.ts';

@Component({
	selector: 'deck-list',
	templateUrl: '/client/components/deck-list/deck-list.html',
	styleUrls: [
  		'/client/components/deck-list/style.css'],
	directives: [RouterLink, LoginButtons, AddDeckForm]
})


export class DeckList {
	decks: Mongo.Cursor<Object>;
	previewDeck;

	constructor () {
		this.decks = Decks.find({ creator: Meteor.userId() });
		this.previewDeck = false;
	}
	
	preview(deck) {
		this.previewDeck = deck;
	}
	
	closePreview() {
		this.previewDeck = false;
	}

	remove(deck) {
		if( confirm("Are you sure you want to delete this deck?") ) {
			Decks.remove(deck._id);
			this.closePreview();
		}
	}
}
