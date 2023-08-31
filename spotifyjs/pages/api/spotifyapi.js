// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export async function verifyLink(accessToken) {
  accessToken = localStorage.getItem('access_token');
  console.log(accessToken);
  return accessToken
}

export function getArt(song) {}