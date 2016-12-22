'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _Model = require('./Model');

var _Model2 = _interopRequireDefault(_Model);

var _ava = require('ava');

var _ava2 = _interopRequireDefault(_ava);

var _process = require('process');

var _process2 = _interopRequireDefault(_process);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _ava2.default)('constructor should snake case db name', function (t) {
  t.is(new _Model2.default('myDoc').dbName, 'my_docs');
});

(0, _ava2.default)('field should type correctly to float', function (t) {
  var m = new _Model2.default('myModel');
  var floatField = m.field('foo').float();

  t.is(floatField.type, 'float');

  t.falsy(floatField.validator('foo'));
  t.falsy(floatField.validator('e'));
  t.falsy(floatField.validator());
  t.falsy(floatField.validator({}));
  t.falsy(floatField.validator(NaN));
  t.falsy(floatField.validator(function () {}));

  t.truthy(floatField.validator(15));
  t.truthy(floatField.validator(42.1));
  t.truthy(floatField.validator(-1337));
});

(0, _ava2.default)('field should type correctly to int', function (t) {
  var m = new _Model2.default('myModel');
  var intField = m.field('foo').int();

  t.is(intField.type, 'int');

  t.falsy(intField.validator('foo'));
  t.falsy(intField.validator('e'));
  t.falsy(intField.validator());
  t.falsy(intField.validator({}));
  t.falsy(intField.validator(NaN));
  t.falsy(intField.validator(function () {}));
  t.falsy(intField.validator(42.1));

  t.truthy(intField.validator(15));
  t.truthy(intField.validator(-1337));
});

(0, _ava2.default)('field should type correctly to string', function (t) {
  var m = new _Model2.default('myModel');
  var stringField = m.field('foo').string();

  t.is(stringField.type, 'string');

  t.truthy(stringField.validator('foo'));
  t.truthy(stringField.validator('e'));

  t.falsy(stringField.validator());
  t.falsy(stringField.validator({}));
  t.falsy(stringField.validator(NaN));
  t.falsy(stringField.validator(function () {}));
  t.falsy(stringField.validator(42.1));
});

(0, _ava2.default)('field should type correctly to bool', function (t) {
  var m = new _Model2.default('myModel');
  var boolField = m.field('foo').boolean();

  t.is(boolField.type, 'boolean');

  t.falsy(boolField.validator('foo'));
  t.falsy(boolField.validator());
  t.falsy(boolField.validator({}));
  t.falsy(boolField.validator(NaN));
  t.falsy(boolField.validator(function () {}));

  t.truthy(boolField.validator(true));
});

(0, _ava2.default)('field should type correctly to any', function (t) {
  var m = new _Model2.default('myModel');
  var anyField = m.field('foo').any();

  t.is(anyField.type, 'any');

  t.truthy(anyField.validator('foo'));
  t.truthy(anyField.validator());
  t.truthy(anyField.validator({}));
  t.truthy(anyField.validator(NaN));
  t.truthy(anyField.validator(function () {}));
  t.truthy(anyField.validator({
    foo: 'bar',
    numbers: [1337, '42'],
    cat: { dog: { this: { makes: { no: { sense: true } } } } }
  }));
  t.truthy(anyField.validator(true));
  t.truthy(anyField.validator(true));
});

(0, _ava2.default)('should chain calls without Error', function (t) {
  new _Model2.default('MyModel').field('itemName').required().string().done().field('itemCategory').float().notIdentity() // <-- means won't be accepted as a query
  .done().noDuplicates().acceptsEmptyQuery().done();
});
var personModel = function personModel(name) {
  return new _Model2.default(name).noDuplicates().field('name').required().string().defaultParam().done().field('age').int().done().done();
};
(0, _ava2.default)('model should accept a default type', function (t) {
  var Person = personModel('Person');

  t.is(new Person('Danny').data.name, 'Danny');
});
(0, _ava2.default)('model should generate correct payloads', function (t) {

  var Person = personModel('People');
  var bilbo = new Person({
    name: 'Bilbo',
    age: 131
  });
  t.deepEqual(bilbo.getPayload(), {
    name: 'Bilbo',
    age: 131
  });

  t.throws(function () {
    return new Person({}).getPayload();
  });

  t.deepEqual(new Person({
    name: 'Aragorn',
    age: 121.2,
    height: 175
  }).getPayload(), {
    name: 'Aragorn'
  });

  t.throws(function () {
    new Person({ name: 42 }).getPayload();
  });
});
(0, _ava2.default)('model should create() correctly and then find it by id and name', function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(t) {
    var Person, bilbo, frodo, res;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            Person = personModel('Individuals');
            bilbo = new Person({
              name: 'Bilbo',
              age: 131
            });
            _context.next = 4;
            return bilbo.create();

          case 4:
            frodo = new Person({ name: 'Frodo' });
            _context.next = 7;
            return frodo.create();

          case 7:

            t.not(bilbo._id, undefined);

            _context.next = 10;
            return Person.findById(bilbo._id);

          case 10:
            res = _context.sent;

            t.is(res.data.age, 131);
            t.is(res.data.name, 'Bilbo');

            _context.next = 15;
            return Person.find({ name: 'Bilbo' });

          case 15:
            res = _context.sent[0];

            t.is(res.data._id, bilbo._id);
            t.is(bilbo.data.age, 131);

          case 18:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());

(0, _ava2.default)('Model set function', function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(t) {
    var Person, jon;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            Person = personModel('Ppl');
            jon = new Person({ name: 'Jon Snow' });
            _context2.next = 4;
            return jon.create();

          case 4:

            jon.set('name', 'Jon Targaryen');

            _context2.t0 = t;
            _context2.next = 8;
            return Person.findById(jon._id);

          case 8:
            _context2.t1 = _context2.sent.data.name;

            _context2.t0.is.call(_context2.t0, _context2.t1, 'Jon Snow');

            _context2.next = 12;
            return jon.update();

          case 12:
            _context2.t2 = t;
            _context2.next = 15;
            return Person.findById(jon._id);

          case 15:
            _context2.t3 = _context2.sent.data.name;

            _context2.t2.is.call(_context2.t2, _context2.t3, 'Jon Targaryen');

          case 17:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function (_x2) {
    return _ref2.apply(this, arguments);
  };
}());

(0, _ava2.default)('finds multiple docs', function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(t) {
    var Person, john, joe, harvey;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            Person = personModel('Dudes');
            john = new Person({
              name: 'john',
              age: 34
            });
            _context3.next = 4;
            return john.create();

          case 4:
            joe = new Person({
              name: 'joe',
              age: 34
            });
            _context3.next = 7;
            return joe.create();

          case 7:
            harvey = new Person({
              name: 'harvey',
              age: 42
            });
            _context3.next = 10;
            return harvey.create();

          case 10:
            _context3.t0 = t;
            _context3.next = 13;
            return Person.find({ age: 34 });

          case 13:
            _context3.t1 = _context3.sent.length;

            _context3.t0.is.call(_context3.t0, _context3.t1, 2);

            _context3.t2 = t;
            _context3.next = 18;
            return Person.find({ age: 42 });

          case 18:
            _context3.t3 = _context3.sent.length;

            _context3.t2.is.call(_context3.t2, _context3.t3, 1);

          case 20:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function (_x3) {
    return _ref3.apply(this, arguments);
  };
}());

(0, _ava2.default)('correct dup check', function () {
  var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(t) {
    var Soul, joe, joey;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            Soul = personModel('soul');
            joe = new Soul('joe');
            _context4.next = 4;
            return joe.create();

          case 4:
            joey = new Soul('joe');

            t.throws(joey.create());

          case 6:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function (_x4) {
    return _ref4.apply(this, arguments);
  };
}());

(0, _ava2.default)('oneToMany', function () {
  var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(t) {
    var Parent, Child, bruce, thomas, martha, yourMother, parents;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            Parent = new _Model2.default('parent').field('name').string().required().defaultParam().done().field('childId').string().done().done();
            Child = new _Model2.default('child').field('name').string().required().defaultParam().done().oneToMany(Parent, 'childId').done();
            bruce = new Child('Bruce');
            _context5.next = 5;
            return bruce.create();

          case 5:
            thomas = new Parent('Thomas');

            thomas.data.childId = bruce.data._id;
            _context5.next = 9;
            return thomas.create();

          case 9:
            martha = new Parent('Martha');

            martha.data.childId = bruce.data._id;
            _context5.next = 13;
            return martha.create();

          case 13:
            yourMother = new Parent('Lady of the night'); // :D :D :D

            _context5.next = 16;
            return yourMother.create();

          case 16:
            _context5.next = 18;
            return bruce.getParents();

          case 18:
            parents = _context5.sent;

            t.is(parents.length, 2);

            if (parents[0].name == 'Thomas') {
              t.is(parents[1].data.name, 'Martha');
              t.is(parents[1].data._id, martha._id);
              t.is(parents[0].data._id, thomas._id);
            } else {
              t.is(parents[1].data.name, 'Thomas');
              t.is(parents[0].data.name, 'Martha');
              t.is(parents[1].data._id, thomas.data._id);
              t.is(parents[0].data._id, martha.data._id);
            }

            // Let's check it support basic query
            _context5.next = 23;
            return bruce.getParents({ limit: 1 });

          case 23:
            parents = _context5.sent;

            t.is(parents.length, 1);
            _context5.next = 27;
            return bruce.getParents({ name: /lady/ });

          case 27:
            parents = _context5.sent;

            t.is(parents.length, 0);
            _context5.next = 31;
            return bruce.getParents({ name: /mas/ });

          case 31:
            parents = _context5.sent;

            t.is(parents.length, 1);
            t.is(parents[0].data.name, 'Thomas');

          case 34:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined);
  }));

  return function (_x5) {
    return _ref5.apply(this, arguments);
  };
}());

(0, _ava2.default)('implements function work', function (t) {
  var called = false;

  var say = function say(name, str) {
    t.is(name, 'Bacon');
    t.is(str, 'meoooow');
    called = true;
  };
  var Cat = new _Model2.default('cat').field('name').required().string().defaultParam().done().implement('getMeowing', function (length) {
    return 'me' + 'o'.repeat(length) + 'w';
  }).implement('meow', function (length) {
    return say(this.data.name, this.getMeowing(length));
  }).done();

  new Cat('Bacon').meow(4);
  t.truthy(called);
});

(0, _ava2.default)('hooks', function () {
  var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(t) {
    var barks, hook, Dog, Beiley;
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            barks = 1;

            hook = function hook(self) {
              // console.log(Object.getOwnPropertyNames(self));
              self.bark();
            };

            Dog = new _Model2.default('dog').field('name').required().string().defaultParam().done().implement('bark', function () {
              barks += 1;
            }).hook('construct:after', function (self) {
              hook(self);
            }).hook('create:before', hook).hook('create:after', hook).done();
            Beiley = new Dog('Beiley');
            // t.is(barks, 2);

            _context6.next = 6;
            return Beiley.create();

          case 6:
            t.is(barks, 4);

          case 7:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, undefined);
  }));

  return function (_x6) {
    return _ref6.apply(this, arguments);
  };
}());

(0, _ava2.default)('default value', function () {
  var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(t) {
    var Bird, sparrow;
    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            Bird = new _Model2.default('bird').field('tweet').string().defaultValue('tweet-tweet').done().done();
            sparrow = new Bird();

            t.is(sparrow.data.tweet, 'tweet-tweet');

          case 3:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, undefined);
  }));

  return function (_x7) {
    return _ref7.apply(this, arguments);
  };
}());
;

(function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(personModel, 'personModel', 'src/server/models/Model.test.js');
})();

;