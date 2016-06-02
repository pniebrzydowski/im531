import 'reflect-metadata';
import 'zone.js/dist/zone';
import {Component} from 'angular2/core';
import {Mongo} from 'meteor/mongo';
 
@Component({
  selector: 'login-form',
  styleUrls: [
  	'/client/components/login-form/normalize.css',
  	'/client/components/login-form/style.css'],
  templateUrl: '/client/components/login-form/login-form.html'
})

export class LoginForm {
	currentTab;
	
	constructor () {
		this.currentTab = 'login';
	}
	
	setCurrentTab(tabName) {
		this.currentTab = tabName;
	}
}