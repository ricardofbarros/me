// base view for pages
var View = require('ampersand-view')
var templates = require('../../templates')

module.exports = View.extend({
  template: templates.sections.skills,
  render: function () {
    this.renderWithTemplate()
  }
})
