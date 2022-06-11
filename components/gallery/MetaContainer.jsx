import Name from "/components/gallery/meta/Name";
import Description from "/components/gallery/meta/Description";
import ArtistDetails from "/components/gallery/meta/ArtistDetails";

export default function MetaContainer({ user, token }) {
  return (
    <div className="mt-2">
      {user && (
        <>
          {user.names && <Name user={user} token={token} />}
          {user.show_artist_name && <ArtistDetails token={token} />}
          {user.description && <Description user={user} token={token} />}
        </>
      )}
    </div>
  );
}
