import { Container } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

export default function Mint() {
  return (
    <Container className="mt-12">
      <Container maxWidth="xs" style={{ position: "relative" }}>
        <Paper
          style={{
            padding: 24,
            paddingBottom: 10,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            borderRadius: 6,
          }}
        >
          <h1 className="text-white w-fit mx-auto text-xl font-sans font-bold">
            WL: Tomorrow, 10/7, 2pm EST
          </h1>
          <h1 className="text-white w-fit mx-auto text-xl font-sans font-bold">
            Public: Tomorrow, 10/7, 4pm EST
          </h1>
          <h1 className="text-white w-fit mx-auto text-xl font-sans font-bold">
            Supply: 521
          </h1>
          <h1 className="text-white w-fit mx-auto text-xl font-sans font-bold">
            Price: 3 sol
          </h1>
          <Typography
            variant="caption"
            align="center"
            display="block"
            style={{ marginTop: 7, color: "grey" }}
          >
            Powered by METAPLEX
          </Typography>
        </Paper>
      </Container>
    </Container>
  );
}

const getCountdownDate = (candyMachine) => {
  if (
    candyMachine.state.isActive &&
    candyMachine.state.endSettings?.endSettingType.date
  ) {
    return toDate(candyMachine.state.endSettings.number);
  }

  return toDate(
    candyMachine.state.goLiveDate
      ? candyMachine.state.goLiveDate
      : candyMachine.state.isPresale
      ? new anchor.BN(new Date().getTime() / 1000)
      : undefined
  );
};
