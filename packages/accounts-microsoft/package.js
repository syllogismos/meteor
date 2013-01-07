Package.describe({
  summary: "Login service for Microsoft accounts."
});

Package.on_use(function(api) {
  api.use('accounts-base', ['client', 'server']);
  api.use('accounts-oauth2-helper', ['client', 'server']);
  api.use('http', ['client', 'server']);
  api.use('templating', 'client');

  api.add_files(
    ['microsoft_login_button.css', 'microsoft_configure.html', 'microsoft_configure.js'],
    'client');

  api.add_files('microsoft_common.js', ['client', 'server']);
  api.add_files('microsoft_server.js', 'server');
  api.add_files('microsoft_client.js', 'client');
});
