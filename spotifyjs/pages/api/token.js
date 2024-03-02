const CLIENT_ID = '0526ab1242444ecc8057705be8ad0777';
const REDIRECT_URI = 'http://localhost:3000/callback';


export default function userAuth() {

    if (typeof window !== 'undefined') {
        let codeVerifier = generateRandomString(128);

        // Generate PKCE code challenge
        // then redirect to Spotify's auth server login page
        // for the user to grant permissions
        // @return code (for API access), state (state param)
        generateCodeChallenge(codeVerifier).then(codeChallenge => {
            let state = generateRandomString(16);
            let scope = 'playlist-read-private playlist-read-collaborative user-library-read';
            localStorage.setItem('code_verifier', codeVerifier);
    
            let args = new URLSearchParams({
                response_type: 'code',
                client_id: CLIENT_ID,
                scope: scope,
                redirect_uri: REDIRECT_URI,
                state: state,
                code_challenge_method: 'S256',
                code_challenge: codeChallenge
            });
    
            window.location = 'https://accounts.spotify.com/authorize?' + args;
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
  