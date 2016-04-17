import 'reflect-metadata';
import {Component} from 'angular2/core';
import {Mongo} from 'meteor/mongo';
import {FormBuilder, ControlGroup, Validators, Control} from 'angular2/common';
import {Words} from '../../../collections/words.ts';

 
@Component({
  selector: 'add-word-form',
  templateUrl: '/client/components/add-word-form/add-word-form.html'
})

export class AddWordForm {
  addWordForm: ControlGroup;
 
  constructor() {
    let fb = new FormBuilder();
 
    this.addWordForm = fb.group({
      name: ['',Validators.required]
    });
  }
  
  addWord(word) {
    if (this.addWordForm.valid) {
      Words.insert({
        name: word.name,
        score: 0,
        creator: 'a@abc.com'
      });
 
      (<Control>this.addWordForm.controls['name']).updateValue('');
    }
  }
}