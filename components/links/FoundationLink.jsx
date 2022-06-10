export default function FoundationLink(props) {
  const url = props.url;

  if (url === null) return <></>;

  return (
    <a
      href={url}
      title=""
      target="_blank"
      rel="noreferrer"
      className="align-top"
    >
      <svg
        fill="none"
        viewBox="0 0 98 33"
        xmlns="http://www.w3.org/2000/svg"
        height="16px"
        className="inline"
      >
        <path
          clipRule="evenodd"
          d="M64.894 16.456c0 9.088-7.368 16.456-16.457 16.456s-16.455-7.368-16.455-16.456S39.349 0 48.438 0s16.455 7.368 16.455 16.456zM16.902 1.567a.784.784 0 0 1 1.358 0L35.056 30.66a.784.784 0 0 1-.679 1.176H.785a.784.784 0 0 1-.679-1.176zM68.614.98c-.865 0-1.567.702-1.567 1.568v27.818c0 .866.702 1.567 1.567 1.567h27.819c.865 0 1.567-.701 1.567-1.567V2.547c0-.866-.702-1.568-1.567-1.568z"
          fill="currentColor"
          fillRule="evenodd"
        ></path>
      </svg>
      <span className="ml-1">Foundation</span>
    </a>
  );
}
