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
      options: {profile: {name: identity.name}}
    };
  });

  var getAccessToken = function (query) {
    var config = Accounts.loginServiceConfiguration.findOne({service: 'microsoft'});
    if (!config) {
      throw new Accounts.ConfigError("Service not configured");
    }

    var redirectUrl = Meteor.absoluteUrl("_oauth/microsoft?close");
    if (redirectUrl.substr(0,16) === 'http://localhost') {
      redirectUrl = 'http://anilkaraka.com/_oauth/microsoft?close';
    }
    
    var result = Meteor.http.post(
        "https://login.live.com/oauth20_token.srf", {
          params: {
            client_id: config.clientId,
            redirect_uri: redirectUrl, 
            client_secret: config.secret,
            code: query.code,
            grant_type: 'authorization_code'
                  }
        });

    if (result.error) {
      throw result.error;
    }
    var response = result.content;

    var parsed_response;
    try {
      parsed_response = JSON.parse(response);
    } catch (e) {
      parsed_response = null;
    }

    if (! parsed_response) {
      throw new Meteor.Error(500, "Error trying to parse data from Microsoft", parsed_response);
    } else {

      var msftAccessToken = parsed_response.access_token;
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
