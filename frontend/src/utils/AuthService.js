const ID_TOKEN = 'jwtToken';

export function getIdToken() {   
    return localStorage.getItem(ID_TOKEN);
}
  
export function isLoggedIn() {    
    const idToken = getIdToken();    
    return idToken === null ? false : true;
}
  
 