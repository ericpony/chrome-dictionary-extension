var Logger = {
  init: function(){
    Logger.setVariables();
    $('[data-track-click]').click(Logger.onTrackClick);
  },

  // setup firebase, ip, uid, deferreds
  setVariables: function() {
    return;
    Logger.deferreds = []
    Logger.deferreds.push($.get('http://freegeoip.net/json', function(ipData){
      Logger.ip = ipData.ip;
    }));
    Logger.deferreds.push($.Deferred(function(){
      var self = this;
      chrome.identity.getProfileUserInfo(function(info){
        Logger.uid = info.id;
        Logger.email = info.email;
        self.resolve();
      });
    }));
  },

  onTrackClick: function(e){
    Logger.log('clicks', {click: this.dataset.trackClick});
  },

  log: function(type, data){

    console.log('type: "' + type + ', data: ');
    for(var name in data)
      if(data.hasOwnProperty(name)) console.log("  " + name + ": " + data[name]);
    return;

    $.when.apply($, Logger.deferreds).then(function(){
      var defaults = {
        uid: Logger.uid,
        email: Logger.email,
        ip: Logger.ip,
        agent: navigator.userAgent,
        timestamp: Date.now() / 1000 | 0
      };
      var pushData = $.extend(defaults, data);

      var firebaseRoot = isProduction() ? 'https://tjdict.firebaseio.com' : 'https://tjdict.firebaseio.com/dev';
      if(Logger.firebase == undefined) Logger.firebase = new Firebase(firebaseRoot);
      Firebase.goOnline();
      Logger.firebase.child(type).push(pushData, function(){
        Firebase.goOffline();
      });
    });
  }
}
