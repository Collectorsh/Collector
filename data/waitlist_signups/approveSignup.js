import apiClient from "../client/apiClient";

export async function approveWaitlistSignup({ signupUserId, apiKey }) {
  try {
    const result = await apiClient.post("/waitlist_signup/approve_waitlist",
      {
        api_key: apiKey,
        user_id: signupUserId,
      }
    ).then(res => res.data)

    return result
  } catch (err) {
    console.log(err);
  }
}