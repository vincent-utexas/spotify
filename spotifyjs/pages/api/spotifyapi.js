const API = process.env.NEXT_PUBLIC_API;

if (typeof window !== 'undefined') {
  setAccessToken();
}

/**
 * Check if the link is a valid Spotify ID
 * @param {string} link
 * @returns {boolean} response.ok
 */
export async function verifyLink(link) {
  let token = getAccessToken();
  link = parseID(link);

  const response = await fetch(API + 'playlists/' + link, {
          method: "HEAD",
          headers: { Authorization: `Bearer ${token}` } 
      });
      
  return response.ok;
}

/**
 * Get the playlist associated with the ID
 * @param {string} id 
 * @returns {object}
 */
export async function getPlaylist(id) {
  const token = getAccessToken();
  id = parseID(id);
  
  const playlist = await fetch(API + 'playlists/' + id, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}`}
  })
  .catch(error => {
    console.log('Error:' + error);
  });

  return await playlist.json()
  .catch(error => { // catch syntax error
    console.log('Error ' + error)
  });
}

/**
 * Get the tracks of an album
 * @param {string} id 
 * @returns {Array[object]} tracks {id, album, artist, name, img, preview}
 */
export async function getTracksofPlaylist(id) {
  const playlist = await getPlaylist(id);
  let tracks = []
  for (const track of playlist.tracks.items) {
    tracks.push({
      id: track.track.id,
      album: truncate(track.track.album.name),
      artist: track.track.artists[0].name,
      name: truncate(track.track.name),
      img: {
        small: track.track.album.images[2].url,
        large: track.track.album.images[0].url
      },
      preview: track.track.preview_url
    })
  }

  return tracks;
}

/**
 * Truncate strings over 35 characters, used for long album/track names
 * @param {string} string to truncate
 * @returns {string} a truncated string with trailing ellipses (...)
 */
function truncate(str) {
  if (str.length > 35) {
    let substring = str.substring(0, 35);
    return substring.substring(0, substring.lastIndexOf(' ')) + '...'
  }
  return str;
}

/**
 * Parse the album ID from a link
 * @param {string} link 
 * @returns {string} parsed ID
 */
export function parseID(link) {
  if (link.startsWith('https://')) {
    // ID begins after 'playlist/'
    link = link.slice(link.indexOf('playlist/') + 9);
  }

  return link;
}

/**
 * Get the access token from local memory
 * @returns {string} access_token
 */
function getAccessToken() {
  return localStorage.getItem('access_token')
}

function setAccessToken() {
  const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI;
  const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;

  // Parse the URL and save the code param
  const urlParams = new URLSearchParams(window.location.search);
  let code = urlParams.get('code');
  
  // Request the access token
  let codeVerifier = localStorage.getItem('code_verifier');
  const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: REDIRECT_URI,
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
      }
  )
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