DICTIONARIES.yahoo = {
  title: 'Yahoo 字典',
  desc: '英中、中英',
  langs: ['zh', 'en'],
  query: function(q, response){
    var self = this;
    $.get('http://tw.dictionary.search.yahoo.com/search?p=' + q).done(function(data){
      var content = $(data);
      var pronu = content.find('.proun_wrapper').css('font-size','1.5em');
      var a = pronu.find('a');
      a.prepend($('<img src="http://png-2.findicons.com/files/icons/1434/ibook_os/16/sound_file.png" />'))
       .prepend($('<audio id="default-player"><source type="audio/mpeg" src="' + a.attr('href') + '"></audio>'));
      a.parent().css({display:'inline-block'}).prepend($('<span>&nbsp;</span>'))
       .append($('<audio id="am-player"><source type="audio/mpeg" src="' + content.find('.sound-american')[1].href+'"></audio>'))
       .append($('<audio id="br-player"><source type="audio/mpeg" src="' + content.find('.sound-british')[0].href+'"></audio>'));
//     .append('<span> </span><a href="#" id="am-player-button" style="font-size:.8em">[American]</a>')
//     .append('<span> </span><a href="#" id="br-player-button" style="font-size:.8em">[British]</a>');
      a.attr({id:'default-player-button', href:'#'});
      response(self, $('<div>').append(pronu).append(content.find('.DictionaryResults')), function(){
        var play = function(){ $('#'+(this.id||'default-player').replace('-button',''))[0].play() };
        var btns = $('.proun_value').css({color:'blue',cursor:'pointer'}).click(play);
        btns[0].id = 'am-player-button';
        btns[1].id = 'br-player-button';
        $('.proun_wrapper a').click(play);
      });
    });
  }
};
