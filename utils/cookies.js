import Cookies from 'js-cookie';



export const getTxFailed = (txId) => {
  return Boolean(Cookies.get(`txTried-${ txId }`));
}

// Set the cookie to expire in 1 day
export const setTxFailed = (txId, tried, expires = 1) => {
  Cookies.set(`txTried-${ txId }`, tried, { expires });
}


export const getMasterEditionMarketAddress = (masterEditionMint) => { 
  return Cookies.get(`masterEditionMarketAddress-${ masterEditionMint }`);
}

export const setMasterEditionMarketAddress = (masterEditionMint, marketAddress) => { 
  Cookies.set(`masterEditionMarketAddress-${ masterEditionMint }`, marketAddress, { expires: 365 });
}