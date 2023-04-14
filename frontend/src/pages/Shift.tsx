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
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { useHistory, useLocation } from "react-router-dom";
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
  onDelete: () => void;
}
const ActionButton: FunctionComponent<ActionButtonProps> = ({
  id,
  onDelete,
}) => {
  return (
    <div>
      <IconButton
        size="small"
        aria-label="delete"
        component={RouterLink}
        to={`/shift/${id}/edit`}
      >
        <EditIcon fontSize="small" />
      </IconButton>
      <IconButton size="small" aria-label="delete" onClick={() => onDelete()}>
        <DeleteIcon fontSize="small" />
      </IconButton>
    </div>
  );
};

const useFilterData = () => {
  const history = useHistory();
  const { search, pathname } = useLocation();

  const query = useMemo(() => {
    const searchParams = new URLSearchParams(search);
    return {
      startOfWeek: searchParams.get("startOfWeek"),
    };
  }, [search]);

  const filterData = useMemo(() => {
    const startOfWeek = query.startOfWeek;

    const startDate = startOfWeek
      ? getStartOfWeek(parseDate(startOfWeek))
      : getStartOfWeek(new Date());

    const endDate = getEndOfWeek(startDate);

    return {
      startDate,
      endDate,
    };
  }, [query]);

  const handleUpdateQuery = (update: Partial<typeof query>) => {
    const newQuery = {
      ...query,
      ...update,
    } as Record<string, string>;
    const searchParams = new URLSearchParams(newQuery);
    history.replace(pathname + "?" + searchParams.toString());
  };

  return {
    filterData,
    query,
    handleUpdateQuery,
  };
};

const Shift = () => {
  const classes = useStyles();
  const history = useHistory();

  const { filterData, handleUpdateQuery } = useFilterData();
  const [weekPublishedDate, setWeekPublishedDate] = useState<Date | null>(
    // new Date()
    null
  );
  const isWeekPublished = Boolean(weekPublishedDate);

  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const onDeleteClick = (id: string) => {
    setSelectedId(id);
    setShowDeleteConfirm(true);
  };

  const onCloseDeleteDialog = () => {
    setSelectedId(null);
    setShowDeleteConfirm(false);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        setErrMsg("");
        const { results } = await getShifts();
        setRows(results);
      } catch (error) {
        const message = getErrorMessage(error);
        setErrMsg(message);
      } finally {
        setIsLoading(false);
      }
    };

    getData();
  }, []);

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
        <ActionButton id={row.id} onDelete={() => onDeleteClick(row.id)} />
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

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card className={classes.root}>
          <CardContent>
            {errMsg.length > 0 ? (
              <Alert severity="error">{errMsg}</Alert>
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
                    <Typography
                      variant="body2"
                      className={classes.publishedWeekInfo}
                    >
                      Week published on{" "}
                      {formatDate(weekPublishedDate, "dd MMM yyyy, hh:mm aa")}
                    </Typography>
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
                  onClick={() => alert("publish")}
                  disabled={isWeekPublished}
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
      <Fab
        size="medium"
        aria-label="add"
        className={classes.fab}
        onClick={() => history.push("/shift/add")}
      >
        <AddIcon />
      </Fab>
      <ConfirmDialog
        title="Delete Confirmation"
        description={`Do you want to delete this data ?`}
        onClose={onCloseDeleteDialog}
        open={showDeleteConfirm}
        onYes={deleteDataById}
        loading={deleteLoading}
      />
    </Grid>
  );
};

export default Shift;
