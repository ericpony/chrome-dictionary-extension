var Logger = {
  init: function () {
  },

  setVariables: function () {
  },

  onTrackClick: function (e) {
    Logger.log('clicks', {click: this.dataset.trackClick});
  },

  log: function (type, data) {
    console.log('type: "' + type + ', data: ');
    for (var name in data) {
      if (data.hasOwnProperty(name)) console.log("  " + name + ": " + data[name]);
    }
  }
}
