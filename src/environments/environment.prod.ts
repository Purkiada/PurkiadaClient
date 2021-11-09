export const environment = {
  production: true,
  backend: {
    app: "https://api.purkiada.cz/"
  },
  keycloak: {
    issuer: 'https://id.matejbucek.cz/auth/realms/Purkiada',
    redirectUri: 'https://purkiada.cz/',
    clientId: 'frontend',
    responseType: 'code',
    scope: 'openid profile email',
    requireHttps: true,
    showDebugInformation: true,
    disableAtHashCheck: true
  }
};
