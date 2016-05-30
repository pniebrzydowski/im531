import 'reflect-metadata';
import 'zone.js/dist/zone';
import {Component, AfterViewInit} from 'angular2/core';
import {RouteParams} from 'angular2/router';
import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {Words} from '../../../collections/words';
 
@Component({
	selector: 'review-words',
	styleUrls: [
		'/client/components/review-words/style.less'],
	templateUrl: '/client/components/review-words/review-words.html'
})

export class ReviewWords implements AfterViewInit {
	deckId;
	showFront;
	currentWordIndex;
	words: Array<Object>;
	reviewWords: Array<Object>;
	results;

	constructor (params: RouteParams) {
		this.words = Words.find( { $and: [ { creator:  Meteor.userId()  }, { deckid: params.get('deckId')  } ] } ).fetch();
		this.deckId = params.get('deckId');
		this.currentWordIndex = -1;
		this.results = {
			total: this.words.length,
			right: 0,
			wrong: 0,
			skipped: 0
		};
    this.showFront = true;
    this.setReviewWords(20);
	}
	
  ngAfterViewInit() {
    $('#fullpage').fullpage();
    $.fn.fullpage.setKeyboardScrolling(false);
    $.fn.fullpage.setAllowScrolling(false);
	}
	
	setReviewWords(quantity) {
	  let wordArray = this.words;
	  wordArray.sort(this.sortWordsByScoreAsc);
	  let wordsForReview = wordArray.slice(0,quantity-1);
	  wordsForReview = _.shuffle(wordsForReview);
    this.results.total = quantity;
	  this.reviewWords = wordsForReview;
	}
	
	sortWordsByScoreAsc(a,b) {
	  return a.score - b.score;
	}
	
	increaseScore(word) {
    	word.score += 5;
    	this.updateWord(word);
    	this.results.right++;
    	this.moveToNextWord();
	}
  
	decreaseScore(word) {
		word.score -= 5;
		this.updateWord(word);
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
			$.fn.fullpage.moveSectionDown();
		} else {
		  this.showFront = true;
			$.fn.fullpage.moveSlideRight();
		}
	}
}