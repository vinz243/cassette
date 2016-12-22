'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _Controller = require('./Controller');

var _Controller2 = _interopRequireDefault(_Controller);

var _Model = require('../models/Model');

var _Model2 = _interopRequireDefault(_Model);

var _ava = require('ava');

var _ava2 = _interopRequireDefault(_ava);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _ava2.default)('Controller should map routes correctly', function (t) {
  var Person = new _Model2.default('person').field('name').done().done();

  var routes = new _Controller2.default(Person).done();

  // console.log(routes);
  t.not(routes['/v1/people'].get, undefined);
  t.not(routes['/v1/people/:id'].get, undefined);
});
(0, _ava2.default)('Controller should support prefix', function (t) {
  var Person = new _Model2.default('block').field('name').done().done();

  var routes = new _Controller2.default(Person).prefix('/foo').done();

  t.not(routes['/v1/foo/blocks'].get, undefined);
  t.not(routes['/v1/foo/blocks/:id'].get, undefined);
});

(0, _ava2.default)('Controller should be able to query', function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(t) {
    var Pet, routes, ctx, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, pet;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            Pet = new _Model2.default('pet').field('name').string().required().done().field('legs').int().done().done();
            _context.next = 3;
            return new Pet({ name: 'cat', legs: 4 }).create();

          case 3:
            _context.next = 5;
            return new Pet({ name: 'dog', legs: 4 }).create();

          case 5:
            _context.next = 7;
            return new Pet({ name: 'mice', legs: 4 }).create();

          case 7:
            routes = new _Controller2.default(Pet).done();
            ctx = {
              params: {}
            };
            _context.next = 11;
            return routes['/v1/pets'].get(ctx);

          case 11:
            t.is(ctx.body.length, 3);
            t.is(ctx.body.data.length, 3);
            t.is(ctx.body.status, 'success');

            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context.prev = 17;
            for (_iterator = (0, _getIterator3.default)(ctx.body.data); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              pet = _step.value;

              t.not(pet.name, undefined);
              t.not(pet.legs, undefined);
            }

            _context.next = 25;
            break;

          case 21:
            _context.prev = 21;
            _context.t0 = _context['catch'](17);
            _didIteratorError = true;
            _iteratorError = _context.t0;

          case 25:
            _context.prev = 25;
            _context.prev = 26;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 28:
            _context.prev = 28;

            if (!_didIteratorError) {
              _context.next = 31;
              break;
            }

            throw _iteratorError;

          case 31:
            return _context.finish(28);

          case 32:
            return _context.finish(25);

          case 33:
            ctx = {
              params: {},
              query: {
                limit: 2
              }
            };

            _context.next = 36;
            return routes['/v1/pets'].get(ctx);

          case 36:
            t.is(ctx.body.length, 2, 'does not support limit parameter');
            t.is(ctx.body.data.length, 2);
            t.is(ctx.body.status, 'success');

            ctx = {
              params: {},
              query: {
                limit: 42
              }
            };

            _context.next = 42;
            return routes['/v1/pets'].get(ctx);

          case 42:

            t.is(ctx.body.length, 3, 'does not support limit parameter');
            t.is(ctx.body.data.length, 3);
            t.is(ctx.body.payload.query.limit, 25, 'does not set a maximum value for limit');
            t.is(ctx.body.status, 'success');

          case 46:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[17, 21, 25, 33], [26,, 28, 32]]);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());
(0, _ava2.default)('Controller should be able to find one by id', function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(t) {
    var Vehicule, car, routes, ctx;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            Vehicule = new _Model2.default('vehicule').field('name').string().required().done().field('wheels').int().done().done();
            car = new Vehicule({ name: 'car', wheels: 4 });
            _context2.next = 4;
            return car.create();

          case 4:
            _context2.next = 6;
            return new Vehicule({ name: 'moto', wheels: 2 }).create();

          case 6:
            routes = new _Controller2.default(Vehicule).done();
            ctx = {
              params: {
                id: car._id
              },
              query: {}
            };
            _context2.next = 10;
            return routes['/v1/vehicules/:id'].get(ctx);

          case 10:

            t.is(ctx.body.data.wheels, 4);
            t.is(ctx.body.data.name, 'car');

            ctx = {
              params: {
                id: '42'
              },
              query: {}
            };

            _context2.next = 15;
            return routes['/v1/vehicules/:id'].get(ctx);

          case 15:

            t.is(ctx.status, 404);
            t.is(ctx.body.payload.params.id, '42');

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

(0, _ava2.default)('should support searches', function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(t) {
    var Weapon, ctrller, ctx, search;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            Weapon = new _Model2.default('weapon').field('name').string().required().done().field('type').string().done().field('fireRate').int().done().done();
            ctrller = new _Controller2.default(Weapon).done();
            _context3.next = 4;
            return new Weapon({
              name: 'Famas',
              fireRate: 1000,
              type: 'AssaultRifle'
            }).create();

          case 4:
            _context3.next = 6;
            return new Weapon({
              name: 'AEK-971',
              fireRate: 900,
              type: 'AssaultRifle'
            }).create();

          case 6:
            _context3.next = 8;
            return new Weapon({
              name: 'M16A1',
              fireRate: 700,
              type: 'AssaultRifle'
            }).create();

          case 8:
            _context3.next = 10;
            return new Weapon({
              name: 'M16A2',
              fireRate: 700,
              type: 'AssaultRifle'
            }).create();

          case 10:
            _context3.next = 12;
            return new Weapon({
              name: 'M16A4',
              fireRate: 750,
              type: 'AssaultRifle'
            }).create();

          case 12:
            _context3.next = 14;
            return new Weapon({
              name: 'MK Mod 11',
              type: 'DMR'
            }).create();

          case 14:
            _context3.next = 16;
            return new Weapon({
              name: 'MK Mod 8',
              type: 'DMR'
            }).create();

          case 16:
            ctx = { body: {}, request: {} };

            ctx.request.fields = {
              name: 'Famas'
            };

            search = ctrller['/v1/weapons/searches'].post;
            _context3.next = 21;
            return search(ctx);

          case 21:
            t.is(ctx.body.length, 1);
            t.is(ctx.body.data[0].fireRate, 1000);

            ctx.request.fields = {
              fireRate: 700
            };
            _context3.next = 26;
            return search(ctx);

          case 26:
            t.is(ctx.body.length, 2);
            t.is(ctx.body.data[0].fireRate, 700);
            t.is(ctx.body.data[1].fireRate, 700);

            ctx.request.fields = {
              name: '/16A/'
            };
            _context3.next = 32;
            return search(ctx);

          case 32:
            t.is(ctx.body.length, 3);

          case 33:
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

(0, _ava2.default)('should support allowPost, put and del', function () {
  var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(t) {
    var Object, routes;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            Object = new _Model2.default('object').field('name').string().required().done().done();
            routes = new _Controller2.default(Object).allowPost().allowPut().allowDel().allowSearches().done();

          case 2:
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

(0, _ava2.default)('supports oneToMany relations', function () {
  var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(t) {
    var Parent, Child, bruce, thomas, martha, yourMother, routes, ctx;
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
            routes = new _Controller2.default(Child).done();
            ctx = {
              params: {
                id: bruce._id
              },
              query: {}
            };
            _context5.next = 20;
            return routes['/v1/children/:id/parents'].get(ctx);

          case 20:
            t.is(ctx.body.data.length, 2);

            ctx.query.name = 'Thomas';
            _context5.next = 24;
            return routes['/v1/children/:id/parents'].get(ctx);

          case 24:
            t.is(ctx.body.data.length, 1);
            t.is(ctx.body.data[0].name, 'Thomas');

          case 26:
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
;

(function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }
})();

;