import 'reflect-metadata';
import {Component} from 'angular2/core';
import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {FormBuilder, ControlGroup, Validators, Control} from 'angular2/common';
import {Router} from 'angular2/router';
 
@Component({
  selector: 'login-form',
  styleUrls: [
  	'/client/components/login-form/style.less'],
  templateUrl: '/client/components/login-form/login-form.html'
})

export class LoginForm {
	loginForm: ControlGroup;
	error: string;
	
	constructor(private router: Router) {
		let fb = new FormBuilder();
 
    	this.loginForm = fb.group({
	      email: ['',Validators.required],
	      password: ['',Validators.required]
	    });

	    this.error = '';
  }
	
	login(credentials) {
    if (this.loginForm.valid) {
      Meteor.loginWithPassword(credentials.email, credentials.password, (err) => {
        if (err) {
          this.error = err;
          console.log("Oh No");
          document.getElementById("errorMessage").innerHTML = "Invalid Input";
        }
        else {
          console.log("Oh yeah");
          this.router.navigate(['/DeckList']);
        }
      });
    }
  }
}








