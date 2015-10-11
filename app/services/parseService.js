'use strict';

/* Parse data access layer
 * All methods use node-style callback:
 *   On success: callback(null, result obj)
 *   On error:   callback(Error/Parse-Error obj) - .message for string
 *
 * Users:
 *   login
 *   signUp
 *   logout
 *   pinProduct
 *   borrowProduct
 * 
 * Products:
 *   addProduct - Create
 *   findProducts - Read, cached
 */
angular.module('parseService', [])
.factory('ParseService', function() {
  Parse.initialize('ixCXGcpZanUyXQKNMWDCSTLdEhhSeVymvE6HEH6F', 'ewTYaHPjOa73YjmHjHoBks0UO5IaPw4jKMlucghA');

  // cache stuff
  var loggedInUser;
  var productsCache;

  var Product = Parse.Object.extend('Product');

  var ParseService = {
    name: 'Parse',

    login: function login(username, password, done) {
      Parse.User.logIn(username, password, {
        success: function(user) {
          loggedInUser = user;
          done();
        },
        error: function(user, error) {
          done(error);
        }
      });
    },

    signUp: function signUp(username, password, done) {
      Parse.User.signUp(username, password, { ACL: new Parse.ACL() }, {
        success: function(user) {
          loggedInUser = user;
          done();
        },
        error: function(user, error) {
          done(error);
        }
      });
    },

    logout: function logout() {
      Parse.User.logOut();
    },

    username: function username() {
      if (Parse.User.current()) {
        return Parse.User.current().get('username');
      } else {
        return '';
      }
    },

    pinProduct: function pinProduct(pid, done) {
      Parse.User.current().addUnique('productsPinned', pid);
      Parse.User.current().save(null, {
        success: function(product) {
          done(null, product);
        },
        error: function(product, err) {
          done(err);
        }
      });
    },

    /* Set product's in-use to true and add lendee. Add pid to user's products */
    borrowProduct: function borrowProduct(pid, done) {
      if (!Parse.User.current()) {
        return done(new Error('Must be logged in to do this'));
      }

      var query = new Parse.Query('Product');
      query.equalTo('pid', pid);
      query.first()
      .then(function(product) {
        if (product.inUse) {
          throw new Error('Product has already been borrowed');
        }
        product.set('inUse', true);
        product.set('lendee', Parse.User.current().get('username'));
        return product.save();
      })
      .then(function() {
        Parse.User.current().addUnique('productsBorrowed');
        return Parse.User.current().save();
      })
      .then(function() {
        done();
      }, function(err) {
        done(err);
      });
    },

    addProduct: function addProduct(fields, done) {
      if (!Parse.User.current()) {
        return done(new Error('Must be logged in to do this'));
      }

      var product = new Product();
      ['gender', 'size', 'productId', 'category', 'imageUrl', 'description', 'name', 'company', 'imageUrl'].forEach(function(key) {
        if (fields[key]) {
          product.set(key, fields[key]);
        }
      });
      product.set('owner', Parse.User.current().get('username'));
      product.set('pid', uuid.v1());
      product.set('inUse', false);

      var productACL = new Parse.ACL();
      productACL.setPublicReadAccess(true);
      productACL.setWriteAccess(Parse.User.current().id, true);
      product.setACL(productACL);

      product.save(null, {
        success: function(product) {
          done(null, product);
        },
        error: function(product, error) {
          done(error);
        }
      });
    },

    /* filters: {field: value} equalities added to query
     * eg. I only want 'Wedding' dresses of size 'S':
     * 
     *   findProducts({category: 'Wedding', size 'S'}, callback);
     */
    findProducts: function findProducts(filters, done) {
      var query = new Parse.Query(Product);
      _.forOwn(filters, function(val, key) {
        query.equalTo(key, val);
      });

      query.find({
        success: function(results) {
          productsCache = results;
          done(null, results);
        },
        error: done
      });
    },

    /* My products: products I own, have pinned, and have currently borrowed */
    findMyProducts: function findMyProducts(done) {
      var ownedQuery = new Parse.query(Product);
      ownedQuery.equalTo('owner', Parse.User.current().get('username'));
    },



    findProductByPid: function findProductByPid(pid, done) {
        var query = new Parse.Query(Product);
        query.equalTo('id', pid);
        query.first().then(function(result) {
          done(null, result);
        }, done);
      },
      


    findProduct: function findProduct(pid, done) {
      if (productsCache && productsCache.length > 0) {
        var match = _.filter(productsCache, function(obj) {
          return obj.pid === pid;
        });
        if (match.length > 0) {
          done(null, match[0]);
        } else {
          return _findProductByPid(pid, done);
        }
      } else {
        return _findProductByPid(pid, done);
      }
    }
  };

  function _findProductByPid(pid, done) {
    var query = new Parse.Query(Product);
    query.equalTo('id', pid);
    query.first().then(function(result) {
      done(null, result);
    }, done);
  }

  return ParseService;

});