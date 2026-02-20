require('dotenv').config();
const {GoogleAuth} = require('google-auth-library');

(async () => {
  try {
    const auth = new GoogleAuth({ scopes: ['https://www.googleapis.com/auth/cloud-platform'] });
    const client = await auth.getClient();

    // Try to obtain an access token (handle different return shapes)
    let tokenRes = await client.getAccessToken();
    let accessToken = null;
    if (!tokenRes) {
      const alt = await auth.getAccessToken();
      tokenRes = alt;
    }
    if (typeof tokenRes === 'string') accessToken = tokenRes;
    else if (tokenRes && tokenRes.token) accessToken = tokenRes.token;
    else if (tokenRes && tokenRes.access_token) accessToken = tokenRes.access_token;

    if (!accessToken) {
      console.error('Could not obtain access token via ADC. Ensure GOOGLE_APPLICATION_CREDENTIALS is set.');
      process.exit(2);
    }

    const listUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
    const res = await fetch(listUrl, { headers: { Authorization: `Bearer ${accessToken}` } });
    console.log('Model list HTTP status:', res.status);
    const json = await res.json();
    console.log('Model list response:');
    console.log(JSON.stringify(json, null, 2));

  } catch (err) {
    console.error('ADC test failed:', err);
    process.exit(1);
  }
})();
