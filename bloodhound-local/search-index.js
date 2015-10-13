
function SearchIndex(o) {
  o = o || {};

  if (!o.datumTokenizer || !o.queryTokenizer || !o.identify) {
    throw new Error('datumTokenizer and queryTokenizer are both required');
  }

  this.identify = o.identify;
  this.datumTokenizer = o.datumTokenizer;
  this.queryTokenizer = o.queryTokenizer;
  this.matchAnyQueryToken = o.matchAnyQueryToken;

  this.reset();
}

// instance methods
// ----------------
SearchIndex.prototype = {

  // ### public

  bootstrap: function bootstrap(o) {
    this.datums = o.datums;
    this.trie = o.trie;
  },

  add: function(data) {

    data = Array.isArray(data) ? data : [data];

    data.forEach(function(datum) {
      var id = this.identify(datum);
      var tokens = normalizeTokens(this.datumTokenizer(datum));

      this.datums[id] = datum;

      tokens.forEach(function(token) {
        var node = this.trie;
        var chars = token.split('');

        while (chars.length) {
          var ch = chars.shift();
          node = node.children[ch] || (node.children[ch] = newNode());
          node.ids.push(id);
        }
      }, this);
    }, this);
  },

  remove: function(data) {
    data = Array.isArray(data) ? data : [data];

    data.forEach(function(datum) {
      var id = this.identify(datum);
      var tokens = normalizeTokens(this.datumTokenizer(datum));

      delete this.datums[id];

      tokens.forEach(function(token) {
        var node = this.trie;
        var chars = token.split('');

        while (chars.length && node) {
          var ch = chars.shift();
          var parent = node;
          node = node.children[ch];
          if(node) {
            var idx = node.ids.indexOf(id);
            if(idx >= 0) {
              node.ids.splice(idx, 1);

              if(node.ids.length == 0) {
                delete parent.children[ch];
                break;
              }
            } else {
              break;
            }
          }
        }
      }, this);
    }, this);
  },

  get: function get(ids) {
    return ids.map(function(id) { return this.datums[id]; }, this);
  },

  search: function search(query) {
    var matches;

    var tokens = normalizeTokens(this.queryTokenizer(query));

    tokens.every(function(token) {
      var ch, ids;

      // previous tokens didn't share any matches
      if (matches && matches.length === 0 && !this.matchAnyQueryToken) {
        return false;
      }

      var node = this.trie;
      var chars = token.split('');

      while (node && (ch = chars.shift())) {
        node = node.children[ch];
      }

      if (node && chars.length === 0) {
        ids = node.ids.slice(0);
        matches = matches ? intersection(matches, ids) : ids;
      }

      // break early if we find out there are no possible matches
      else {
        if (!this.matchAnyQueryToken) {
          matches = [];
          return false;
        }
      }
      return true;
    }, this);

    return unique(matches || []).map(function(id) { return this.datums[id]; }, this);
  },

  all: function all() {
    var values = [];

    for (var key in this.datums) {
      values.push(this.datums[key]);
    }

    return values;
  },

  reset: function reset() {
    this.datums = {};
    this.trie = newNode();
  },

  serialize: function serialize() {
    return { datums: this.datums, trie: this.trie };
  }
};

// helper functions
// ----------------

function normalizeTokens(tokens) {
  // filter out falsy tokens
  tokens = tokens.filter(Boolean);

  // normalize tokens
  tokens = tokens.map(function(token) { return token.toLowerCase(); });

  return tokens;
}

function newNode() {
  var node = {};

  node.ids = [];
  node.children = {};

  return node;
}

function unique(array) {
  var seen = {}, uniques = [];

  for (var i = 0, len = array.length; i < len; i++) {
    if (!seen[array[i]]) {
      seen[array[i]] = true;
      uniques.push(array[i]);
    }
  }

  return uniques;
}

function intersection(arrayA, arrayB) {
  var ai = 0, bi = 0, intersection = [];

  arrayA = arrayA.sort();
  arrayB = arrayB.sort();

  var lenArrayA = arrayA.length, lenArrayB = arrayB.length;

  while (ai < lenArrayA && bi < lenArrayB) {
    if (arrayA[ai] < arrayB[bi]) {
      ai++;
    }

    else if (arrayA[ai] > arrayB[bi]) {
      bi++;
    }

    else {
      intersection.push(arrayA[ai]);
      ai++;
      bi++;
    }
  }

  return intersection;
}

module.exports = SearchIndex;
