import 'reflect-metadata';
import 'zone.js/dist/zone';
import {Component} from 'angular2/core';
import {Mongo} from 'meteor/mongo';
import {Words} from '../../../collections/words';
 
@Component({
  selector: 'review-words',
  templateUrl: '/client/components/review-words/review-words.html'
})

export class ReviewWords {
  currentWord;
  currentWordIndex;
  wordsCursor: Mongo.Cursor<Object>;
  words: Array<Object>;
  
  constructor () {
    this.wordsCursor = Words.find();
    this.words = this.wordsCursor.fetch();
    this.setCurrentWord(0);
  }
  
  increaseScore(word) {
    word.score += 5;
    this.updateWord(word);
    this.moveToNextWord();
  }
  
  decreaseScore(word) {
    word.score -= 5;
    this.updateWord(word);
    this.moveToNextWord();
  }
  
  updateWord(word) {
    Words.update({_id : word._id}, word);
  }
  
  moveToNextWord() {
    this.setCurrentWord(this.currentWordIndex + 1);
  }
  
  setCurrentWord(index) {
    if(index < 0) return;
      
    if( this.words.length <= index ) {
      this.currentWordIndex = 0;
    } else {
      this.currentWordIndex = index;
    }
    this.currentWord = this.words[this.currentWordIndex];
  }
}