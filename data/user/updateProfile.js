import apiClient from "../client/apiClient";

export async function updateBio(api_key, bio_delta) {
  try {
    const res = await apiClient.post("/user/update_bio", { api_key, bio_delta });
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

export async function updateDisplayName(api_key, displayName) {
  try {
    const res = await apiClient.post("/user/update_display_name", { api_key, name: displayName });
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

