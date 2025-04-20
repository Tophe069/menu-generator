// Ce fichier charge l’API Google Drive Picker et fournit une fonction utilitaire pour l’intégration front-end.

export function loadGooglePickerApi(onLoad) {
  if (window.gapi && window.google && window.google.picker) {
    onLoad();
    return;
  }
  const script1 = document.createElement('script');
  script1.src = 'https://apis.google.com/js/api.js';
  script1.onload = () => {
    window.gapi.load('picker', onLoad);
  };
  document.body.appendChild(script1);
}

export function showGooglePicker({
  clientId,
  developerKey,
  token,
  onPicked,
  mimeTypes = ['application/json'],
  action = 'open', // 'open' ou 'save'
  fileName = 'historique-menus.json',
  content = null,
}) {
  const view = new window.google.picker.DocsView()
    .setIncludeFolders(true)
    .setMimeTypes(mimeTypes.join(','));
  let pickerBuilder = new window.google.picker.PickerBuilder()
    .setOAuthToken(token)
    .setDeveloperKey(developerKey)
    .setAppId(clientId)
    .addView(view)
    .setCallback(data => {
      if (data.action === window.google.picker.Action.PICKED && data.docs && data.docs[0]) {
        onPicked(data.docs[0]);
      }
    });

  if (action === 'save' && content) {
    pickerBuilder = pickerBuilder.enableFeature(window.google.picker.Feature.SUPPORT_DRIVES)
      .setTitle('Enregistrer sur Google Drive')
      .addView(new window.google.picker.DocsUploadView())
      .setCallback(data => {
        if (data.action === window.google.picker.Action.PICKED && data.docs && data.docs[0]) {
          // L'utilisateur a choisi où sauvegarder, mais il faut utiliser l'API Drive REST pour uploader le fichier
          onPicked(data.docs[0]);
        }
      });
  }
  pickerBuilder.build().setVisible(true);
}
