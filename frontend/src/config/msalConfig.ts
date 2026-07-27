export const entraConfig = {
  tenantId: 'd7dc4bf7-c4ff-451d-bddc-a1fbbfc21ea0',
  clientId: '9239c198-5b62-4a2b-808c-8d3dec0177f5',
  redirectUri: 'http://40.81.226.111:3000',
};

export const getEntraIDAuthUrl = () => {
  const scope = encodeURIComponent('openid profile email');
  const redirectUri = encodeURIComponent(entraConfig.redirectUri);
  // Using response_type=code for secure Authorization Code flow
  return `https://login.microsoftonline.com/${entraConfig.tenantId}/oauth2/v2.0/authorize?client_id=${entraConfig.clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scope}&response_mode=query&nonce=ntms-${Date.now()}`;
};
