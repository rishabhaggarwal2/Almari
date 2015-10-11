'use strict';

angular.module('parseService', ['ngResource'])
.factory('ParseService', function($resource) {
  Parse.initialize('ixCXGcpZanUyXQKNMWDCSTLdEhhSeVymvE6HEH6F', 'ewTYaHPjOa73YjmHjHoBks0UO5IaPw4jKMlucghA');

  var loggedInUser;

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

    signUp : function signUp(username, password, done) {
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
      Parse.User.logout();
    },

    addProduct: function addProduct(fields, done) {
      // FIXME: remove once invariant in place
      if (!loggedInUser) {
        return done(new Error('Must be logged in to do this'));
      }

      var product = new Product();
      ['gender', 'size', 'productId', 'category', 'imageUrl', 'description', 'name','company','price'].forEach(function(key) {
        if (fields[key]) {
          product.set(key, fields[key]);
        }
      });
      product.set('owner', loggedInUser.get('username'));
      product.set('pid', uuid.v1());

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

    findProductsByCategory: function findProductsByCategory(category, done) {
      var query = new Parse.Query(Product);
      query.equalTo('category', category);
      query.find({
        success: function(results) {
          done(null, results);
        },
        error: done
      });
    },

    findMyProducts: function findMyProducts(done) {
      // FIXME: remove once invariant in place
      if (!loggedInUser) {
        return done(new Error('Must be logged in to do this'));
      }

      var query = new Parse.Query(Product);
      query.equalTo('owner', loggedInUser.get('username'));
      query.find({
        success: function(results) {
          done(null, results);
        },
        error: done
      });
    }
  };

  return ParseService;

});