declare module 'react-native-piano' {
  import * as React from 'react';
  import { ViewProps } from 'react-native';

  export interface PianoProps extends ViewProps {
    noteRange: { first: string; last: string };
    onPlayNoteInput?: (midiNumber: number) => void;
    onStopNoteInput?: (midiNumber: number) => void;
  }

  export const Piano: React.FC<PianoProps>;
}