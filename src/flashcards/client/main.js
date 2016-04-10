WordsList = new Mongo.Collection('words');

/*if(Meteor.isClient){
  Template.flashcard.helpers({
    'word': function(){
        return WordsList.find()
    }
  });
}*/

if(Meteor.isServer){
    console.log("Hello server");
}
if(Meteor.isClient){
    Template.flashcard.helpers({
        'word': function(){
        var currentUserId = Meteor.userId();
        return WordsList.find({creator: currentUserId},
                            {sort: {score: -1, name: 1}});
    },
        'selectedClass': function(){
            var wordId = this._id;
            var selectedWord = Session.get('selectedWord');
            if(wordId == selectedWord){
            return "selected"
    }
    },

        'showSelectedWord': function(){
        var selectedWord = Session.get('selectedWord');
        return WordsList.findOne(selectedWord)
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
    },

    'click .remove': function(){
    var selectedWord = Session.get('selectedWord');
    WordsList.remove(selectedWord);
}

});

    Template.addWordForm.events({
    'submit form': function(event){
     event.preventDefault();
    var wordNameVar = event.target.wordName.value;
    var currentUserId = Meteor.userId();
    WordsList.insert({
          name: wordNameVar,
          score: 0,
          creator: currentUserId
      });
    }
  });



}