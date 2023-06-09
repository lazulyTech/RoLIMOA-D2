import { FC, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@mui/material';
import { RootState } from 'slices';
import { scoreStateSlice, FieldScoreStateType } from 'slices/score';
import { LyricalSocket } from 'lyricalSocket';
import { isVgoalAvailable } from 'util/VgoalHelper';

type ScoreInputVgoalButtonProps = {
  fieldSide: "blue" | "red",
  color: "primary" | "secondary",
};

export const ScoreInputVgoalButton: FC<ScoreInputVgoalButtonProps> = ({
  fieldSide,
  color,
}) => {
  const dispatch = useDispatch();
  const scoreState = useSelector<RootState, FieldScoreStateType>((state) => state.score.fields[fieldSide]);
  const elapsedSec = useSelector<RootState, number>((state) => state.phase.elapsedSecond);

  const onVgoalButton = useCallback(() => {
    const vgoalTime = elapsedSec;
    const action = scoreStateSlice.actions.setVgoalTime({ fieldSide, vgoalTime });
    LyricalSocket.dispatch(action, dispatch);
  }, [dispatch, fieldSide, elapsedSec]);

  const onVgoalCancelButton = useCallback(() => {
    const action = scoreStateSlice.actions.unsetVgoalTime({ fieldSide });
    LyricalSocket.dispatch(action, dispatch);
  }, [dispatch, fieldSide]);

  const isNotVgoaled = scoreState.vgoal === undefined;

  return (
    <Button
      variant="contained"
      size="medium" 
      onClick={isNotVgoaled ? onVgoalButton : onVgoalCancelButton}
      disabled={isNotVgoaled ? !isVgoalAvailable(scoreState) : false}
      color={isNotVgoaled ? color : "grey"}
      sx={{
        width: '100%',
        fontSize: '100%',
        lineHeight: 2.4,
      }}
    >
      {isNotVgoaled ? "Vゴール 達成" : "Vゴール 取り消し"}
    </Button>
  );
};
