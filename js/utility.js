export class TokenStorage {
  static saveToken(token) {
    return localStorage.setItem('token', token);
  }
  
  static getToken() {
    return localStorage.getItem('token');
  }
  
  static removeToken() {
    return localStorage.removeItem('token');
  }
}

export class Request {
  static async getReq(url, token) {
    let config = {
      headers: {
        Authorization: `Bearer ${token}` 
      }
    }
    
    let execute = axios.get(url);
    if (token) execute = axios.get(url, config);
    
    try {
      const res = await execute;
      return res;
    
    } catch(err) {
      console.log(err);
      return err
    }
  }
  
  static async getAllReq(url, token) {
    let config = {
      headers: {
        Authorization: `Bearer ${token}` 
      }
    }
    
    let execute = axios.get(url);
    if (token) execute = axios.get(url, config);
    
    try {
      const res = await execute;
      return res;
    } catch(err) {
      console.log(err);
      return err
    }
  }
  
  static async postReq(url, data, token) {
    let config = {
      headers: {
        Authorization: `Bearer ${token}` 
      }
    }
    
    let execute = axios.post(url, data);
    if (token) execute = axios.post(url, data, config);
    
    try {
      const res = await execute;
      return res;
    } catch(err) {
      console.log(err);
      return err
    }
  }
  
  static async updateReq(url, data, token) {
    let config = {
      headers: {
        Authorization: `Bearer ${token}` 
      }
    }
    
    let execute = axios.patch(url, data);
    if (token) execute = axios.patch(url, data, config);
    
    try {
      const res = await execute;
      return res;
    } catch(err) {
      console.log(err);
      return err
    }
  }
  
  static async deleteReq(url, token) {
    let config = {
      headers: {
        Authorization: `Bearer ${token}` 
      }
    }
    
    let execute = axios.delete(url);
    if (token) execute = axios.delete(url, config);
    
    try {
      const res = await execute;
      return res;
    } catch(err) {
      console.log(err);
      return err
    }
  }
}

export class Theme {
  static setTheme(themeProperties) {
    const theme = themeProperties ? themeProperties : {
          background300: "#424240aa",
          background400: "#222c23",
          background500: "#1a1c19",
          background3000: "#424240dd",
          lightColor500: "#e1e4de",
          lightColor600: "#afb1ad",
          lightColor700: "#8b9288",
          primaryColor: "#7adb8e",
          secondaryColor: "#ffb3ab",
          smallLogo: 'logo-small-2.5.png',
          bigLogo: 'logo-card-2.5.png'
        }
        
    return localStorage.setItem('themeProperties', JSON.stringify(theme));
    
  }
  
  static getTheme() {
    return JSON.parse(localStorage.getItem('themeProperties'));
  }
}
  

export const deckUrl = 'http://localhost:3000/api/v1/deck/';