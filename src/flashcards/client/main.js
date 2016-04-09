WordsList = new Mongo.Collection('words');

if(Meteor.isClient){
  Template.flashcard.helpers({
    'word': function(){
        return WordsList.find()
    }
  });
}

if(Meteor.isServer){
    console.log("Hello server");
}
if(Meteor.isClient){
    Template.flashcard.helpers({
    	'word': function(){
        return WordsList.find()
    },
    	'selectedClass': function(){
            var wordId = this._id;
    		var selectedWord = Session.get('selectedWord');
    		if(wordId == selectedWord){
        	return "selected"
    }
    }
	});

    Template.flashcard.events({
	'click .word': function(){
		var wordId = this._id;
		Session.set('selectedWord', wordId);
	    var selectedWord = Session.get('selectedWord');
		console.log(selectedWord);
	},
	'click .increment': function(){
        var selectedWord = Session.get('selectedWord');
    	WordsList.update(selectedWord, {$inc: {score: 5} });
    },

    'click .decrement': function(){
    var selectedWord = Session.get('selectedWord');
    WordsList.update(selectedWord, {$inc: {score: -5} });
	}
});


}