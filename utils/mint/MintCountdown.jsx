import { Paper } from "@material-ui/core";
import Countdown from "react-countdown";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: "inline-flex",
      padding: theme.spacing(0),
      "& > *": {
        display: "flex",
        flexDirection: "row",
        alignContent: "flex-start",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        borderRadius: 5,
        fontSize: 14,
      },
    },
    done: {
      display: "inline-flex",
      margin: 0,
      flexDirection: "row",
      alignContent: "flex-start",
      alignItems: "flex-start",
      justifyContent: "flex-start",
      fontWeight: "normal",
      fontSize: 14,
    },
    item: {
      fontWeight: "normal",
      fontSize: 14,
    },
  })
);

export const MintCountdown = ({ date, status, style, onComplete }) => {
  const classes = useStyles();
  const renderCountdown = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return status ? <span className={classes.done}>{status}</span> : null;
    } else {
      return (
        <div className={classes.root} style={style}>
          <div className="text-black dark:text-white">
            {days > 0 && (
              <Paper elevation={0} style={{ background: "none" }}>
                <span className={classes.item}>{days}</span>
                {days > 1 && <span>days</span>}
                {days === 1 && <span>day</span>}
              </Paper>
            )}
            <Paper elevation={0}>
              <span className={classes.item}>
                {hours < 10 ? `0${hours}` : hours}
              </span>
              <span>hrs</span>
            </Paper>
            <Paper elevation={0}>
              <span className={classes.item}>
                {minutes < 10 ? `0${minutes}` : minutes}
              </span>
              <span>mins</span>
            </Paper>
            {days === 0 && (
              <Paper elevation={0}>
                <span className={classes.item}>
                  {seconds < 10 ? `0${seconds}` : seconds}
                </span>
                <span>secs</span>
              </Paper>
            )}
          </div>
        </div>
      );
    }
  };

  if (date) {
    return (
      <Countdown
        date={date}
        onComplete={onComplete}
        renderer={renderCountdown}
      />
    );
  } else {
    return null;
  }
};
