import 'reflect-metadata';
import {Component} from 'angular2/core';
import {Mongo} from 'meteor/mongo';
import {FormBuilder, ControlGroup, Validators, Control} from 'angular2/common';
import {Decks} from '../../../collections/decks';

 
@Component({
  selector: 'add-deck-form',
  templateUrl: '/client/components/add-deck-form/add-deck-form.html'
})

export class AddDeckForm {
  addDeckForm: ControlGroup;
 
  constructor() {
    let fb = new FormBuilder();
 
    this.addDeckForm = fb.group({
      name: ['',Validators.required]
    });
  }
  
  addDeck(deck) {
    if (this.addDeckForm.valid) {
      Decks.insert({
        name: deck.name,
        creator: Meteor.userId()
      });
 
      (<Control>this.addDeckForm.controls['name']).updateValue('');
    }
  }
}