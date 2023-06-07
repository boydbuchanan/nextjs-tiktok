# NextJs TikTok Api With Popup Login

This library will create a window popup that allows a user to authorize the app through tiktok's login process. After logging in the client will send the authorization code to the TikTokAccess handler in the api directory. This server side function will exchange the code for an access_token.

The server will then query for the user and get their profile information and return that to the provider. This is to demonstrate the full process, it is recomended to store the access and refresh tokens for the user and refresh every day.

## Installation

Copy the following files into their respective directories

`src\api\TikTokApi.js`
`pages\api\social\TikTokAccess.js`
`src\funcs.js`

## Configuration

Add your ClientKey, ClientSecret and set your urls as outlined in the env.sample file provided.

```ini
# Private Server Only Keys
TIKTOK_CLIENT_SECRET=

# Public Client Keys
NEXT_PUBLIC_TIKTOK_CLIENT_KEY=
NEXT_PUBLIC_TIKTOK_REDIRECT_URL=https://loc.localhost.com/
NEXT_PUBLIC_TIKTOK_ACCESS_API=https://loc.localhost.com/api/social/tiktokaccess/
```

## Redirect and Listen

The TikTokListener and TikTokRedirect components are required to finish the process. Add TikTokRedirect to the redirect page. This will post a message to the winow opener.

`<TikTokRedirect />`

On the page opening the window, add the TikTokListener component to listen for the message from the popup window.

`<TikTokListener />`

## Authorization

Simply use the following:

`TikTokAPI.authorize(['user.info.basic']);`

From a button of course.

```nodejs
const handleLoginButtonClick = () => {
  // Open the TikTok login popup
  TikTokAPI.authorize(['user.info.basic']);
};
```
 Called from a button 
```nodejs
<button onClick={() => handleLoginButtonClick()}>
  <TikTokLogo /> Connect TikTok
</button>
```

## Data & Usage
An example provider is available to use the information, but is not stored in any session and will be lost.

```
function TikTokUser() {
  const { state: { userInfo } } = useTikTok();
  return (
    <>
      <TikTokProvider>
        {userInfo &&
          <h2>{userInfo.data.user.display_name}</h2>
          <img src={userInfo.data.user.avatar_url} />
        }
      </TikTokProvider>
    </>
  );
}
```

## Altogether now

```javascript
import {TikTokLogo} from 'src/icons/TikTok';
import  { TikTokAPI, TikTokProvider, TikTokListener, TikTokRedirect, useTikTok } from 'src/api/TikTokApi';

export default function TikTokCard() {
  const { state: { userInfo } } = useTikTok();
  const handleLoginButtonClick = () => {
    // Open the TikTok login popup
    TikTokAPI.authorize(
      ['user.info.basic'],
    );
  };
  return (
    <TikTokProvider>
      <TikTokRedirect />
      <TikTokListener />
      {userInfo &&
        <h2>{userInfo.data.user.display_name}</h2>
        <img src={userInfo.data.user.avatar_url} />
      }
      <button onClick={() => handleLoginButtonClick()}>
        <TikTokLogo /> Connect TikTok
      </button>
    </TikTokProvider>
  );
}
```
