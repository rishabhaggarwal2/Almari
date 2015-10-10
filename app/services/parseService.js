'use strict';

angular.module('parseService', ['ngResource'])
.factory('ParseService', function($resource) {
  Parse.initialize('ixCXGcpZanUyXQKNMWDCSTLdEhhSeVymvE6HEH6F', 'ewTYaHPjOa73YjmHjHoBks0UO5IaPw4jKMlucghA');

  var loggedInUser;

  var Product = Parse.Object.extend('Product');

  var ParseService = {
    name: 'Parse',

    login: function login(username, password, done) {
      Parse.User.login(username, password, {
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
      var product = new Product();
      ['price', 'deposit', 'link', 'category', 'imageUrl'].forEach(function(key) {
        if (fields[key]) {
          product.set(key, fields[key]);
        }
      });
      product.set('owner', loggedInUser.get('username'));
      product.set('id', uuid.v1());
      product.save(null, {
        success: function(product) {
          done(null, product);
        },
        error: function(product, error) {
          done(error);
        }
      });
    }
  };

  return ParseService;

});