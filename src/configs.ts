export type TerminalConfigs = {
  speed: number;
  start_word: string;
  scanline?: boolean;
};

const default_config: TerminalConfigs = {
  scanline: true,
  speed: 50,
  start_word: "$MICHALE'S MAC:",
};

export default default_config;
