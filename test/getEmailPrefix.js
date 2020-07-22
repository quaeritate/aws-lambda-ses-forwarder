/* global describe, it */
var assert = require("assert");

var index = require("../index");

describe('index.js', function() {
  describe('#getEmailKeyPrefix()', function() {
    it('should return the original prefix if dynamicEmailKeyPrefix is missing',
      function(done) {
        var data = {
          config: {
            emailBucket: "bucket",
            emailKeyPrefix: "forwards/"
          },
          recipients: ["jim@example.com", "jane@example.com"],
          log: console.log
        };
        index.getEmailKeyPrefix(data)
          .then(function(data) {
            assert.equal(data.config.emailKeyPrefix,
              "forwards/",
              "Prefix is unaffected");
            done();
          });
      });

    it('should return the original prefix if dynamicEmailKeyPrefix is false',
      function(done) {
        var data = {
          config: {
            emailBucket: "bucket",
            emailKeyPrefix: "forwards/",
            dynamicEmailKeyPrefix: false
          },
          recipients: ["jim@example.com", "jane@example.com"],
          log: console.log
        };
        index.getEmailKeyPrefix(data)
          .then(function(data) {
            assert.equal(data.config.emailKeyPrefix,
              "forwards/",
              "Prefix is unaffected");
            done();
          });
      });

    it('should extract the username if dynamicEmailKeyPrefix is true',
      function(done) {
        var data = {
          config: {
            emailBucket: "bucket",
            emailKeyPrefix: "null/",
            dynamicEmailKeyPrefix: true
          },
          recipients: ["jim@example.com"],
          log: console.log
        };
        index.getEmailKeyPrefix(data)
          .then(function(data) {
            assert.equal(data.config.emailKeyPrefix,
              "jim/",
              "The username was extracted from the recipient");
            done();
          });
      });

    it('should error if there is more than one recipient ' +
      'and dynamicEmailKeyPrefix is true',
    function(done) {
      var data = {
        config: {
          emailBucket: "bucket",
          emailKeyPrefix: "null/",
          dynamicEmailKeyPrefix: true
        },
        recipients: [
          "jim@example.com",
          "jane@example.com",
          "jon@example.com"
        ],
        log: console.log
      };
      index.getEmailKeyPrefix(data)
        .catch(function(err) {
          assert.ok(err, "Bad configuration error");
          done();
        });
    });
  });
});
