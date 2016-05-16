import 'reflect-metadata';
import 'zone.js/dist/zone';
import {Component} from 'angular2/core';
import {RouteParams} from 'angular2/router';
import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {Words} from '../../../collections/words';
 
@Component({
	selector: 'review-words',
	styleUrls: [
		'/client/components/review-words/style.css'],
	templateUrl: '/client/components/review-words/review-words.html'
})

export class ReviewWords {
	deckId;
	showFront;
	showReview;
	showResults;
	currentWord;
	currentWordIndex;
	words: Meteor.Cursor<Object>;

	constructor (params: RouteParams) {
		this.words = Words.find( { $and: [ { creator:  Meteor.userId()  }, { deckid: params.get('deckId')  } ] } ).fetch();
		this.showResults = false;
		this.showReview = false;
		this.deckId = params.get('deckId');
		this.currentWordIndex = -1;
		this.moveToNextWord();
		this.showFront = true;
	}	

	increaseScore() {
    	this.currentWord.score += 5;
    	this.updateWord(this.currentWord);
    	this.moveToNextWord();
	}
  
	decreaseScore() {
		this.currentWord.score -= 5;
		this.updateWord(this.currentWord);
		this.moveToNextWord();
	}
  
	updateWord(word) {
		Words.update({_id : word._id}, {
			$set: {
				score: word.score
			}
		});
	}
	
	moveToNextWord() {
		this.currentWordIndex++;
		if( this.currentWordIndex == this.words.length ) {
			this.showResults = true;
			this.showReview = false;
		} else {
			this.showFront = true;
			this.currentWord = this.words[this.currentWordIndex];
			this.showResults = false;
			this.showReview = true;
		}
	}
}