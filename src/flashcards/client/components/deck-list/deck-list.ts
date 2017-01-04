import 'reflect-metadata';
import 'zone.js/dist/zone';
import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {Component} from 'angular2/core';
import {RouterLink, Router} from 'angular2/router';
import {Decks} from '../../../collections/decks.ts';

@Component({
	selector: 'deck-list',
	templateUrl: '/client/components/deck-list/deck-list.html',
	styleUrls: [
  		'/client/components/deck-list/style.css'],
	directives: [RouterLink]
})


export class DeckList {
	decks: Mongo.Cursor<Object>;
	error;
	

	constructor(private router: Router) {
		var self = this;
		this.decks = Decks.find({ creator: Meteor.userId() });
		this.previewDeck = false;
	}
		
	logout() {
	  var _this = this;
    Meteor.logout(function(err) {
      if (err) {
        _this.error = err;
        console.log("Logout Failed");
      }
      else {
        console.log("Logout Succeeded");
        _this.router.navigate(['/LoginForm']);
      }
    });
	}
}
