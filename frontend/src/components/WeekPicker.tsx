import { Box, Button, Theme, Typography, styled, withStyles } from "@material-ui/core";
import ArrowLeftIcon from "@material-ui/icons/ArrowLeft";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import { addWeeks, format, subWeeks } from "date-fns";
import React, { FunctionComponent } from "react";
import { getEndOfWeek, getStartOfWeek } from "../helper/date/datehelper";

const CustomButton = withStyles((theme) => ({
  root: {
    padding: 0,
    minWidth: 24,
  },
}))(Button);

const CustomTypography: any = styled(Typography)(({ theme, glow }: { theme: Theme, glow: boolean }) => ({
  color: glow ? theme.color.turqouise : "",
}));

export type WeekPickerType = {
  startDate: Date;
  endDate: Date;
  onChange: (startDate: Date, endDate: Date) => void;
  glow?: boolean;
};

const WeekPicker: FunctionComponent<WeekPickerType> = ({
  startDate,
  endDate,
  onChange,
  glow,
}) => {
  const handleChange = (direction: "forward" | "backward") => {
    let newStartDate;
    if (direction === "forward") {
      newStartDate = addWeeks(startDate, 1);
    } else {
      newStartDate = subWeeks(startDate, 1);
    }
    onChange(getStartOfWeek(newStartDate), getEndOfWeek(newStartDate));
  };

  return (
    <Box display="flex" alignItems="center" gridGap="0.5rem">
      <CustomButton variant="outlined" onClick={() => handleChange("backward")}>
        <ArrowLeftIcon />
      </CustomButton>
      <CustomTypography glow={glow}>
        {format(startDate, "MMM d")} - {format(endDate, "MMM d")}
      </CustomTypography>
      <CustomButton variant="outlined" onClick={() => handleChange("forward")}>
        <ArrowRightIcon />
      </CustomButton>
    </Box>
  );
};

export default WeekPicker;
