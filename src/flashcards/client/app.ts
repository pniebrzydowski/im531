import 'reflect-metadata';
import 'zone.js/dist/zone';
import {Component, provide} from 'angular2/core';
import {bootstrap} from 'angular2-meteor-auto-bootstrap';
import {ROUTER_PROVIDERS, ROUTER_DIRECTIVES, RouteConfig, APP_BASE_HREF} from 'angular2/router';

import {LoginForm} from './components/login-form/login-form';
import {ErrorPage} from './components/error-page/error-page';
import {SignupForm} from './components/signup-form/signup-form';
import {DeckList} from './components/deck-list/deck-list';
import {AddDeckForm} from './components/add-deck-form/add-deck-form';
import {DeckPreview} from './components/deck-preview/deck-preview';
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
	{ path: '/signup', as: 'SignupForm', component: SignupForm },
	{ path: '/create', as: 'AddDeckForm', component: AddDeckForm },
	{ path: '/deck/:deckId', as: 'DeckSettings', component: DeckSettings },
  { path: '/preview/:deckId', as: 'DeckPreview', component: DeckPreview },
	{ path: '/review/:deckId', as: 'ReviewWords', component: ReviewWords },
	{ path: '/*path', as: 'ErrorPage', component: ErrorPage }

])

class Flashcards {
	
	constructor() {


  } 


}
 
bootstrap(Flashcards, [ROUTER_PROVIDERS, provide(APP_BASE_HREF, { useValue: '/' })]);

	Tracker.autorun(function(){
if(Meteor.userId()==null && location.pathname!='/login' && location.pathname!='/signup' && !Meteor.userId()) {
	    console.log('Oh yes');
	    window.location.assign('/login');
	  }
	});


