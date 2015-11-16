DICTIONARIES.hjenglish = {
  title: '江戶小D',
  desc: '日中',
  langs: ['ja'],
  title2: '<nobr>江戶</nobr> <nobr>小D</nobr>',
  query: function (q, response) {
    var self = this;
    $.get('http://dict.hjenglish.com/jp/jc/' + q).done(function (data) {
      data = data.replace(/<img\b[^>]*>|<iframe\b[^>]*>/ig, '');
      $result = $(data).find('#jp_Resunt_panel');
      $result.find('.jp_ico,.jpSound,.jpAddWord').remove();
      response(self, $result.html());
    });
  }
};
