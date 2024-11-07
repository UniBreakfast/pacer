export const rndStr = (n=42,
  l='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz--', s='') =>
    { for (;n;--n) s+=l[Math.random()*62|0]; return s }

export const rndStrDashed =()=> rndStr(36).match(/\w{6}/g).join`-`