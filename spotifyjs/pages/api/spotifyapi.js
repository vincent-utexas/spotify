// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const api = 'https://api.spotify.com/v1/';

if (typeof window !== 'undefined') {
  setAccessToken();
}

export async function verifyLink(link) {
  let token = getAccessToken();
  link = parseID(link);

  const response = await fetch(api + 'playlists/' + link, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` } 
  });

  return response.ok;
}

export async function getPlaylist(id) {
  const token = getAccessToken();
  id = parseID(id);
  
  const playlist = await fetch(api + 'playlists/' + id, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}`}
  });

  return await playlist.json()
  .catch(error => { // catch syntax error
    console.log('Error ' + error)
  });
}

export function parseID(link) {
  if (link.startsWith('https://')) {
    link = link.slice(link.indexOf('playlist/') + 9);
  }

  return link;
}

function getAccessToken() {
  return localStorage.getItem('access_token')
}

function setAccessToken() {
  let redirectUri = 'http://localhost:3000/callback';
  const CLIENT_ID = '0526ab1242444ecc8057705be8ad0777';

  // Parse the URL and save the code param
  const urlParams = new URLSearchParams(window.location.search);
  let code = urlParams.get('code');
  
  // Request the access token
  let codeVerifier = localStorage.getItem('code_verifier');
  const body = new URLSearchParams({
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
      localStorage.setItem('refresh_token', data.refresh_token);
  })
  .catch(error => {
      console.error('Error:', error);
  });
}

function refreshToken() {
  const CLIENT_ID = '0526ab1242444ecc8057705be8ad0777';
  let refresh_token = localStorage.getItem('refresh_token');

  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refresh_token,
    client_id: CLIENT_ID
  });

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
      localStorage.setItem('refresh_token', data.refresh_token);
  })
  .catch(error => {
      console.error('Error:', error);
  });
}