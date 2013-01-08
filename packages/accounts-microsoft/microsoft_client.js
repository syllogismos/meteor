(function () {
  Meteor.loginWithMicrosoft = function (options, callback) {
    // support both (options, callback) and (callback).
    if (!callback && typeof options == 'function') {
      callback = options;
      options = {};
    }

    var config = Accounts.loginServiceConfiguration.findOne({service: 'microsoft'});
    if (!config) {
      callback && callback(new Accounts.ConfigError("Service not configured"));
      return;
    }

    var state = Meteor.uuid();
    var mobile = /Android|webOS|iPhone|iPad|iPod|Blackberry/i.test(navigator.userAgent);
    var display = mobile ? 'touch' : '';

    var scope = "wl.basic%20wl.signin";
    if (options && options.requestPermissions) {
      scope = options.requestPermissions.join('%20');
    }

    var redirectUrl = Meteor.absoluteUrl('_oauth/microsoft?close');
    if (redirectUrl.substr(0,16) === 'http://localhost') {
      redirectUrl = 'http://anilkaraka.com/_oauth/microsoft?close';
    }
    var loginUrl = 
      'https://login.live.com/oauth20_authorize.srf?client_id=' + config.clientId + 
      '&redirect_uri=' + redirectUrl + 
      '&display=' + display + '&scope=' + scope + 
      '&response_type= code' + '&state=' + state;
    
    Accounts.oauth.initiateLogin(state, loginUrl, callback);

  };
})();
