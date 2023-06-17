import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/slices';
import { ConnectedDevice } from '@/slices/connectedDevices';
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { LyricalSocket } from '@/lyricalSocket';

export const DeviceListContainer: FC = () => {
  const connectedDevices = useSelector<RootState, ConnectedDevice[]>((state) => state.connectedDevices);

  const onSaveClick = () => {
    LyricalSocket.instance.socket.emit("save_store");
  };

  return (
    <Paper sx={{ padding: '1em' }}>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        デバイス管理
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableBody>
            {connectedDevices.map((device) => (
              <TableRow key={device.sockId}>
                <TableCell scope="row">
                  {device.deviceName}
                </TableCell>
                <TableCell>
                  {device.currentPath ?? "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <IconButton onClick={onSaveClick}>
          <SaveIcon />
        </IconButton>
      </TableContainer>
    </Paper>
  );
};
