import 'reflect-metadata';
import 'zone.js/dist/zone';
import {Component, provide} from 'angular2/core';
import {bootstrap} from 'angular2-meteor-auto-bootstrap';
import {ROUTER_PROVIDERS, ROUTER_DIRECTIVES, RouteConfig, APP_BASE_HREF} from 'angular2/router';

import {LoginForm} from './components/login-form/login-form';
import {DeckList} from './components/deck-list/deck-list';
import {WordList} from './components/word-list/word-list';
import {ReviewWords} from './components/review-words/review-words';
 
@Component({
	selector: 'app',
	templateUrl: 'client/app.html',
	directives: [ROUTER_DIRECTIVES]
})

@RouteConfig([
	{ path: '/login', as: 'LoginForm', component: LoginForm },
	{ path: '/decks', as: 'DeckList', component: DeckList },
	{ path: '/words/:deckId', as: 'WordList', component: WordList },
	{ path: '/review/:deckId', as: 'ReviewWords', component: ReviewWords }
])

class Flashcards {}
 
bootstrap(Flashcards, [ROUTER_PROVIDERS, provide(APP_BASE_HREF, { useValue: '/' })]);