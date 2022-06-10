import GridView from "/components/GridView";

function FollowingAuctions({ auctions }) {
  return <GridView items={auctions} type="auction" />;
}

export default FollowingAuctions;
