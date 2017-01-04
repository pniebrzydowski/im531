import 'reflect-metadata';
import 'zone.js/dist/zone';
import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {Component, ChangeDetectorRef} from 'angular2/core';
import {RouterLink, Router} from 'angular2/router';
import {Words} from '../../../collections/words';
import {Decks} from '../../../collections/decks.ts';

@Component({
	selector: 'audio-input',
	templateUrl: '/client/components/audio-input/audio-input.html',
	styleUrls: [
  		'/client/components/audio-input/style.css'],
	directives: [RouterLink]
})


export class AudioInput {
	decks: Mongo.Cursor<Object>;
	apiAi: Object;
	prompt;
	message;
	

	constructor(private router: Router, private ref: ChangeDetectorRef) {
		var self = this;
		this.decks = Decks.find({ creator: Meteor.userId() });
		this.previewDeck = false;
		
		var config = {
			server: 'wss://api-ws.api.ai:4435/api/ws/query',
			serverVersion: '20150910', // omit 'version' field to bind it to '20150910' or use 'null' to remove it from query
			token: '6ce65f59d1554efba6ced3bf9cd2d7ec',// Use Client access token there (see agent keys).
			onInit: function () {
        self.prompt = "Please speak a command";
        self.ref.detectChanges();
				self.apiAi.open();
			}
		};
		self.apiAi = new ApiAi(config);
	
	  self.apiAi.onOpen = function() {
			self.apiAi.startListening();
		};
		self.apiAi.onStopListening = function() {
		  console.log("done listening");
		};
		self.apiAi.onStartListening = function() {
		  console.log("starting listening");
		};
		self.apiAi.onResults = function(data) {
			var status = data.status;
			var code;
			if (!(status && (code = status.code) && isFinite(parseFloat(code)) && code < 300 && code > 199)) {
				return;
			}
			console.log(data);
			self.processAudio(data.result);
		};
		self.apiAi.init();
	}
	
	processAudio(res) {
		var self = this;
		
		if(res.action === "input.unknown") {
		  self.showMessage(res.fulfillment.speech);
		}
		
		if(res.actionIncomplete) {
			self.showPrompt(res.fulfillment.speech);
		} else {
			if(res.metadata.intentName === "CreateDeck") {				
				let newDeckId = Decks.insert({
					title: res.parameters.title,
					creator: Meteor.userId()
				}, function(err,id) {
					self.showMessage(res.fulfillment.speech,['/DeckSettings', {deckId: id}]);
				});
			}
			
			else if(res.metadata.intentName === "DeleteDeck") {
				let found = false;
				self.decks.forEach( function(deck) {
					if(deck.title.toLowerCase() === res.parameters.deck) {
						found = true;
            Decks.remove({_id: deck._id});
            self.showMessage(res.fulfillment.speech, ['/DeckList']);
					}
				});
				
				if(!found) {
					self.showMessage("Sorry, we were unable to find a deck named: " + res.parameters.deck);
					self.showPrompt("Please speak a command");
				}
			}
			
			else if(res.metadata.intentName === "CreateNewCard") {
        let found = -1;
        self.decks.forEach( function(deck) {
          if(deck.title.toLowerCase() === res.parameters.deck) {
            found = deck._id;
          }
        });
        
        if(found === -1) {
          self.showMessage("Sorry, we were unable to find a deck named: " + res.parameters.deck);
          self.showPrompt("Please speak a command");
        } else {
          Words.insert({
            front: res.parameters.front,
            back: res.parameters.back,
            score: 0,
            creator: Meteor.userId(),
            deckid: found
          });
          self.showMessage(res.fulfillment.speech,['/DeckSettings', {deckId: found}]);
        }			  
			}
    }
 	}
	
	showPrompt(prompt) {
		this.prompt = prompt;
    this.ref.detectChanges();
    this.apiAi.startListening();
	}
	
	showMessage(msg, route) {
	  var self = this;
	  
	  self.message = msg;
    self.ref.detectChanges();
    
    if(route) {
      self.apiAi.close();
      setTimeout( function() {
        self.router.navigate(route);
     }, 3000);
    } else {
      self.showPrompt("Please speak a command");
    }
	}
}
