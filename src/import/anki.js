function getInfo(rawData) {
    var cardsInfo;
    var db = new SQL.Database(rawData);
    decks = db.exec("SELECT decks FROM col");
    decks = Function('return ' + decks[0].values[0][0])();
    col = db.exec("SELECT models FROM col");
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
            return createObj(fieldNames, fields);
        });
        console.log(deckName);
        console.log(wordsArray);
    });
}

function createObj(fields, values) {
    var object = {};
    for (i in values) {
        object[fields[i]] = values[i];
    }
    return object;
}

function Decrypt(rawfile, options) {
    var compressed = new Uint8Array(rawfile);
    var unzip = new Zlib.Unzip(compressed);
    var filenames = unzip.getFilenames();
    if (filenames.indexOf("collection.anki2") >= 0) {
        var plain = unzip.decompress("collection.anki2");
        getInfo(plain);
    }
}

function loadFile() {
    console.log("Page is loaded");
    var options = {};
    $("#inputfile").change({

        function(data) {
                Decrypt(data);
        }},

        function(event) {
            event.stopPropagation();
            event.preventDefault();
            var f = event.target.files[0];
            var reader = new FileReader();
            reader.onload = function(e) { event.data.function(e.target.result); };
            reader.readAsArrayBuffer(f);
        });

}



