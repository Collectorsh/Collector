import apiClient from '../client/apiClient'

export const adminGetAllCuratorCurations = async (apiKey) => {
  return apiClient.post(`/curation/get_all_curator_curations_with_private_hash`, {
    api_key: apiKey,
  })
    .then(res => res.data)
    .catch(err => {
      console.log(err)
    })
}