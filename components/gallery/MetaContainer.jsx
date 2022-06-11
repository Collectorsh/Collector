import Name from "/components/gallery/meta/Name";
import Description from "/components/gallery/meta/Description";
import ArtistDetails from "/components/gallery/meta/ArtistDetails";

export default function MetaContainer({ user, token }) {
  if (user && !user.names && !user.description && !user.show_artist_name)
    return null;

  return (
    <>
      <div className="mt-2">
        <Name user={user} token={token} />
        <ArtistDetails user={user} token={token} />
        <Description user={user} token={token} />
      </div>
    </>
  );
}
