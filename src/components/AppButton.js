import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";

import { primaryButton } from "../styles";

const useStyles = makeStyles((theme) => ({
  button: primaryButton,
}));

export default (props) => {
  const classes = useStyles();

  return <Button className={classes.button} {...props}></Button>;
};
