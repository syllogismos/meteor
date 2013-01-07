(function () {

  Accounts.oauth.registerService('microsoft', 2, function(query) {
    
    var accessToken = getAccessToken(query);
    var identity = getIdentity(accessToken);

    return {
      serviceData: {
        id: identity.id,
        accessToken: accessToken,
        email: identity.email
                   },
      options: {profile: {name: identity.af}}
    };
  });

  var getAccessToken = function (query) {
    var config = Accounts.loginServiceConfiguration.findOne({service: 'microsoft'});
    if (!config) {
      throw new Accounts.ConfigError("Service not configured");
    }

    var result = Meteor.http.post(
        "https://login.live.com/oauth20_token.srf", {
          params: {
            client_id: config.clientId,
            redirect_uri: Meteor.absoluteUrl("_oauth/microsoft?close"),
            client_secret: config.secret,
            code: query.code,
            grant_type: 'authorization_code'
                  }
        });

    if (result.error) {
      throw result.error;
    }
    var response = result.content;

    var error_response;
    try {
      error_response = JSON.parse(response);
    } catch (e) {
      error_response = null;
    }

    if (error_response) {
      throw new Meteor.Error(500, "Error trying to get access token from Facebook", error_response);
    } else {
      var msftAccessToken;
      _.each(response.split('&'), function(kvString) {
        var kvArray = kvString.split('=');
        if (kvArray[0] === 'access_token') {
          msftAccessToken = kvArray[1];
        }
      });

      if (!msftAccessToken) {
        throw new Meteor.Error(500, "Couldn't find access token in HTTP response.");
      }
      return msftAccessToken;
    }
  };


  var getIdentity = function (accessToken) {
    var result = Meteor.http.get("https://apis.live.net/v5.0/me", {
      params: {access_token: accessToken}});

    if (result.error) {
      throw result.error;
    }
    return result.data;
  };
}) ();
