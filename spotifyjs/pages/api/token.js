const CLIENT_ID = '0526ab1242444ecc8057705be8ad0777';
const redirectUri = 'http://localhost:3000/callback';


export default function setAccessToken() {

    if (typeof window !== 'undefined') {
        let codeVerifier = generateRandomString(128);

        // Generate PKCE code challenge
        // then redirect to Spotify's auth server login page
        // for the user to grant permissions
        // RETURNS: code (for API access), state (state param)
        generateCodeChallenge(codeVerifier).then(codeChallenge => {
            let state = generateRandomString(16);
            let scope = 'user-read-private user-read-email';
            localStorage.setItem('code_verifier', codeVerifier);
    
            let args = new URLSearchParams({
                response_type: 'code',
                client_id: CLIENT_ID,
                scope: scope,
                redirect_uri: redirectUri,
                state: state,
                code_challenge_method: 'S256',
                code_challenge: codeChallenge
            });
    
            window.location = 'https://accounts.spotify.com/authorize?' + args;
        });
    
        // Parse the URL and save the code param
        const urlParams = new URLSearchParams(window.location.search);
        let code = urlParams.get('code');
    
        // Request the access token
        codeVerifier = localStorage.getItem('code_verifier');
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
}


function generateRandomString(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  async function generateCodeChallenge(codeVerifier) {
    function base64encode(string) {
      return btoa(String.fromCharCode.apply(null, new Uint8Array(string)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    }
  
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
  
    return base64encode(digest);
  }
  