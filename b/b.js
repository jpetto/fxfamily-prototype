// store default content to cache
products[$displayed_content.attr('id')] = $displayed_content;

// put default state in history
var url_bits = document.location.pathname.split('/');
store_history(url_bits[url_bits.length - 1], $displayed_content.attr('id'));

// set content height to initially displayed content
$main.css('height', $displayed_content.height());

var show_product = function(key, href, reverse) {
  var new_product = products[key];

  // only store new state if we're going 'forwards' (user clicked a link/did not click back button)
  if (!reverse) {
    store_history(href, key);
  }

  new_product.css({
    'left': ((reverse) ? '-100%' : '100%')
  });

  // add new service to DOM
  $main.append(new_product);

  // ref currently displayed content
  $current = current_content();

  // start moving out existing content
  $current.animate({
    'left': (reverse) ? '100%' : '-100%'
  }, 500);

  // move in new content
  new_product.animate({
    'left': '0%'
  }, 500, function() {
    $current.remove();

    // update height of $main
    $main.animate({
      'height': new_product.height()
    }, 300);
  });
};

