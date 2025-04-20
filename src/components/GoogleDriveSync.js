import React, { useRef } from 'react';
import { loadGooglePickerApi } from '../../public/google-drive-api';

// Remplace par tes identifiants Google Cloud Platform
const CLIENT_ID = 'VOTRE_CLIENT_ID.apps.googleusercontent.com';
const DEVELOPER_KEY = 'VOTRE_DEVELOPER_KEY';
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

export default function GoogleDriveSync({ historyData, onImport }) {
  const tokenRef = useRef(null);

  // Authentification OAuth2
  const authenticate = async () => {
    return new Promise((resolve, reject) => {
      window.gapi.load('auth', () => {
        window.gapi.auth.authorize({
          client_id: CLIENT_ID,
          scope: SCOPES.join(' '),
          immediate: false,
        }, authResult => {
          if (authResult && !authResult.error) {
            tokenRef.current = authResult.access_token;
            resolve(authResult.access_token);
          } else {
            reject(authResult.error);
          }
        });
      });
    });
  };

  // Exporter l’historique sur Drive
  const exportToDrive = async () => {
    await authenticate();
    loadGooglePickerApi(() => {
      const blob = new Blob([JSON.stringify(historyData, null, 2)], { type: 'application/json' });
      const file = new File([blob], 'historique-menus.json', { type: 'application/json' });
      const metadata = {
        name: 'historique-menus.json',
        mimeType: 'application/json',
      };
      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      form.append('file', file);
      fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + tokenRef.current },
        body: form,
      })
        .then(r => r.json())
        .then(() => alert('Historique exporté sur Google Drive !'))
        .catch(() => alert('Erreur lors de l’export.'));
    });
  };

  // Importer depuis Drive
  const importFromDrive = async () => {
    await authenticate();
    loadGooglePickerApi(() => {
      const picker = new window.google.picker.PickerBuilder()
        .setOAuthToken(tokenRef.current)
        .setDeveloperKey(DEVELOPER_KEY)
        .setAppId(CLIENT_ID)
        .addView(new window.google.picker.DocsView().setMimeTypes('application/json'))
        .setCallback(data => {
          if (data.action === window.google.picker.Action.PICKED && data.docs && data.docs[0]) {
            const fileId = data.docs[0].id;
            fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
              headers: { 'Authorization': 'Bearer ' + tokenRef.current },
            })
              .then(r => r.json())
              .then(json => {
                onImport(json);
                alert('Historique importé depuis Google Drive !');
              })
              .catch(() => alert('Erreur lors de l’import.'));
          }
        })
        .build();
      picker.setVisible(true);
    });
  };

  return (
    <div className="flex gap-2 my-4">
      <button
        className="px-3 py-1 bg-blue-700 text-white rounded text-xs hover:bg-blue-800"
        onClick={exportToDrive}
      >
        Sauvegarder sur Google Drive
      </button>
      <button
        className="px-3 py-1 bg-green-700 text-white rounded text-xs hover:bg-green-800"
        onClick={importFromDrive}
      >
        Importer depuis Google Drive
      </button>
    </div>
  );
}
