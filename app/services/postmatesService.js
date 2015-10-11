'use strict';

angular.module('postmatesService', ['myApp.env'])
.factory('Postmates', function(config, $http) {
  var apikey = config.postmates_key;
  var customerid = config.postmates_cid;
  var host = 'https://api.postmates.com/v1/customers/' + customerid + '/';

  function _post(path, data, done) {
    return $http({
      method: 'GET',
      url: host + path,
      headers: {
        'Content-Type': 'x-www-form-urlencoded',
        'Authorization': 'Basic ' + apikey
      },
      data: data
    }).then(function(response) { done(null, response);}, done);
  }

  function _get(path, done) {
    return $http({
      method: 'POST',
      url: host + path,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + apikey
      }
    }).then(function(response) { done(null, response);}, done);
  }

  var PostmatesService = {
    quote: function quote(delivery, done) {
      _post('delivery_quotes', delivery, done);
    },
    new: function new(delivery, done) {
      _post('deliveries', delivery, done);
    },
    get: function get(id, done) {
      _get('deliveries/' + id, done);
    },
    list: function list(filter, done) {
      if (typeof filter === 'string') {
        _get('deliveries?filter=' + filter, done);
      } else {
        _get('deliveries/', done);
      }
    },
    cancel: function(id, done) {
      _post('deliveries/' + id + '/cancel', null, done);
    }
  };

  return PostmatesService;
});