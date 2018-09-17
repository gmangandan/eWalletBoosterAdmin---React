const ID_TOKEN = 'jwtAdminToken';

export function getIdToken() {   
    return localStorage.getItem(ID_TOKEN);
}
  
export function isLoggedIn() {    
    const idToken = getIdToken();    
    return idToken === null ? false : true;
}
  
 