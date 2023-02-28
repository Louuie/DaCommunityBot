import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { SongArray, Songs } from "../interfaces/Songs";
import { TableHead } from "@mui/material";
import { Delete, Upgrade } from "@mui/icons-material";
import { deleteSong, promoteSong } from "../api/api";
import { AuthenticationStatusInterface } from "../interfaces/Auth";

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box className="flex flex-1 ml-3">
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

type Props = SongArray | AuthenticationStatusInterface;
export const SongTable: React.FC<Props> = (props) => {
  const { authenticated } = props as AuthenticationStatusInterface
  const { songs } = props as SongArray
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(4);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - songs.length) : 0;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer
      component={Paper}
      className="md:mx-[2rem] h-full mx-[1rem] my-4"
      style={{maxHeight: '450px'}}
    >
      <Table
        className="md:min-w-[450px] min-w-[350px]"
        aria-label="custom pagination table"
        size="small"
        
      >
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell align="right">Artist</TableCell>
            <TableCell align="right">Requested by</TableCell>
            <TableCell align="right">Duration</TableCell>
            {authenticated ?
              <div>
                <TableCell className="md:block hidden" align="right">
                  Actions
                </TableCell>
              </div> : <div className="hidden"></div>}
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? songs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : songs
          ).map((song: Songs) => (
            <TableRow key={song.Title}>
              <TableCell component="th" scope="row">
                {song.Title}
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
                {song.Artist}
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
                {song.Userid}
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
                {song.Duration}
              </TableCell>
              {authenticated ?
                  <TableCell style={{ width: 160 }} align="right">
                    <div className="flex flex-1 justify-end items-end">
                      <div
                        className="hover:cursor-pointer"
                        onClick={() => deleteSong(song.Id, song.Title)}
                      >
                        <Delete color="error" />
                      </div>
                      <div
                        className="hover:cursor-pointer"
                        onClick={() => {
                          promoteSong(
                            song.Title,
                            song.Id,
                            song.Id - 1
                          );
                          console.log('promoteid', song.Id)
                        }
                        }
                      >
                        <Upgrade />
                      </div>
                    </div>
                  </TableCell> : <div className="hidden"></div>}
            </TableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[]}
              colSpan={6}
              count={songs.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: {
                  "aria-label": "rows per page",
                },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};