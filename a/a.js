var $fam_content = $('#family-content');

// if we're not on the index page, store the content displayed
if ($displayed_content.length > 0) {
  // store default content to cache
  products[$displayed_content.attr('id')] = $displayed_content;

  // put default state in history
  var url_bits = document.location.pathname.split('/');
  store_history(url_bits[url_bits.length - 1], $displayed_content.attr('id'));

  // set content height to initially displayed content
  $main.css('height', $displayed_content.height());
}

// toggle full family content
$fam_content.on('click', function(e) {
  e.preventDefault();

  $fam_content.toggleClass('condensed');
});

var show_product = function(key, href, reverse) {
  var new_product = products[key];

  // ref currently displayed content
  // must be done before appending new_product
  $current = current_content();

  // hide family graphic (if not already)
  if (!$fam_content.hasClass('condensed')) {
    $fam_content.addClass('condensed mini');

    // invisible so we can put into DOM without being seen
    // needed for height to calculate properly
    new_product.css({
      'top': '-100%',
      'visibility': 'hidden'
    });

    // add new service to DOM
    $main.append(new_product);

    setTimeout(function() {
      // update height of $main
      $main.animate({
        'height': new_product.height()
      }, 300, function() {
        new_product.css('visibility', 'visible');
      });
    }, 100);
  } else {
    new_product.css('left', ((reverse) ? '-100%' : '100%'));

    // add new service to DOM
    $main.append(new_product);
  }

  // only store new state if navigating by clicks
  // (user directly clicked a link (not back/forward button))
  if (!reverse) {
    store_history(href, key);
  }

  // start moving out existing content (if exists)
  if ($current.length > 0) {
    $current.animate({
      'left': (reverse) ? '100%' : '-100%'
    }, 500);

    // move in new content from the right
    new_product.animate({
      'left': '0%'
    }, 500, function() {
      $current.remove();

      // update height of $main
      $main.animate({
        'height': new_product.height()
      }, 300);
    });
  } else {
    // move in new content from the top
    // wait 100ms for family content to slide up
    setTimeout(function() {
      $('html, body').animate({
        'scrollTop': 0
      }, 200);

      new_product.animate({
        'top': '0%'
      }, 700);
    }, 100);
  }
};