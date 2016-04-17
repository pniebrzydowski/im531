import 'reflect-metadata';
import 'zone.js/dist/zone';
import {Component} from 'angular2/core';
import {bootstrap} from 'angular2-meteor-auto-bootstrap';
import {Words} from '../collections/words';
import {AddWordForm} from './components/add-word-form/add-word-form';
 
@Component({
  selector: 'app',
  templateUrl: 'client/app.html',
  directives: [AddWordForm]
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