DICTIONARIES.yahoo = {
  title: 'Yahoo 字典',
  desc: '英中、中英',
  langs: ['zh', 'en'],
  title2: 'Yahoo <nobr>字典</nobr>',
  query: function (q, response) {
    var self = this;
    $.get('http://tw.dictionary.search.yahoo.com/search?p=' + q).done(function (data) {
      console.log('query: ' + q);
      data = data.replace(/http:\/\/tw.dictionary\.search\.yahoo.com\/search[^?"]*\?p=([^"]+)/g, function (a, b) {
        return 'index.html?q=' + b.replace(/&.*/, '');
      });
      var content = $(data);
      var pronu = content.find('#pronunciation_pos').css('font-size', '2em');
      var audio = (content.find('#iconStyle')[0] || []).innerText;
      if (audio) {
        eval('audio = ' + audio);
        if (audio['sound_url_1']) {
          var symbols = pronu[0].innerText.match(/[A-Z][A-Z]\[[^\]]+\]/g);
          var tags = ['sound_url_1', 'sound_url_2'];
          var audios = [];
          for (var k = 0; k < tags.length; k++) {
            var tag = tags[k];
            for (var i = 0; i < audio[tag].length; i++) {
              var url = audio[tag][i]['mp3'];
              if (url && !audios[url]) audios[url] = true;
            }
          }
          pronu[0].innerText = '';
          var american, british;
          for (var url in audios) {
            if (!american) {
              american = url;
            } else if (!british) {
              british = url;
            } else {
              pronu.append('<a href="#" class="player-button" style="text-decoration: none" data-src="' + url + '"> '
                + '<img src="http://png-2.findicons.com/files/icons/1434/ibook_os/16/sound_file.png" style="margin-left: 10px"/></a>')
            }
          }
          pronu.prepend('<a href="#" class="player-button" data-src="' + american + '">' + symbols[0] + '</a> ')
            .prepend('<a href="#" class="player-button" data-src="' + british + '">' + symbols[1] + '</a> ')
            .prepend($('<audio id="player"><source type="audio/mpeg">Your browser does not support the audio tag.</audio>'));
        }
      }
      var res = $('<div>').append(pronu);
      var entries = content.find('.DictionaryResults');
      var entry_names = ['synonyms', 'antonyms'];  //['variation', 'synonyms', 'antonyms'];
      var table = $('<table style="width:90%; margin-top:2em; margin-bottom:2em;">');
      var tr = $('<tr>');

      for (var i = 0, j = 1; ; j++) {
        if (!entries[j] || i >= entry_names.length) {
          break;
        }
        var title = entries[j].firstChild.firstChild.firstChild;
        if (title.id == entry_names[i]) {
          (function (id, entry) {
            tr.append('<td>').append($(title).css({
              color: 'blue',
              cursor: 'pointer',
              'font-size': '1.4em'
            }).click(function () {
              $('#' + id).toggle();
            })).append($('<div id="' + id + '" style="display:none"></div>').append(entry));
          })(entry_names[i] + '-entry', entries[j]);
          i++;
          continue;
        }
        if (i == 0) res.append(entries[j]);
      }
      res.append(table.append(tr));
      //res.append(entries.shift());
      //res.find('#pronunciation_pos').css('font-size','2em');

      response(self, res, function () {
        var play = function (e) {
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
