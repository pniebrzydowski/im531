import 'reflect-metadata';
import {Component} from 'angular2/core';
import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {FormBuilder, ControlGroup, Validators, Control} from 'angular2/common';
import {Router} from 'angular2/router';
 
@Component({
  selector: 'signup-form',
  styleUrls: [
    '/client/components/signup-form/style.css'],
  templateUrl: '/client/components/signup-form/signup-form.html'
})


export class SignupForm {
	signupForm: ControlGroup;
	error: string;
	
	constructor(private router: Router) {
		let fb = new FormBuilder();
 
    	this.SignupForm = fb.group({
	      email: ['',Validators.required],
	      password: ['',Validators.required],
	      password2: ['',Validators.required]
	    });

	    this.error = '';
  }
	
	signup(credentials) {
    if (this.SignupForm.valid && credentials.password === credentials.password2) {
      Accounts.createUser({ email: credentials.email, password: credentials.password}, (err) => {
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
    else {
    document.getElementById("errorMessage").innerHTML = "Invalid Input";
    }
  }
}
