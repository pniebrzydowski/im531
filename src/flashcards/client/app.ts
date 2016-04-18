import 'reflect-metadata';
import 'zone.js/dist/zone';
import {Component} from 'angular2/core';
import {Mongo} from 'meteor/mongo';
import {bootstrap} from 'angular2-meteor-auto-bootstrap';
import {Words} from '../collections/words';
import {AddWordForm} from './components/add-word-form/add-word-form';
import {ReviewWords} from './components/review-words/review-words';
 
@Component({
  selector: 'app',
  templateUrl: 'client/app.html',
  directives: [AddWordForm,ReviewWords]
})

class Flashcards {
  words: Mongo.Cursor<Object>;
  
  constructor () {
    this.words = Words.find();
  }
  
  removeWord(word) {
    Words.remove(word._id);
  }
}
 
bootstrap(Flashcards);