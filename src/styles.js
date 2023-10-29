import { primary } from "./colors";

export const primaryButton = {
  textTransform: "none",
  background: primary,
  color: "#FFF",
  borderRadius: "8px",
  padding: "12px 32px",
  "&:hover": {
    background: primary, // change the button color when clicked here
  },
  width: "100%",
  marginLeft: "1em",
  marginBottom: "16px",
};
