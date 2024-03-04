import TwitterLink from "/components/links/TwitterLink";

export default function Footer() {
  return (
    <>
      <div className="h-48 w-full mx-auto px-2 md:px-4 lg:px-12 pb-0 md:pb-4 bg-white dark:bg-dark pt-4 px-4">
        <div className="float-left">
          <p className="dark:text-neutral-400 text-neutral-200 text-sm leading-10">
            Copyright &copy; 2022
          </p>
          <p className="dark:text-neutral-400 text-neutral-200 text-sm leading-10">
            Collect &amp; Share beautiful art with Collector.
          </p>
        </div>
        <div className="float-right">
          <p className="dark:text-neutral-400 text-neutral-200 text-sm leading-10">
            <TwitterLink url="https://twitter.com/collector_sh" />
          </p>
        </div>
      </div>
    </>
  );
}
