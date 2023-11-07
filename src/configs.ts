export type TerminalConfigs = {
  speed: string;
  start_word: string;
  scanline?: string;
};

const default_config: TerminalConfigs = {
  scanline: "true",
  speed: "5",
  start_word: "$MICHALE'S MAC:",
};

export default default_config;
