import 'reflect-metadata';
import 'zone.js/dist/zone';
import {Component, AfterViewInit} from 'angular2/core';
import {Meteor} from 'meteor/meteor';
import {FormBuilder, ControlGroup, Validators, Control} from 'angular2/common';
import {Router} from 'angular2/router'
import {Decks} from '../../../collections/decks';
import {Words} from '../../../collections/words';
 
@Component({
	selector: 'import-deck',
	templateUrl: '/client/components/import-deck/import-deck.html'
})

export class ImportDeck implements AfterViewInit {
	importForm: ControlGroup;
	inputFile;
	newDeckId;
	words: Array<Object>;
	
	constructor (private router:Router) {
		this.words = [];
		this.newDeckId = null;
		this.inputFile = null;
		let fb = new FormBuilder();
 		this.importForm = fb.group({
      		inputfile: [''],
      		deckName: ['',Validators.required],
      		deckDescription: ['',Validators.required]
    	});	
    }
    
    ngAfterViewInit() {
    	var _this = this;
    	
    	$("#inputfile").change({
	        function(data) {
	        	_this.decrypt(data);
	        }
	    },
	    function(event) {
	        event.stopPropagation();
	        event.preventDefault();
	        var f = event.target.files[0];
	        _this.inputFile = f;
	        var reader = new FileReader();
	        reader.onload = function(e) { event.data.function(e.target.result); };
	        reader.readAsArrayBuffer(f);
	    });
	}
	
	getInfo(rawData) {
		var _this = this;		
	    var cardsInfo;
	    var db = new SQL.Database(rawData);
	    decks = db.exec("SELECT decks FROM col");
	    decks = Function('return ' + decks[0].values[0][0])();
	    var col = db.exec("SELECT models FROM col");
	    var decks = Function('return ' + col[0].values[0][0])();
	
	    cardsInfo = db.exec("SELECT mid,flds FROM notes");
	    _.each(_.keys(decks), function(key) {
	        decks[key].fields = _.pluck(decks[key].flds, 'name');
	    });
	
	    var infoDeck = _.groupBy(cardsInfo[0].values, function(row) { 
	        return row[0]; 
	    });
	
	    cardsInfo = _.map(infoDeck, function(wordsArray, deckId) {
	        var deckName = decks[deckId].name;
	        var fieldNames = decks[deckId].fields;
	        var wordsArray = _.map(wordsArray, function(note) {
	            var fields = note[1].split('\x1f');
	            return _this.createObj(fieldNames, fields);
	        });
	        _this.importDeck(deckName,wordsArray);
	    });
	}
	
	createObj(fields, values) {
	    var object = {};
	    for (var i in values) {
	        object[fields[i]] = values[i];
	    }
	    return object;
	}
	
	decrypt(rawfile, options) {
	    var compressed = new Uint8Array(rawfile);
	    var unzip = new Zlib.Unzip(compressed);
	    var filenames = unzip.getFilenames();
	    if (filenames.indexOf("collection.anki2") >= 0) {
	        var plain = unzip.decompress("collection.anki2");
	        this.getInfo(plain);
	    }
	}
	
	importDeck(name,words) {
		(<Control>this.importForm.controls['deckName']).updateValue(name);
		this.words = words;
	}
	
	createDeck(deck) {
		var _this = this;
		var _words = this.words;
		if (this.importForm.valid && this.inputFile) {
			Decks.insert({
				name: deck.deckName,
			    description: deck.deckDescription,
			    creator: Meteor.userId()
			},
			function(err,id) {
				_this.deckCallback(err,id,_words);
			});
			this.words = [];
	    	this.inputFile = null;			
 	    }
	}
	
	deckCallback(err, id, words) {
		if( err ) return;
		
		this.newDeckId = id;
		var _this = this;
		var _wordCt = words.length;
				
    	for(let i in words) {
    		Words.insert({
		        front: words[i].Front,
		        back: words[i].Back,
		        score: 0,
		        creator: Meteor.userId(),
		        deckid: id
			},
			function(err,id) {
				_wordCt = _this.wordCallback(err,id,_wordCt);
			});
		}
	}
	
	wordCallback(err, id, wordCt) {
		if( err ) return;
		
		wordCt--;
		if(wordCt === 0) {
			this.router.navigate(['/WordList', {deckId: this.newDeckId}]);
		}
		return wordCt;
	}
}