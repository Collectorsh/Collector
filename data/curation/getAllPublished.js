import apiClient from '../client/apiClient'

export const getAllPublished = async ({
  page,
  perPage,
  orderBy
}) => {
  return apiClient.post(`/curation/get_all_published`, {
    page,
    per_page: perPage,
    order_by: orderBy
  })
    .then(res => res.data)
    .catch(err => {
      console.log(err)
    })
}