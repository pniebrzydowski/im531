import 'reflect-metadata';
import {Component} from 'angular2/core';
import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {FormBuilder, ControlGroup, Validators, Control} from 'angular2/common';
import {Router} from 'angular2/router'
import {ImportDeck} from '../import-deck/import-deck';
import {Decks} from '../../../collections/decks';

 
@Component({
  selector: 'add-deck-form',
  templateUrl: '/client/components/add-deck-form/add-deck-form.html',
  directives: [ImportDeck]
})

export class AddDeckForm {
  addDeckForm: ControlGroup;
 
  constructor(private router: Router) {
    let fb = new FormBuilder();
 
    this.addDeckForm = fb.group({
      name: ['',Validators.required]
    });
  }
  
  addDeck(deck) {
    if (this.addDeckForm.valid) {
      let newDeckId = Decks.insert({
        name: deck.name,
        creator: Meteor.userId()
      });
 
      this.router.navigate(['/DeckSettings', {deckId: newDeckId}]);
    }
  }
}