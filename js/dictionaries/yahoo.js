DICTIONARIES.yahoo = {
  title: 'Yahoo 字典',
  desc: '英中、中英',
  langs: ['zh', 'en'],
  title2: 'Yahoo <nobr>字典</nobr>',
  query: function(q, response){
    var self = this;
    $.get('http://tw.dictionary.search.yahoo.com/search?p=' + q).done(function(data){
      console.log('query: ' + q);
      data = data.replace(/http:\/\/tw.dictionary\.search\.yahoo.com\/search[^?"]*\?p=([^"]+)/g, function(a,b) {
        return 'index.html?q=' + b.replace(/&.*/,'');
      });
      var content = $(data);
      var pronu = content.find('#pronunciation_pos').css('font-size','2em');
      var audio = (content.find('#iconStyle')[0] || []).innerText;
      if(audio) {
        eval('audio = ' + audio);
        if(audio['sound_url_1']) {
          var symbols = pronu[0].innerText.match(/[A-Z][A-Z]\[[^\]]+\]/g);
          var filetype = 'ogg';
          pronu[0].innerText = '';
          pronu.prepend($('<span>&nbsp;</span>'))
           .append('<a href="#" class="player-button" data-src="' + audio['sound_url_1'][1][filetype] + '">' + symbols[0] + '</a> ')
           .append('<a href="#" class="player-button" data-src="' + audio['sound_url_2'][1][filetype] + '">' + symbols[1] + '</a> ')
           .append('<a href="#" class="player-button" data-src="' + audio['sound_url_1'][0][filetype] + '"> '
               + '<img src="http://png-2.findicons.com/files/icons/1434/ibook_os/16/sound_file.png" /></a>')
           .append($('<audio id="player"><source type="audio/mpeg"></audio>'));
        }
      }
      var res = $('<div>').append(pronu);
      var entries = content.find('.DictionaryResults');
      var entry_names = ['synonyms', 'antonyms'];  //['variation', 'synonyms', 'antonyms'];
      var table = $('<table style="width:90%; margin-top:2em; margin-bottom:2em;">');
      var tr = $('<tr>');

      for(var i=0, j=1; ; j++) {
        if(!entries[j] || i>=entry_names.length)
          break;
        var title = entries[j].firstChild.firstChild.firstChild;
        if(title.id == entry_names[i]) {
          (function(id, entry) {
            tr.append('<td>').append($(title).css({color:'blue', cursor:'pointer', 'font-size':'1.4em'}).click(function() {
              $('#' + id).toggle();
            })).append($('<div id="' + id + '" style="display:none"></div>').append(entry));
          })(entry_names[i] + '-entry', entries[j]);
          i++;
          continue;
        }
        if(i==0) res.append(entries[j]);
      }
      res.append(table.append(tr));
      //res.append(entries.shift());
      //res.find('#pronunciation_pos').css('font-size','2em');

      response(self, res, function(){
        var play = function(e){
          e.preventDefault();
          e.stopPropagation();
          var player = document.getElementById('player');
          player.src = this.dataset['src'];
          player.play();
        };
        $('.player-button').click(play);
      });
    });
  }
};
