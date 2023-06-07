import { createContext, useState, useContext, useRef, useEffect } from 'react';
import {setCookie, getCookie} from 'src/util';

export const TikTokContext = createContext({state: {}, actions: {}});

export function useTikTok() {
  return useContext(TikTokContext);
}

export function TikTokProvider({ children }) {
  const [userInfo, setUserInfo] = useState('');
  const value = {
    state: { userInfo },
    actions: { setUserInfo },
  };

  return (
    <TikTokContext.Provider value={value}>
      {children}
    </TikTokContext.Provider>
  )
}

export const TikTokAPI = {
  config: {
    CLIENT_KEY: process.env.NEXT_PUBLIC_TIKTOK_CLIENT_KEY,
    AUTHORIZE_URL: 'https://www.tiktok.com/v2/auth/authorize/',
    REDIRECT_URL: process.env.NEXT_PUBLIC_TIKTOK_REDIRECT_URL,
    API_ACCESS_URL: process.env.NEXT_PUBLIC_TIKTOK_ACCESS_API,
    ACCESS_TOKEN_URL: 'https://open.tiktokapis.com/v2/oauth/token/',
    USER_INFO_URL: 'https://open.tiktokapis.com/v2/user/info/',
    USER_INFO_FIELDS: 'open_id,union_id,display_name,avatar_url,avatar_url_100,follower_count,likes_count,video_count',
  },

  authorize(scope) {
    const csrfState = Math.random().toString(36).substring(2);
    setCookie("csrfState", csrfState, 7);
    const options = {
      response_type: 'code',
      redirect_uri: this.config.REDIRECT_URL,
      state: csrfState
    };
    options.client_key = this.config.CLIENT_KEY;
    options.scope = scope;
    options.is_popup = true;
    const urlQuery = new URLSearchParams();
    for (const option in options) {
      if (!options[option]) {
        continue;
      }
      urlQuery.append(option, options[option]);
    }
    const url = `${options.url || this.config.AUTHORIZE_URL}?${urlQuery.toString()}`;
    const left = (window.screen.width / 2) - (500 / 2);
    const top = (window.screen.height / 2) - (500 / 2);
    const popup = window.open(url, "Login with TikTok", `toolbar=no, width=500, height=720, top=${top}, left=${left}`);
    popup.is_popup = true;
    setCookie("csrfState", csrfState, 7, popup.document);
    return url;
  },

  async submitAuthCode(code) {
    var postBody =new URLSearchParams({
      code: code,
    });
    var requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: postBody,
    };
    const accessResponse = await fetch(this.config.API_ACCESS_URL, requestOptions)
        .then(res => res.json());
    return accessResponse;
  },
  // Server side action
  async getAccessToken(code) {
    var postBody =new URLSearchParams({
      client_key: this.config.CLIENT_KEY,
      client_secret: process.env.TIKTOK_CLIENT_SECRET,
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: this.config.REDIRECT_URL,
    });
    var requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cache-Control': 'no-cache',
        'Accept': '*/*',
      },
      body: postBody,
    };
    const accessResponse = await fetch(this.config.ACCESS_TOKEN_URL, requestOptions)
        .then(res => res.json());
    return accessResponse;
  },

  async getUserInfo(access_token, fields) {
    if (!access_token) {
      throw new Error("Invalid access token");
    }
    fields = fields ? fields : this.config.USER_INFO_FIELDS;
    var requestOptions = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    };
    var fetchUrl = this.config.USER_INFO_URL+"?fields="+fields;
    const userInfo = await fetch(fetchUrl, requestOptions)
        .then(res => res.json());
    return userInfo;
  },
};

export function TikTokListener() {
  const { actions: { setUserInfo } } = useTikTok()
  const addEventListener = useRef(true);
  const handleCode = async (code) => {
    var userInfo = await TikTokAPI.submitAuthCode(code);
    console.log(userInfo);
    setUserInfo(userInfo);
  };
  useEffect(() => {
    if(addEventListener.current){
      addEventListener.current = false;
      window.addEventListener('message', ({ data }) => {
        if(data._tiktokapi) {
          handleCode(data.code);
        }
      });
    }
  }, []);

  return (
    <></>
  )
}

export function TikTokRedirect() {
  const shouldRun = useRef(true);
  const checkRedirect = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const csrfState = getCookie('csrfState');
    
    if (code && state === csrfState) {
      window.opener.postMessage({ _tiktokapi: true, code }, '*');
      window.close();
    }
  };
  useEffect(() => {
    if(shouldRun.current){
      shouldRun.current = false;
      checkRedirect();
    }
  }, []);
  return (
    <></>
  )
}

export default TikTokAPI;