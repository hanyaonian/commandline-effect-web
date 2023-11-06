export type TerminalConfigs = {
  scanline?: {
    speed: number; // second
  };
};

const default_config: TerminalConfigs = {
  scanline: {
    speed: 10000,
  },
};

export default default_config;
