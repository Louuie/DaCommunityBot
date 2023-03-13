import * as React from "react";
import axios from "axios";
import {
  Alert,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Snackbar,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Transition } from "./Transitions";
import { AuthenticationStatusInterface } from "../../interfaces/Auth";
import { SongArray, SongEntry, Songs } from "../../interfaces/Songs";
import { promoteSong } from "../../api/api";
import { MoveUp } from "@mui/icons-material";
import { Streamer } from "../../interfaces/Streamer";

type Props = AuthenticationStatusInterface & SongArray & Streamer;

export const FormDialog: React.FC<Props> = (props) => {
  const { authenticated } = props as AuthenticationStatusInterface;
  const { songs } = props as SongArray;
  const { Streamer } = props as Streamer;

  const [open1, setOpen1] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [open3, setOpen3] = React.useState(false);

  // // useEffect to test something
  // React.useEffect(() => {
  //   console.log(songs.length);
  // }, [])

  const queryRef = React.useRef<HTMLInputElement>(null);

  const handleAddSongClick = () => setOpen1(true);
  const handleAddSongClose = () => setOpen1(false);

  const handleDisableQueueClick = () => setOpen2(true);
  const handleDisableQueueClose = () => setOpen2(false);

  const handleClearQueueClick = () => setOpen3(true);
  const handleClearQueueClose = () => setOpen3(false);

  const [newSongTitle, setNewSongTitle] = React.useState("");
  const [songEntryErrorMessage, setSongEntryErrorMessage] = React.useState("");
  const [clearSongRequestResponse, setClearSongRequestResponse] =
    React.useState("");

  const [successAddSongSnackBarStatus, setSucessAddSongSnackBarStatus] =
    React.useState(false);
  const [errorAddSongSnackBarStatus, setAddSongErrorSnackBarStatus] =
    React.useState(false);

  const [
    successPromoteSongSnackBarStatus,
    setSuccessPromoteSongSnackBarStatus,
  ] = React.useState(false);
  const [errorPromoteSongSnackBarStatus, setPromoteSongErrorSnackBarStatus] =
    React.useState(false);

  const [
    successDeleteAllSongsSnackBarStatus,
    setSuccessDeleteAllSongsSnackBarStatus,
  ] = React.useState(false);
  const [
    errorDeleteAllSongsSnackBarStatus,
    setErrorDeleteAllSongsSnackBarStatus,
  ] = React.useState(false);

  const [song1ID, setSong1ID] = React.useState("");
  const [song1Title, setSong1Title] = React.useState("");
  const [song2ID, setSong2ID] = React.useState("");

  const handleSong1Change = (event: SelectChangeEvent) => {
    setSong1ID(event.target.value as string);
    console.log(song1ID);
  };

  const handleSong2Change = (event: SelectChangeEvent) => {
    setSong2ID(event.target.value as string);
    console.log(song2ID);
  };

  const handleMenuItemClick = (event: any) => {
    console.log(event.nativeEvent.target.outerText);
    setSong1Title(event.nativeEvent.target.outerText);
  };

  const handleSnackBarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setSucessAddSongSnackBarStatus(false);
    setAddSongErrorSnackBarStatus(false);
    setSuccessPromoteSongSnackBarStatus(false);
    setPromoteSongErrorSnackBarStatus(false);
    setSuccessDeleteAllSongsSnackBarStatus(false);
    setErrorDeleteAllSongsSnackBarStatus(false);
  };

  const deleteAllSongs = async (channel: string) => {
    axios
      .post("http://localhost:3030/delete-all-songs", null, {
        params: {
          channel: channel,
        },
      })
      .then((res) => {
        setClearSongRequestResponse(res.data.message);
        setSuccessDeleteAllSongsSnackBarStatus(true);
      })
      .catch((err) => console.log(err));
    return "";
  };

  const onSubmit = () => {
    axios
      .get("http://localhost:3030/song-request", {
        params: {
          channel: Streamer,
          user: "testuser_" + (Math.random() + 1).toString(36).substring(7),
          q: queryRef.current?.value,
        },
      })
      .then((res) => {
        const song: SongEntry = res.data.data[0];
        console.log(res.data);
        setNewSongTitle(song.name);
        setSucessAddSongSnackBarStatus(true);
      })
      .catch((err) => {
        setAddSongErrorSnackBarStatus(true);
        setSongEntryErrorMessage(err.response.data.error);
      });
  };

  return (
    <Container
      className="flex w-full md:w-full -my-[0.45rem] xxxl:-my-[0.45rem]"
      maxWidth={false}
    >
      <div className="flex flex-1 justify-start items-start mx-2">
        <Typography textAlign="center" variant="h4" className="mt-3">
          Song Requests
        </Typography>
      </div>
      {authenticated ? (
        <div>
          <Container
            className="hidden md:visible md:flex flex-1 items-end justify-end w-full md:mx-6"
            maxWidth={false}
          >
            <Stack direction={"row"}>
              <Typography className="mt-[6px]">Song Queue:</Typography>
              <Switch color="success" />
            </Stack>
            <Button
              variant="contained"
              className="bg-[#127707] text-gray-200 mr-2 mt-4"
              onClick={handleAddSongClick}
            >
              <AddIcon fontSize="small" />
              Add Song
            </Button>
            <Button
              variant="contained"
              className="bg-[#127707] text-gray-200 mr-2 mt-4"
              onClick={handleDisableQueueClick}
            >
              <MoveUp fontSize="small" />
              Promote Song
            </Button>
            <Button
              variant="contained"
              className="bg-[#127707] text-gray-200 mr-2 mt-4"
              onClick={handleClearQueueClick}
            >
              <DeleteForeverIcon fontSize="small" />
              Clear Queue
            </Button>
          </Container>
        </div>
      ) : (
        <div className="hidden"></div>
      )}

      {/*  First Dialog that is used to enter a Song into the song queue */}
      <Dialog
        open={open1}
        onClose={handleAddSongClose}
        TransitionComponent={Transition}
      >
        <DialogTitle>Add Song to Queue</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can enter a direct url from YouTube or a term to search for the
            closest match is chosen, and the search is performed on YouTube.
          </DialogContentText>
          <TextField
            inputRef={queryRef}
            autoFocus
            margin="dense"
            label="Query"
            fullWidth
            variant="standard"
            color="success"
          />
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleAddSongClose}>
            Cancel
          </Button>
          <Button
            color="success"
            onClick={() => {
              onSubmit();
              handleAddSongClose();
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/*  Second Dialog that is used to Promote a Song in the queue */}
      <Dialog
        open={open2}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleDisableQueueClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Promote Song"}</DialogTitle>
        {songs.length !== 0 ? (
          <DialogContent>
            <Box padding={4}>
              <InputLabel id="demo-simple-select-label">Song #1</InputLabel>
              <Box paddingBottom={2}>
                <Select
                  labelId="demo-simple-select-label"
                  value={song1ID}
                  label="Song #1"
                  onChange={handleSong1Change}
                  sx={{ width: '380px' }}
                >
                  {songs.map((song: Songs) => (
                    <MenuItem
                      value={song.Id}
                      onClick={handleMenuItemClick}
                      key={song.Id}
                    >
                      {song.Title}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
              <InputLabel id="demo-simple-select-label">Song #2</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                value={song2ID}
                label="Song #2"
                onChange={handleSong2Change}
                sx={{ width: '380px' }}
              >
                {songs.map((song: Songs) => (
                  <MenuItem value={song.Id} key={song.Id} sx={{ width: '380px' }}>
                    {song.Title}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </DialogContent>
        ) : (
          <DialogContent>
            <Typography>Song Queue is empty</Typography>
          </DialogContent>
        )}
        <DialogActions>
          <Button color="error" onClick={handleDisableQueueClose}>
            Cancel
          </Button>
          <Button
            color="success"
            onClick={() => {
              promoteSong(
                Streamer,
                song1Title,
                Number(song1ID),
                Number(song2ID)
              );
              setOpen2(false);
              setSong1ID("");
              setSong2ID("");
              setSuccessPromoteSongSnackBarStatus(true);
            }}
          >
            Promote
          </Button>
        </DialogActions>
      </Dialog>

      {/*  Third Dialog that is used to Clear the song queue */}
      <Dialog
        open={open3}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClearQueueClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Clear Queue"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to disable the queue? There is no going back!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleClearQueueClose}>
            Cancel
          </Button>
          <Button
            color="success"
            onClick={() => {
              deleteAllSongs(Streamer);
              handleClearQueueClose();
            }}
          >
            Clear
          </Button>
        </DialogActions>
      </Dialog>

      {/*  Two Snackbar's used for the First Dialog, being the one where we enter a song in the queue. */}
      <Snackbar
        open={successAddSongSnackBarStatus}
        autoHideDuration={3000}
        onClose={handleSnackBarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackBarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {`"${newSongTitle}" has been added to the queue!`}
        </Alert>
      </Snackbar>

      <Snackbar
        open={errorAddSongSnackBarStatus}
        autoHideDuration={3000}
        onClose={handleSnackBarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackBarClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          {`${songEntryErrorMessage}`}
        </Alert>
      </Snackbar>

      {/*  Two Snackbar's used for the Second Dialog, being the one where we promote a song in the queue. */}
      <Snackbar
        open={successPromoteSongSnackBarStatus}
        autoHideDuration={3000}
        onClose={handleSnackBarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackBarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {`"${song1Title}" has been promoted in the queue!`}
        </Alert>
      </Snackbar>

      <Snackbar
        open={errorPromoteSongSnackBarStatus}
        autoHideDuration={3000}
        onClose={handleSnackBarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackBarClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          {`${songEntryErrorMessage}`}
        </Alert>
      </Snackbar>

      {/*  Two Snackbar's used for the Third Dialog, being the one where we delete all the songs in the queue. */}
      <Snackbar
        open={successDeleteAllSongsSnackBarStatus}
        autoHideDuration={3000}
        onClose={handleSnackBarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackBarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {`${clearSongRequestResponse}`}
        </Alert>
      </Snackbar>

      <Snackbar
        open={errorDeleteAllSongsSnackBarStatus}
        autoHideDuration={3000}
        onClose={handleSnackBarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackBarClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          {`${songEntryErrorMessage}`}
        </Alert>
      </Snackbar>
    </Container>
  );
};