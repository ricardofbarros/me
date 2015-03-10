/*global app*/
var log = require('bows')('app')
var config = require('clientconfig')
var domReady = require('domready')

var MainView = require('./views/main')

module.exports = {
  // this is the the whole app initter
  blastoff: function () {
    var self = window.app = this
    self.buildGlobals()

    log('config', config)

    // The html must be build async
    // or else the facebook oauth
    // doesnt work
    self.buildHTML()
  },

  // init globals
  buildGlobals: function () {
    // jquery global
    window.$ = window.jQuery = require('jquery')
  },

  buildHTML: function () {
    // wait for document ready to render our main view,
    // this ensures the document has a body, etc.
    domReady(function () {
      var self = app

      var mainView

      // init our main view
      mainView = self.view = new MainView({
        el: document.body
      })

      mainView.render()

    })
  }
}

// run it
module.exports.blastoff()
