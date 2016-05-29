import 'reflect-metadata';
import 'zone.js/dist/zone';
import {Meteor} from 'meteor/meteor';
import {Component, AfterViewInit, ChangeDetectorRef} from 'angular2/core';
import {FormBuilder, ControlGroup, Validators, Control} from 'angular2/common';
import {Router, RouteParams} from 'angular2/router'
import {Decks} from '../../../collections/decks';
import {Words} from '../../../collections/words';
 
@Component({
	selector: 'import-deck',
	templateUrl: '/client/components/import-deck/import-deck.html'
})

export class ImportDeck implements AfterViewInit {
  showWindow: boolean = false;
	importForm: ControlGroup;
	inputFile;
	words: Array<Object>;
	
	constructor (private router:Router, private params: RouteParams, private ref: ChangeDetectorRef) {
		this.words = [];
		this.inputFile = null;
		let fb = new FormBuilder();
 		this.importForm = fb.group({
      		inputfile: ['']
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
		this.words = words;
	}
	
	addWords() {
		var _this = this;
		var _words = this.words;
		if (this.importForm.valid && this.inputFile) {
		  var _this = this;
		  var _wordCt = this.words.length;
		  
		  /*let docs = [];
		  for(let i in this.words) {
		    docs.push({
		      front: this.words[i].Front,
          back: this.words[i].Back,
          score: 0,
          creator: Meteor.userId(),
          deckid: this.params.get('deckId')
		    });
		  }
		  this.insertBulk(Words,docs);*/
				
    	for(let i in this.words) {
        setTimeout( function() {
      		Words.insert({
  	        front: _this.words[i].Front,
  	        back: _this.words[i].Back,
  	        score: 0,
  	        creator: Meteor.userId(),
  	        deckid: _this.params.get('deckId')
    			},
    			function(err,id) {
    				_wordCt = _this.wordCallback(err,_wordCt);
    			});
    		}, 10);
      }
		}
	}
	
	wordCallback(err, wordCt) {
		if( err ) return;
		
		wordCt--;
		if(wordCt === 0) {
		  this.words = [];
		  (<Control>this.importForm.controls['inputfile']).updateValue('');
			this.closeWindow();
		}
		return wordCt;
	}
	
	insertBulk = function(collection, documents){
    if(collection) {
      return _.compact(_.map(documents, function(item){
        if(_.isObject(item)) {
          var _id = collection._makeNewID();

          // insert with reactivity only on the last item
          if(_.last(documents) === item)
            _id = collection.insert(item);

          // insert without reactivity
          else {
            item._id = _id;
            collection._collection._docs._map[_id] = item;
          }

          return _id;
        }
      }));
    }
  }
	
	 openWindow() {
    this.showWindow = true;
    this.ref.detectChanges();
  }
  
  closeWindow() {
    this.showWindow = false;
    this.ref.detectChanges();
  }
}