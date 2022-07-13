import ExchangeLogo from "/components/logos/ExchangeLogo";
import FormfunctionLogo from "/components/logos/FormfunctionLogo";
import HolaplexLogo from "/components/logos/HolaplexLogo";
import CollectorLogo from "/components/logos/CollectorLogo";

export default function ShareToTwitter({ source, color }) {
  return (
    <>
      {source === "holaplex" && <HolaplexLogo color={color} />}
      {source === "exchange" && <ExchangeLogo color={color} />}
      {source === "formfunction" && <FormfunctionLogo color={color} />}
      {source === "collector" && <CollectorLogo color={color} />}
    </>
  );
}
