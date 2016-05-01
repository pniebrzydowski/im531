import 'reflect-metadata';
import 'zone.js/dist/zone';
import {Component} from 'angular2/core';
import {Mongo} from 'meteor/mongo';
import {AddWordForm} from '../add-word-form/add-word-form';
import {Words} from '../../../collections/words';
 
@Component({
  selector: 'word-list',
  templateUrl: '/client/components/word-list/word-list.html',
  directives: [AddWordForm]
})

export class WordList {
  words: Mongo.Cursor<Object>;
  
  constructor () {
    this.words = Words.find();
  }
  
  removeWord(word) {
    Words.remove(word._id);
  }
}
