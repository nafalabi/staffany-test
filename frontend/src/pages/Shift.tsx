import React, { FunctionComponent, useEffect, useMemo, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import { getErrorMessage } from "../helper/error/index";
import { deleteShiftById, getShifts } from "../helper/api/shift";
import DataTable from "react-data-table-component";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { useHistory } from "react-router-dom";
import ConfirmDialog from "../components/ConfirmDialog";
import Alert from "@material-ui/lab/Alert";
import { Link as RouterLink } from "react-router-dom";
import { Box, Button, Typography } from "@material-ui/core";
import WeekPicker from "../components/WeekPicker";
import {
  formatDate,
  getEndOfWeek,
  getStartOfWeek,
  parseDate,
} from "../helper/date/datehelper";
import { CheckCircleOutline } from "@material-ui/icons";
import {
  doPublishWeek,
  getPublishedWeekStatus,
} from "../helper/api/publishedWeek";
import { parseISO } from "date-fns";
import useQueryData from "../hooks/useQueryData";

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 275,
  },
  fab: {
    position: "absolute",
    bottom: 40,
    right: 40,
    backgroundColor: "white",
    color: theme.color.turquoise,
  },
  publishedWeekInfo: {
    color: theme.color.turqouise,
  },
  customOutlinedButton: {
    color: theme.color.turqouise,
    borderColor: theme.color.turqouise,
    "&:hover": {
      color: theme.color.turqouise,
      borderColor: theme.color.turqouise,
    },
  },
  customContainedButton: {
    backgroundColor: theme.color.turqouise,
    "&:hover": {
      backgroundColor: theme.color.turqouise,
    },
  },
}));

interface ActionButtonProps {
  id: string;
  disabled?: boolean;
  onDelete: () => void;
}
const ActionButton: FunctionComponent<ActionButtonProps> = ({
  id,
  disabled,
  onDelete,
}) => {
  return (
    <div>
      <IconButton
        size="small"
        aria-label="delete"
        component={RouterLink}
        to={`/shift/${id}/edit`}
        disabled={disabled}
      >
        <EditIcon fontSize="small" />
      </IconButton>
      <IconButton
        size="small"
        aria-label="delete"
        onClick={() => onDelete()}
        disabled={disabled}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    </div>
  );
};

const Shift = () => {
  const classes = useStyles();
  const history = useHistory();

  const { query, handleUpdateQuery } = useQueryData(["startOfWeek"]);

  const filterData = useMemo(() => {
    const startOfWeek = query.startOfWeek;
    let parsedDate: Date = parseDate(startOfWeek);
    const isValid = parsedDate instanceof Date && !isNaN(parsedDate.getTime());
    if (!isValid) parsedDate = new Date(); // fallback to current date
    const startDate = getStartOfWeek(parsedDate);
    const endDate = getEndOfWeek(parsedDate);
    return {
      startDate,
      endDate,
    };
  }, [query]);

  const [weekPublishedDate, setWeekPublishedDate] = useState<Date | null>(null);
  const isWeekPublished = Boolean(weekPublishedDate);

  const [rows, setRows] = useState([]);
  const isRowEmpty = rows.length === 0;
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const [showPublishConfirm, setShowPublishConfirm] = useState<boolean>(false);
  const [publishLoading, setPublishLoading] = useState<boolean>(false);

  const onDeleteClick = (id: string) => {
    setSelectedId(id);
    setShowDeleteConfirm(true);
  };

  const onCloseDeleteDialog = () => {
    setSelectedId(null);
    setShowDeleteConfirm(false);
  };

  const onPublishClick = () => {
    setShowPublishConfirm(true);
  };

  const onClosePublishDialog = () => {
    setShowPublishConfirm(false);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        setErrMsg("");
        const strStartDate = formatDate(filterData.startDate);
        const strEndDate = formatDate(filterData.endDate);
        const [{ results: shifts }, { results: weekData }] = await Promise.all([
          getShifts(strStartDate, strEndDate),
          getPublishedWeekStatus(strStartDate, strEndDate),
        ]);
        setRows(shifts);
        setWeekPublishedDate(weekData ? parseISO(weekData?.createdAt) : null);
      } catch (error) {
        const message = getErrorMessage(error);
        setErrMsg(message);
      } finally {
        setIsLoading(false);
      }
    };

    getData();
  }, [filterData]);

  const columns = [
    {
      name: "Name",
      selector: "name",
      sortable: true,
    },
    {
      name: "Date",
      selector: "date",
      sortable: true,
    },
    {
      name: "Start Time",
      selector: "startTime",
      sortable: true,
    },
    {
      name: "End Time",
      selector: "endTime",
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row: any) => (
        <ActionButton
          id={row.id}
          onDelete={() => onDeleteClick(row.id)}
          disabled={isWeekPublished}
        />
      ),
    },
  ];

  const deleteDataById = async () => {
    try {
      setDeleteLoading(true);
      setErrMsg("");

      if (selectedId === null) {
        throw new Error("ID is null");
      }

      await deleteShiftById(selectedId);

      const tempRows = [...rows];
      const idx = tempRows.findIndex((v: any) => v.id === selectedId);
      tempRows.splice(idx, 1);
      setRows(tempRows);
    } catch (error) {
      const message = getErrorMessage(error);
      setErrMsg(message);
    } finally {
      setDeleteLoading(false);
      onCloseDeleteDialog();
    }
  };

  const publishWeek = async () => {
    try {
      setPublishLoading(true);
      setErrMsg("");
      await doPublishWeek({
        startDate: formatDate(filterData.startDate),
        endDate: formatDate(filterData.endDate),
      });
      setWeekPublishedDate(new Date());
    } catch (error) {
      const message = getErrorMessage(error);
      setErrMsg(message);
    } finally {
      setPublishLoading(false);
      onClosePublishDialog();
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card className={classes.root}>
          <CardContent>
            {errMsg.length > 0 ? (
              <Box clone marginBottom="0.5rem">
                <Alert severity="error">{errMsg}</Alert>
              </Box>
            ) : (
              <></>
            )}
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <WeekPicker
                glow={isWeekPublished}
                startDate={filterData.startDate}
                endDate={filterData.endDate}
                onChange={(startDate, endDate) => {
                  handleUpdateQuery({
                    startOfWeek: formatDate(startDate),
                  });
                }}
              />
              <Box display="flex" gridGap="0.5rem" alignItems="center">
                {weekPublishedDate && (
                  <>
                    <CheckCircleOutline className={classes.publishedWeekInfo} />
                    <Box clone marginRight="0.5rem!important">
                      <Typography
                        variant="body2"
                        className={classes.publishedWeekInfo}
                      >
                        Week published on{" "}
                        {formatDate(weekPublishedDate, "dd MMM yyyy, hh:mm aa")}
                      </Typography>
                    </Box>
                  </>
                )}
                <Button
                  variant="outlined"
                  color="primary"
                  className={classes.customOutlinedButton}
                  onClick={() => history.push("/shift/add")}
                  disabled={isWeekPublished}
                >
                  Add Shift
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.customContainedButton}
                  onClick={onPublishClick}
                  disabled={isWeekPublished || isRowEmpty}
                >
                  Publish
                </Button>
              </Box>
            </Box>
            <DataTable
              title="Shifts"
              columns={columns}
              data={rows}
              pagination
              progressPending={isLoading}
            />
          </CardContent>
        </Card>
      </Grid>
      <ConfirmDialog
        title="Delete Confirmation"
        description={`Do you want to delete this data ?`}
        onClose={onCloseDeleteDialog}
        open={showDeleteConfirm}
        onYes={deleteDataById}
        loading={deleteLoading}
      />
      <ConfirmDialog
        title="Publish Confirmation"
        description="Are you sure to publish this week's shifts ?"
        onClose={onClosePublishDialog}
        open={showPublishConfirm}
        onYes={publishWeek}
        loading={publishLoading}
      />
    </Grid>
  );
};

export default Shift;
