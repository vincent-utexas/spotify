// Stores tools used by the app

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
 * Truncate strings over 25 characters, used for long album/track names
 * @param {string} string to truncate
 * @returns {string} a truncated string with trailing ellipses (...)
 */
export function truncate(str) {
    if (str.length > 35) {
      let substring = str.substring(0, 25);
      return substring.substring(0, substring.lastIndexOf(' ')) + '...'
    }
    return str;
}