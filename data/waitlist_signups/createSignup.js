import apiClient from "../client/apiClient";

export async function createWaitlistSignup({ userId, email, twitterHandle, moreInfo }) {
  try {
    const result = await apiClient.post("/waitlist_signup/create",
      {
        user_id: userId,
        email,
        twitter_handle: twitterHandle,
        more_info: moreInfo
      }
    ).then(res => res.data)

    return result
  } catch (err) {
    console.log(err);
  }
}