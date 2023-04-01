export default {
  transform: {
    "^.+\\.(t|j)sx?$": [
      "@swc-node/jest",
      {
        dynamicImport: true,
        experimentalDecorators: true,
        emitDecoratorMetadata: true,
      },
    ],
  },
  extensionsToTreatAsEsm: [".ts"],
  transformIgnorePatterns: ["/!node_modules\\/lodash-es/"],
};
