import 'reflect-metadata';
import {Component} from 'angular2/core';
import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {FormBuilder, ControlGroup, Validators, Control} from 'angular2/common';
import {Router, RouteParams} from 'angular2/router';
import {Decks} from '../../../collections/decks';

@Component({
  selector: 'add-deck-form',
  templateUrl: '/client/components/add-deck-form/add-deck-form.html',
  styleUrls: ['/client/components/deck-settings/style.css']
})

export class AddDeckForm {
  updateDeckForm: ControlGroup;
 
  constructor (private router: Router) {
    let fb = new FormBuilder();
 
    this.updateDeckForm = fb.group({
      title: ['',Validators.required]
    });
  }
  
  updateDeck(d) {
    var _this = this;
    if (this.updateDeckForm.valid) {
      let newDeckId = Decks.insert({
        title: d.title,
        creator: Meteor.userId()
      }, function(err,id) {
        _this.router.navigate(['/DeckSettings', {deckId: id}]);
      });
    }
  }
  
  resetDeckForm() {
    (<Control>this.updateDeckForm.controls['title']).updateValue('');
  }
}