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
		
		var config = {
			server: 'wss://api-ws.api.ai:4435/api/ws/query',
			serverVersion: '20150910', // omit 'version' field to bind it to '20150910' or use 'null' to remove it from query
			token: '6ce65f59d1554efba6ced3bf9cd2d7ec',// Use Client access token there (see agent keys).
			onInit: function () {
				console.log("> ON INIT use config");
				apiAi.open();
			}
		};
		var apiAi = new ApiAi(config);
		apiAi.onOpen = function() {
			apiAi.startListening();
		};
		apiAi.onResults = function(data) {
			var status = data.status;
			var code;
			if (!(status && (code = status.code) && isFinite(parseFloat(code)) && code < 300 && code > 199)) {
				return;
			}
			console.log(data);
			self.processAudio(data.result);
		};
		apiAi.init();
	}
	
	processAudio(res) {
		var self = this;
		if(res.actionIncomplete) {
			self.showPrompt(res.fulfillment.speech);
		} else {
			if(res.metadata.intentName === "CreateDeck") {				
				let newDeckId = Decks.insert({
					title: res.parameters.title,
					creator: Meteor.userId()
				}, function(err,id) {
					console.log(res.fulfillment.speech);
					self.router.navigate(['/DeckSettings', {deckId: id}]);
				});
			}
			
			else if(res.metadata.intentName === "DeleteDeck") {
				let found = false;
				self.decks.forEach( function(deck) {
					if(deck.title.toLowerCase() === res.parameters.deck) {
						found = true;
						Decks.remove({_id: deck._id});
						console.log(res.fulfillment.speech);
					}
				});
				
				if(!found) {
					self.showPrompt("Sorry, we were unable to find a deck named: " + res.parameters.deck);
				}
			}
			
			else if(res.metadata.intentName === "CreateNewCard") {
			
			}
		}
	}
	
	showPrompt(prompt) {
		alert(prompt);
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
