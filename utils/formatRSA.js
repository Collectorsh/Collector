export const formatRSAPublicKey = (key) => { 
  return key.replace('-----BEGIN PUBLIC KEY-----', '-----BEGIN PUBLIC KEY-----\n')
    .replace('-----END PUBLIC KEY-----', '\n-----END PUBLIC KEY-----')
    .replace(/(.{64})/g, '$1\n'); // Assumes base64 lines are 64 characters long, typical for PEM.
}

export const formatRSAPrivateKey = (key) => { 
  return key.replace('-----BEGIN PRIVATE KEY-----', '-----BEGIN PRIVATE KEY-----\n')
    .replace('-----END PRIVATE KEY-----', '\n-----END PRIVATE KEY-----')
    .replace(/(.{64})/g, '$1\n'); // Assumes base64 lines are 64 characters long, typical for PEM.
}