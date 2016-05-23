import 'reflect-metadata';
import 'zone.js/dist/zone';
import {Component, AfterViewInit} from 'angular2/core';
import {FormBuilder, ControlGroup, Validators, Control} from 'angular2/common';
 
@Component({
	selector: 'import-deck',
	templateUrl: '/client/components/import-deck/import-deck.html'
})

export class ImportDeck implements AfterViewInit {
	importForm: ControlGroup;
	inputFile;
	
	constructor () {
		let fb = new FormBuilder();
 		this.importForm = fb.group({
      		inputfile: ['',Validators.required]
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
	        console.log(deckName);
	        console.log(wordsArray);
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
}