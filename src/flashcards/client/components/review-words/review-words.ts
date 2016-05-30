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
	words: Array<Object>;
	reviewWords: Array<Object>;
	results;

	constructor (params: RouteParams) {
		this.words = Words.find( { $and: [ { creator:  Meteor.userId()  }, { deckid: params.get('deckId')  } ] } ).fetch();
		this.showResults = false;
		this.showReview = false;
		this.deckId = params.get('deckId');
		this.currentWordIndex = -1;
		this.results = {
			total: this.words.length,
			right: 0,
			wrong: 0,
			skipped: 0
		};

    this.setReviewWords(20);
	}
	
	setReviewWords(quantity) {
	  let wordArray = this.words;
	  wordArray.sort(this.sortWordsByScoreAsc);
	  let wordsForReview = wordArray.slice(0,quantity-1);
	  wordsForReview = _.shuffle(wordsForReview);
    this.results.total = quantity;
	  
	  this.reviewWords = wordsForReview;
    this.currentWord = wordsForReview[0];
    this.showReview = true;
    this.showFront = true;
	}
	
	sortWordsByScoreAsc(a,b) {
	  return a.score - b.score;
	}
	
	increaseScore() {
    	this.currentWord.score += 5;
    	this.updateWord(this.currentWord);
    	this.results.right++;
    	this.moveToNextWord();
	}
  
	decreaseScore() {
		this.currentWord.score -= 5;
		this.updateWord(this.currentWord);
		this.results.wrong++;
		this.moveToNextWord();
	}
	
	skipWord() {
	  this.results.skipped++;
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
		if( this.currentWordIndex == this.reviewWords.length ) {
			this.showResults = true;
			this.showReview = false;
		} else {
			this.showFront = true;
			this.currentWord = this.reviewWords[this.currentWordIndex];
			this.showResults = false;
			this.showReview = true;
		}
	}
}