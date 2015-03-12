/*global app, TweenMax, ScrollMagic, TimelineMax, $, Power4*/
var log = require('bows')('app')
var config = require('clientconfig')
var domReady = require('domready')
var Me = require('./models/me')

var MainView = require('./views/main')

module.exports = {
  // this is the the whole app initter
  blastoff: function () {
    var self = window.app = this
    self.buildGlobals()
    self.buildModels()

    log('config', config)

    // Set my information
    self.me

    // The html must be build async
    // or else the facebook oauth
    // doesnt work
    self.buildHTML(function () {
      // Animation loading To DO

      // After HTML is built time
      // to build animations
      self.buildAnimation()

      // Build effects triggered
      // by human action minus
      // scrolling
      self.buildEffects()

      /* Event listeners */
      $(window).on('load', function () {
        console.log('load removing')

        // Responsive quirks
        self.buildResponsiveness()

        setTimeout(function () {
          console.log('scroll to top!')
          scrollTo(0, 0)
        }, 100)
      })

      $(window).on('resize', function () {
        // On window resize rebuild
        // responsive suff again
        self.buildResponsiveness()
      })

    })
  },

  // init globals
  buildGlobals: function () {
    // jquery global
    window.$ = window.jQuery = require('jquery')

    // GSAP global
    window.TweenMax = require('gsap')

    // ScrollMagic global
    window.ScrollMagic = require('scrollmagic').ScrollMagic

    // require ScrollMagic plugin
    require('./vendor/animation.gsap.js')
  },

  buildModels: function () {
    // create models
    this.me = new Me()
  },

  buildHTML: function (done) {
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

      done()
    })
  },
  buildAnimation: function () {
    var controller = new ScrollMagic.Controller()

    var elementsAnimation = new TimelineMax().add([
      TweenMax.to('#intro-text', 0.5, {opacity: 0}),
      TweenMax.to('#about-text', 0.5, {opacity: 1, delay: 0.2 }),
      TweenMax.to('#social-media-text', 0.3, {opacity: 1, delay: 0.8 }),
      TweenMax.to('#social-media-icons', 0.3, {opacity: 1, delay: 1 })
    ])

    var sceneAbout = new ScrollMagic.Scene({ duration: 3500 })
                    .setPin('#about')
                    .setTween(elementsAnimation)
                    .on('enter leave', function (e) {
                      if (e.type === 'enter') {
                        $('#about-nav').addClass('active')
                      } else {
                        if ($(window).scrollTop() !== 0) {
                          $('#about-nav').removeClass('active')
                        }
                      }
                    })

    controller.addScene([
      sceneAbout
    ])
  },
  buildEffects: function () {
    // Effect of social icon
    $(document).on('mouseenter', '.social-icon', function () {
      TweenMax.to($(this), 0.5, {
        scale: 1.35,
        force3D: true,
        ease: Power4.easeOut
      })
    }).on('mouseleave', '.social-icon', function () {
      TweenMax.to($(this), 0.5, {
        scale: 1,
        force3D: true,
        ease: Power4.easeOut
      })
    })
  },
  buildResponsiveness: function () {
    // Social media stuff top position
    // on bottom of height of the about text
    var aboutTextHeight = $('#about-text').height()

    $('#social-media-text').css('top', aboutTextHeight + 'px')
    $('#social-media-icons').css('top',
      parseInt(aboutTextHeight + $('#social-media-text').height(), 10) + 'px')
  }
}

// run it
module.exports.blastoff()
