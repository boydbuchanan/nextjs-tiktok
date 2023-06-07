import { 
  Avatar, Divider, Button,
  CardActions, Card, CardHeader, CardContent,
} from "@mui/material";

import { } from "react";

import ClearIcon from '@mui/icons-material/Clear';
import {TikTokLogo} from 'src/icons/TikTok';
import { TikTokAPI, TikTokListener, TikTokRedirect } from 'src/api/TikTokApi';
import { TikTokProvider, useTikTok } from 'src/api/TikTokContext';

export default function TikTokCard() {
  
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
      <Card>
        <CardHeader title="TikTok"
          avatar={<TikTokLogo color="primary" fontSize="large"/>}
        />
        <Divider />
        <CardContent>
          <TikTokUser />
        </CardContent>
        <CardActions>
          <Button variant="outlined" onClick={() => handleLoginButtonClick()} startIcon={<TikTokLogo color="primary" sx={{ color: "aqua" }}/>}>
            Connect TikTok
          </Button>
        </CardActions>
      </Card>
    </TikTokProvider>
  );
}
function TikTokUser() {
  const { state: { userInfo } } = useTikTok();
  return (
    <>
      {userInfo &&
        <Card>
          <CardHeader title={userInfo.data.user.display_name}
            avatar={<Avatar src={userInfo.data.user.avatar_url} sx={{ bgcolor: "grey" }}><ClearIcon /></Avatar>}
          />
          <Divider />
          <CardContent>
            <h3>
            Followers {userInfo.data.user.follower_count}
            </h3>
          </CardContent>
        </Card>
      }
    </>
  );
}