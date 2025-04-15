if (window) {
  setTimeout(function () {
    try {
      const auth = localStorage.getItem('authorized');
      if (auth) {
        const authObject = JSON.parse(auth);
        if (window.ui && authObject['JWT-auth']) {
          window.ui.preauthorizeApiKey(
            'JWT-auth',
            authObject['JWT-auth'].value,
          );
        }
      }
    } catch (e) {
      console.error('Error al restaurar la autorización:', e);
    }
  }, 1000);
}
