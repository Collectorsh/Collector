import apiClient from "../client/apiClient";

export async function updateBio(api_key, bio) {
  try {
    const res = await apiClient.post("/user/update_bio", { api_key, bio });
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export async function updateProfileImage(api_key, profile_image) {
  try {
    const res = await apiClient.post("/user/update_profile_image", { api_key, profile_image });
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export async function updateBannerImage(api_key, banner_image) {
  try {
    const res = await apiClient.post("/user/update_banner_image", { api_key, banner_image });
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export async function updateSocials(api_key, socials) {
  try {
    const res = await apiClient.post("/user/update_socials", { api_key, socials });
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

