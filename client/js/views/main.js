/*global app*/
// This app view is responsible for rendering all content that goes into
// <html>. It's initted right away and renders itself on DOM ready.

// This view also handles all the 'document' level events such as keyboard shortcuts.
var View = require('ampersand-view')
var _ = require('underscore')
var domify = require('domify')
var dom = require('ampersand-dom')
var templates = require('../templates')
var setFavicon = require('favicon-setter')
var config = require('clientconfig')

// Partials
var AboutView = require('./sections/about')
var ResumeView = require('./sections/resume')
var SkillsView = require('./sections/skills')
var ContactsView = require('./sections/contacts')

module.exports = View.extend({
  template: templates.body,
  initialize: function () {
    // Do some stuff
  },
  events: {
    'click a[href]': 'handleLinkClick'
  },
  render: function () {
    // some additional stuff we want to add to the document head
    document.head.appendChild(domify(templates.head()))
    document.title = config.title
    document.scrollTop = 0

    // main renderer
    this.renderWithTemplate()

    // ## About
    this.renderSubview(new AboutView(), '#about')

    // ## Resume
    this.renderSubview(new ResumeView(), '#resume')

    // ## Skills
    this.renderSubview(new SkillsView(), '#skills')

    // ## Contact
    this.renderSubview(new ContactsView(), '#contacts')

    return this
  },

  handleNewPage: function (view) {
    // tell the view switcher to render the new one
    this.pageSwitcher.set(view)

    // mark the correct nav item selected
    this.updateActiveNav()
  },

  handleLinkClick: function (e) {
    function getATag (el) {
      return el.nodeName === 'A' && el || el.parentNode && getATag(el.parentNode) || {}
    }

    var aTag = getATag(e.target)
    var local = aTag.host === window.location.host

    // if it's a plain click (no modifier keys)
    // and it's a local url, navigate internally
    if (local && !e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey && aTag.target !== '_blank') {
      e.preventDefault()
      app.navigate(aTag.pathname)
    }
  },

  updateActiveNav: function () {
    var path = window.location.pathname.slice(1)

    this.queryAll('.nav a[href]').forEach(function (aTag) {
      var aPath = aTag.pathname.slice(1)

      if ((!aPath && !path) || (aPath && path.indexOf(aPath) === 0)) {
        dom.addClass(aTag.parentNode, 'active')
      } else {
        dom.removeClass(aTag.parentNode, 'active')
      }
    })
  }
})
