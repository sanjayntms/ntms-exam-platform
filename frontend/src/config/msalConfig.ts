export const entraConfig = {
  tenantId: 'd7dc4bf7-c4ff-451d-bddc-a1fbbfc21ea0',
  clientId: '9239c198-5b62-4a2b-808c-8d3dec0177f5',
  redirectUri: window.location.origin,
};

export const getEntraIDAuthUrl = () => {
  const scope = encodeURIComponent('openid profile email');
  const redirectUri = encodeURIComponent(entraConfig.redirectUri);
  return `https://login.microsoftonline.com/${entraConfig.tenantId}/oauth2/v2.0/authorize?client_id=${entraConfig.clientId}&response_type=token+id_token&redirect_uri=${redirectUri}&scope=${scope}&response_mode=fragment&nonce=ntms-${Date.now()}`;
};
