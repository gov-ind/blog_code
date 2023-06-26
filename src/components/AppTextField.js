import React from 'react';
import { TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import { primary } from '../colors';

const useStyles = makeStyles({
  textField: {
    marginBottom: '16px',
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: primary, // change the border color here
          borderWidth: 2
        },
        '&.Mui-focused fieldset': {
          borderColor: primary,
          borderWidth: 2
        },
    }
  }
});

export default props => {
  const classes = useStyles();
  const combinedClassName = clsx(classes.textField, props.className);

  return <TextField
    {...props}
    className={combinedClassName}
    variant="outlined"
    fullWidth
  />
}