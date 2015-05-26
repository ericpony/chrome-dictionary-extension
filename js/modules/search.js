var Search = {
  init: function(){
    var queryString = Index.queryString();
    if(Search.isValidQuery()){
      Logger.log('tracks', {query: queryString, url: urlParams.url});
      $('#dict_nav').show();
      chrome.storage.sync.get(DEFAULT_OPTIONS, function(items){
        for(var i in items.order){
          var dictName = items.order[i];
          if(DICTIONARIES[dictName] /*字典存在*/ && items[dictName] /*啟用*/){
            var isLangFound = false;
            for(var j in Search.matchedLanguages(queryString))
              if(!!~DICTIONARIES[dictName].langs.indexOf(Search.matchedLanguages(queryString)[j])){
                isLangFound = true; break;
              }
            if(!isLangFound) continue; // 如果找不到符合語言就跳過該字典
            var id = 'dict_' + dictName;
            $('#main').append('<div id="' + id + '"></div>');
            //$('#dict_nav_ul').append('<li id="dict_nav_li_' + dictName + '"' + (i == 0 ? ' class="active"' : undefined) + '></li>');
            $('#dict_nav_table').append('<td id="dict_nav_li_' + dictName + '"' + (i == 0 ? ' class="active"' : undefined) + '></td>');
            DICTIONARIES[dictName].query(queryString, function(dictionary, result, callback){
              if(!result) return; // 沒結果就不要顯示內容與導覽列
              var id = '#dict_' + dictionary.id;
              $('#dict_nav_li_' + dictionary.id).append('<a href="' + id + '">' + dictionary.title2 + '</a></li>');
              $(id).append('<div class="page-header" style="margin:0px"><h2>' + dictionary.title + '</h2></div>');
              $(id).append(result);
			  if(callback && callback.constructor === Function.constructor) callback();
            });
          }
        }
      });
    }else $('#intro').show();
  },

  matchedLanguages: function(){
    var ret = [];
    for(var i in LANG_MATCHER) if(Index.queryString().match(LANG_MATCHER[i])) ret.push(i);
    return ret;
  },

  isValidQuery: function(){
    var queryString = Index.queryString();
    return queryString && !queryString.match(/TJDict/i);
  }
}
