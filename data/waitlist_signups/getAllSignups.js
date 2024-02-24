import apiClient from "../client/apiClient";

export async function getWaitlistSignups() {
  try {
    const result = await apiClient.get("/waitlist_signup/get_all").then(res => res.data)
    return result
  } catch (err) {
    console.log(err);
  }
}

export async function getWaitlistSignupById({ userId }) {
  try {
    const result = await apiClient.post(`/waitlist_signup/get_by_user_id`, {
      user_id: userId
    }).then(res => res.data)
    
    return result
  } catch (err) {
    console.log(err);
  }
}