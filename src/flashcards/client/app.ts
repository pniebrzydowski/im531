import 'reflect-metadata';
import 'zone.js/dist/zone';
import {Component} from 'angular2/core';
import {bootstrap} from 'angular2-meteor-auto-bootstrap';
import {Words} from '../collections/words';
import {Tracker} from 'meteor/tracker';
 
@Component({
  selector: 'app',
  templateUrl: 'client/app.html'
})

class Flashcards {
  words: Array<Object>;
  
  constructor () {
    this.words = Words.find();
  }
}
 
bootstrap(Flashcards);