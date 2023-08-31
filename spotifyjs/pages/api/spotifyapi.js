// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export async function verifyLink(accessToken) {
  accessToken = localStorage.getItem('access_token');
  return accessToken
}

export function getArt(song) {}

export function getAccessToken() {
  if (!localStorage.getItem('access_token')) {
    setAccessToken();
  }
    return localStorage.getItem('access_token')
}

function setAccessToken() {
  let redirectUri = 'http://localhost:3000/callback';
  let CLIENT_ID = '0526ab1242444ecc8057705be8ad0777';

  // Parse the URL and save the code param
  const urlParams = new URLSearchParams(window.location.search);
  let code = urlParams.get('code');
  
  // Request the access token
  let codeVerifier = localStorage.getItem('code_verifier');
  let body = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      client_id: CLIENT_ID,
      code_verifier: codeVerifier
  });

  // Store the access token in local storage
  // GET access token by localStorage.getItem('access_token')
  const response = fetch('https://accounts.spotify.com/api/token', {
  method: 'POST',
  headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
  },
      body: body
  })
  .then(response => {
      if (!response.ok) {
      throw new Error('HTTP status ' + response.status);
      }
      return response.json();
  })
  .then(data => {
      localStorage.setItem('access_token', data.access_token);
  })
  .catch(error => {
      console.error('Error:', error);
  });
}