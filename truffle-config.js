const path = require("path");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      host: "127.0.0.1",
      port: 7545
    },
    matic: {
      url: "https://polygon-mainnet.g.alchemy.com/v2/cD4nWvE0TdHTcHso_kppK2Hh9PnukLzZ",
      network_id: 137,
      confirmations: 2,
      timeoutBlocks: 1000,
      skipDryRun: true
    },
  },
  compilers: {
    solc: {
      version: "^0.8",
    }
  }
};
