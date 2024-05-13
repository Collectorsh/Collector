import axios from "axios";

export default async function handler(req, res) {
  const ordWallet = "bc1pgvz3qtr9u07cuqp9k2ddfpl46fvrffcx5zmsx454f0kj76etsm9slruv39"

  const apiKey = "749cc2d0-edd3-49c2-ae7e-f0f40c1ec658"

  const query = `https://api.ordiscan.com/v1/inscriptions`

  axios.get(query, {
    headers: {
      "Authorization": `Bearer ${ apiKey }`
    },
    params: {
      address: ordWallet
    }
  })
    .then((response) => {
      console.log("Ordinals:", response.data)
      res.status(200).json(response.data)
    }).catch((error) => {
      console.log("Error fetching ordinals:", error)
      res.status(500).json({ status: "error", msg: "Error fetching ordinals" })
    })
}