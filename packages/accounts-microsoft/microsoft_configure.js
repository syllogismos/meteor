Template.configureLoginServiceDialogForMicrosoft.siteUrl = function () {
  return Meteor.absoluteUrl();
};

Template.configureLoginServiceDialogForMicrosoft.fields = function () {
  return [
    {property: 'clientId', label: 'Client ID'},
    {property: 'secret', label: 'Client secret'}
  ];
};
