var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var CommunityLeaderboard = artifacts.require("./CommunityLeaderboard.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(CommunityLeaderboard);
};
