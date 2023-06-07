import  { TikTokAPI } from 'src/api/TikTokApi';

export default async function handler(req, res) {
  const { code } = req.body;
  try {
    if (req.method !== 'POST') {
      res.status(405).send({ message: 'Only POST requests allowed' })
      return
    }
    var accessTokenResponse = await TikTokAPI.getAccessToken(code);
    if(!accessTokenResponse || accessTokenResponse.access_token == undefined){
      res.status(405).send({ message: 'Error retrieving access token' })
      return
    }
    // Save access and refresh tokens to database
    var profile = await TikTokAPI.getUserInfo(accessTokenResponse.access_token);
    res.status(200).json(profile);
  } catch (error) {
    res.status(405).send({ message: error.message });
    return
  }
};