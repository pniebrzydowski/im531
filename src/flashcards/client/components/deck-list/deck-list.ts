import 'reflect-metadata';
import 'zone.js/dist/zone';
import {Component} from 'angular2/core';
import {RouterLink} from 'angular2/router';
import {Mongo} from 'meteor/mongo';
//import {Words} from '../../../collections/decks.ts';
 
@Component({
	selector: 'deck-list',
	templateUrl: '/client/components/deck-list/deck-list.html',
	directives: [RouterLink]
})

export class DeckList {
	//decks: Mongo.Cursor<Object>;

	constructor () {
		//this.decks = Decks.find();
		
		//TODO remove hard-coded decks and use mongodb
		this.decks = [
			{_id:1,name:'Deck #1',wordCount:3}
		];
	}
}
