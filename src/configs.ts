export type TerminalConfigs = {
  box_conifg?: {
    speed: number;
    start_word: string;
  };
  scanline?: boolean;
};

const default_config: TerminalConfigs = {
  scanline: true,
  box_conifg: {
    speed: 50,
    start_word: "$MICHALE'S MAC:",
  },
};

export default default_config;
