import 'reflect-metadata';
import 'zone.js/dist/zone';
import {Component, provide} from 'angular2/core';
import {bootstrap} from 'angular2-meteor-auto-bootstrap';
import {ROUTER_PROVIDERS, ROUTER_DIRECTIVES, RouteConfig, APP_BASE_HREF} from 'angular2/router';

import {LoginForm} from './components/login-form/login-form';
import {DeckList} from './components/deck-list/deck-list';
import {AddDeckForm} from './components/add-deck-form/add-deck-form';
import {DeckSettings} from './components/deck-settings/deck-settings';
import {ReviewWords} from './components/review-words/review-words';
 
@Component({
	selector: 'app',
	templateUrl: '/client/app.html',
	directives: [ROUTER_DIRECTIVES]
})

@RouteConfig([
	{ path: '/', as: 'DeckList', component: DeckList },
	{ path: '/login', as: 'LoginForm', component: LoginForm },
	{ path: '/create', as: 'AddDeckForm', component: AddDeckForm },
	{ path: '/deck/:deckId', as: 'DeckSettings', component: DeckSettings },
	{ path: '/review/:deckId', as: 'ReviewWords', component: ReviewWords }
])

class Flashcards {}
 
bootstrap(Flashcards, [ROUTER_PROVIDERS, provide(APP_BASE_HREF, { useValue: '/' })]);