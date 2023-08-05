import Modal from "../Modal";

const EditSubmissionsModal = ({ submissions, setSubmissions, setEditModal }) => { 
  const [listingPrice, setListingPrice] = useState(0);
  const [listing, setListing] = useState(false);

  const handleList = async () => {
    setListing(true)
    //TODO: await list on chain
    function fakeApiCall() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve("API call completed!");
        }, 500); // delay for 2 seconds
      });
    }
    await fakeApiCall()

    success("Your art has been listed!")
    setListing(false)
  }
  return (
    <Modal>

    </Modal>
  )
}

export default EditSubmissionsModal;