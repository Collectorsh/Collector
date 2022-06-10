export default function HolaplexLink(props) {
  const url = props.url;

  if (url === null) return <></>;

  return (
    <a href={url} title="" target="_blank" rel="noreferrer">
      👋&nbsp;&nbsp;
      <span>Holaplex</span>
    </a>
  );
}
