import 'reflect-metadata';
import {Component} from 'angular2/core';
import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {FormBuilder, ControlGroup, Validators, Control} from 'angular2/common';
import {Router, RouteParams} from 'angular2/router';
import {WordList} from '../word-list/word-list';
import {Decks} from '../../../collections/decks';

@Component({
  selector: 'deck-settings',
  templateUrl: '/client/components/deck-settings/deck-settings.html',
  styleUrls: ['/client/components/deck-settings/style.less'],
  directives: [WordList]
})

export class DeckSettings {
  deck;
  updateDeckForm: ControlGroup;
 
  constructor (private params: RouteParams, private router: Router) {
	let deckId = params.get('deckId');
	this.deck = Decks.findOne({_id: deckId});

    let fb = new FormBuilder();
 
    this.updateDeckForm = fb.group({
      title: [this.deck.title,Validators.required]
    });
  }
  
  updateDeck(d) {
    if (this.updateDeckForm.valid) {
      Decks.update({_id : this.deck._id}, {
        $set: {
          title: d.title
        }
      });
    }
  }
  
  resetDeckForm() {
  	(<Control>this.updateDeckForm.controls['title']).updateValue(this.deck.title);
  }
  
  deleteDeck() {
    if( confirm("Are you sure you want to delete this deck?") ) {
      Decks.remove({_id: this.deck._id});
      this.router.navigate(['DeckList']);
    }
  }
}