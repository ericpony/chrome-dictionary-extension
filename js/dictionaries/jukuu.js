DICTIONARIES.jukuu = {
  title: "句酷雙語例句",
  desc: '英中、中英',
  langs: ['zh', 'en'],
  title2: "<nobr>句酷</nobr> <nobr>雙語例句</nobr>",
  query: function (q, response) {
    var self = this;
    $.get('http://www.jukuu.com/search.php?q=' + q).done(function (data) {
      var trs1 = $(data).find('tr.e td:nth-child(2)');
      var trs2 = $(data).find('tr.c td:nth-child(2)');
      var result = "<ul>";
      for (var i = 0; i < trs1.length; i++) {
        result += "<li>" +
          "<p>" + trs1[i].innerHTML + "</p>" +
          "<p style='color:blue'>" + trs2[i].innerHTML + "</p>" +
          "</li>";
      }
      result += "</ul>";
      result = result.replace(/<img/g, '<ximg');
      if (trs1.length == 0) result = false;
      response(self, result);
    });
  }
}
