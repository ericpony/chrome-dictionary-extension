DICTIONARIES.urban = {
  title: 'Urban Dictionary',
  desc: '英英',
  langs: ['en'],
  text: 'Urban Dictionary',
  query: function (q, response) {
    var self = this;
    $.get('http://www.urbandictionary.com/define.php?term=' + q).done(function (data) {
      var result = '';
      $(data).find('.def-panel[data-defid]').each(function (index, element) {
        var word = $(element).find('.word').text();
        var meaning = $(element).find('.meaning').html();
        var example = $(element).find('.example').html();
        var tags = $(element).find('.tags').html();
        result += '<div class="panel panel-info">\
          <div class="panel-heading">\
            <h3 class="panel-title">' + word + '</h3>\
          </div>\
          <div class="panel-body">' + meaning + '<br />' + tags + '</div>\
          <div class="panel-footer"><h5>Example</h5>' + example + '</div>\
        </div>';
      });
      result = result.replace(/href="\//g, 'href="http://www.urbandictionary.com/');
      response(self, result);
    });
  }
};
