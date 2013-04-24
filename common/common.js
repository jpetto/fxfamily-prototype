$('body').addClass('js');

var $main = $('#main-content');

// cache array
var products = [];

var current_content = function() {
  return $('.fxfamily-content:first');
};

// reference to content displayed at page load (used in a/b.js)
var $displayed_content = current_content();

var store_history = function(href, id) {
  history.pushState({ 'href': href, 'id': id }, id, href);
};

// make sure it's ok to move in the requested content
var move_ok = function(dest_id) {
  // if we have content displayed, make sure user hasn't
  // requested the same content
  if (current_content().length > 0) {
    return (current_content().attr('id') !== dest_id);
  } else {
  // if no content is display, we can bring in the new stuff
    return true;
  }
};

// handles back button interaction
// also handles forward button - will need additional
// logic to check if user is going forward or backward
window.onpopstate = function(event) {
  if (event && event.state) {
    if (move_ok(event.state.id)) {
      show_product(event.state.id, event.state.href, true);
    }
  }

  return false;
};

// wire up nav
$('.fam-link').on('click', function(e) {
  e.preventDefault();

  $link = $(this);

  // make sure we don't load the current content
  if (!move_ok($link.attr('data-content-id'))) {
    return false;
  }

  // did we load it already?
  if (products[$link.attr('data-content-id')]) {
    // load from cache
    show_product($link.attr('data-content-id'), $link.attr('href'));
  } else {
    $.ajax({
      url: $link.attr('href'),
      type: 'get',
      dataType: 'html',
      success: function(data, status, xhr) {
        // pull out data we need
        var new_product = $(data).find('.fxfamily-content:first');

        // store in cache
        products[$link.attr('data-content-id')] = new_product;

        // show the newly loaded content
        show_product($link.attr('data-content-id'), $link.attr('href'));
      }
    });
  }
});