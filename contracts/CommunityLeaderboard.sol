pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./lib/BasicMetaTransaction.sol";

interface IERC721 {
    function owner() external returns (address owner);

    function ownerOf(uint256 tokenId) external returns (address owner);
}

contract CommunityLeaderboard is Ownable, Pausable, BasicMetaTransaction {
    using SafeMath for uint256;

    uint256 public maxLeaderboardsPerProject = 50;

    event ProjectRegistered(
        bytes32 projectHashId,
        uint256 projectId,
        address indexed from,
        address indexed nftContract,
        string name,
        uint256 numberOfLeaderboards
    );

    event NewProjectOwnerAdded(
        bytes32 projectHashId,
        uint256 _projectId,
        address indexed _newOwner
    );

    event LeaderboardCreated(
        bytes32 leaderboardHashId,
        address indexed creator,
        string leaderboardName,
        uint256 projectId,
        uint256 leaderBoardId,
        uint256 epochCount,
        uint256 epoch
    );

    event VoteCast(
        bytes32 voteHashId,
        uint256 projectId,
        uint256 leaderboardId,
        address indexed member,
        uint256 nftTokenId,
        address indexed voter
    );

    event VoteChanged(
        bytes32 changeVoteHashId,
        uint256 projectId,
        uint256 leaderboardId,
        address indexed member,
        address indexed newMember
    );

    struct Project {
        mapping(address => bool) addressToIsOwner;
        address[] owners;
        address nftContract;
        string name;
        uint256 projectId;
        uint256 numberOfLeaderboards;
    }

    struct MemberRow {
        uint256 numberOfVotes;
        address[] voters;
        mapping(address => uint256) addressToIndex;
    }

    struct LeaderboardSettings {
        string name;
        uint256 projectId;
        uint256 leaderBoardId;
        uint256 epochCount; // How many leaderboard epochs have passed
        uint256 epoch; // Days per epoch
    }

    struct LeaderboardInstance {
        uint256 leaderBoardId;
        uint256 blockStart;
        uint256 blockEnd;
        address[] members; // Addresses that have received votes (used to iterate)
        address[] voters;
        mapping(address => MemberRow) rows;
        mapping(address => bool) voterToHasVoted;
    }

    uint256 public projectCount = 0;
    uint256[] public projectIds;
    mapping(uint256 => Project) public projectIdToProject;
    mapping(uint256 => mapping(uint256 => LeaderboardSettings))
        public leaderboardIndex;
    mapping(uint256 => mapping(uint256 => mapping(uint256 => LeaderboardInstance)))
        public epochToLeaderboard;

    function getLeaderboard(uint256 _projectId, uint256 _leaderboardId)
        external
        view
        returns (
            string memory,
            uint256,
            uint256,
            uint256,
            uint256
        )
    {
        LeaderboardSettings storage leaderboard = leaderboardIndex[_projectId][
            _leaderboardId
        ];
        return (
            leaderboard.name,
            leaderboard.projectId,
            leaderboard.leaderBoardId,
            leaderboard.epochCount,
            leaderboard.epoch
        );
    }

    function getProjectName(uint256 _projectId)
        external
        view
        returns (string memory)
    {
        return projectIdToProject[_projectId].name;
    }

    // change name to getProjectNumberOfLeaderboards
    function getProjectepochCount(uint256 _projectId)
        external
        view
        returns (uint256)
    {
        return projectIdToProject[_projectId].numberOfLeaderboards;
    }

    function getLeaderboardName(uint256 _projectId, uint256 _leaderboardId)
        external
        view
        returns (string memory)
    {
        return leaderboardIndex[_projectId][_leaderboardId].name;
    }

    function getLeaderboardMemberLength(
        uint256 _projectId,
        uint256 _leaderboardId
    ) external view returns (uint256) {
        return
            epochToLeaderboard[_projectId][_leaderboardId][
                leaderboardIndex[_projectId][_leaderboardId].epochCount
            ].members.length;
    }

    function getLeaderboardMemberAddress(
        uint256 _projectId,
        uint256 _leaderboardId,
        uint256 _memberId
    ) external view returns (address) {
        return
            epochToLeaderboard[_projectId][_leaderboardId][
                leaderboardIndex[_projectId][_leaderboardId].epochCount
            ].members[_memberId];
    }

    function getLeaderboardMemberVoteCount(
        uint256 _projectId,
        uint256 _leaderboardId,
        uint256 _memberId
    ) external view returns (uint256) {
        return
            epochToLeaderboard[_projectId][_leaderboardId][
                leaderboardIndex[_projectId][_leaderboardId].epochCount
            ]
                .rows[
                    epochToLeaderboard[_projectId][_leaderboardId][
                        leaderboardIndex[_projectId][_leaderboardId].epochCount
                    ].members[_memberId]
                ]
                .numberOfVotes;
    }

    function getLeaderboardMemberVoteCountByAddress(
        uint256 _projectId,
        uint256 _leaderboardId,
        address _member
    ) external view returns (uint256) {
        return
            epochToLeaderboard[_projectId][_leaderboardId][
                leaderboardIndex[_projectId][_leaderboardId].epochCount
            ].rows[_member].numberOfVotes;
    }

    function getLeaderboardArchivedMemberVoteCount(
        uint256 _projectId,
        uint256 _leaderboardId,
        address _member,
        uint256 _leaderboardArchiveId
    ) external view returns (uint256) {
        return
            epochToLeaderboard[_projectId][_leaderboardId][
                _leaderboardArchiveId
            ].rows[_member].numberOfVotes;
    }

    function registerProject(address _nftContract, string memory _name)
        public
        whenNotPaused
        returns (uint256)
    {
        address nftContractOwner = IERC721(_nftContract).owner();
        require(
            nftContractOwner == msgSender(),
            "You do not own this NFT contract."
        );

        Project storage newProject = projectIdToProject[projectCount];
        newProject.addressToIsOwner[msgSender()] = true;
        newProject.owners.push(msgSender());
        newProject.nftContract = _nftContract;
        newProject.name = _name;
        newProject.projectId = projectCount;
        newProject.numberOfLeaderboards = 0;

        projectCount = projectCount.add(1);

        bytes32 projectHashId = keccak256(
            abi.encodePacked(_nftContract, ":", newProject.projectId)
        );

        emit ProjectRegistered(
            projectHashId,
            newProject.projectId,
            msgSender(),
            _nftContract,
            _name,
            newProject.numberOfLeaderboards
        );

        return newProject.projectId;
    }

    function addOwnerToProject(uint256 _projectId, address _newOwner)
        public
        whenNotPaused
    {
        require(
            projectIdToProject[_projectId].addressToIsOwner[msgSender()] ==
                true,
            "You are not an owner of this project."
        );
        projectIdToProject[_projectId].addressToIsOwner[_newOwner] = true;
        projectIdToProject[_projectId].owners.push(_newOwner);

        bytes32 projectHashId = keccak256(
            abi.encodePacked(
                projectIdToProject[_projectId].nftContract,
                ":",
                _projectId
            )
        );

        emit NewProjectOwnerAdded(projectHashId, _projectId, _newOwner);
    }

    function deleteProject(uint256 _projectId) external onlyOwner {
        delete projectIdToProject[_projectId];
    }

    function deleteLeaderboard(uint256 _projectId, uint256 _leaderboardId)
        external
        onlyOwner
    {
        delete leaderboardIndex[_projectId][_leaderboardId];
    }

    function userDeleteProject(uint256 _projectId) external {
        require(
            projectIdToProject[_projectId].addressToIsOwner[msgSender()] ==
                true,
            "You are not an owner of this project."
        );
        delete projectIdToProject[_projectId];
    }

    function userDeleteLeaderboard(uint256 _projectId, uint256 _leaderboardId)
        external
        onlyOwner
    {
        require(
            projectIdToProject[_projectId].addressToIsOwner[msgSender()] ==
                true,
            "You are not an owner of this project."
        );
        delete leaderboardIndex[_projectId][_leaderboardId];
    }

    function createLeaderboard(
        uint256 _projectId,
        string memory _leaderboardName,
        uint256 _time
    ) public whenNotPaused returns (uint256) {
        require(
            projectIdToProject[_projectId].addressToIsOwner[msgSender()] ==
                true,
            "You are not an owner of this project."
        );
        require(
            projectIdToProject[_projectId].numberOfLeaderboards <
                maxLeaderboardsPerProject,
            "Have reached max amount of leaderboards allowed in this project."
        );

        LeaderboardSettings storage newLeaderboard = leaderboardIndex[
            _projectId
        ][projectIdToProject[_projectId].numberOfLeaderboards];
        newLeaderboard.name = _leaderboardName;
        newLeaderboard.projectId = _projectId;
        newLeaderboard.leaderBoardId = projectIdToProject[_projectId]
            .numberOfLeaderboards;
        newLeaderboard.epochCount = 1;
        newLeaderboard.epoch = _time;

        LeaderboardInstance storage leaderboardInstance = epochToLeaderboard[
            _projectId
        ][projectIdToProject[_projectId].numberOfLeaderboards][1];
        leaderboardInstance.blockStart = block.number;
        leaderboardInstance.blockEnd = block.number + _time;

        projectIdToProject[_projectId]
            .numberOfLeaderboards = projectIdToProject[_projectId]
            .numberOfLeaderboards
            .add(1);

        bytes32 leaderboardHashId = keccak256(
            abi.encodePacked(
                newLeaderboard.projectId,
                ":",
                newLeaderboard.leaderBoardId
            )
        );

        emit LeaderboardCreated(
            leaderboardHashId,
            msgSender(),
            _leaderboardName,
            _projectId,
            newLeaderboard.leaderBoardId,
            newLeaderboard.epochCount,
            newLeaderboard.epoch
        );

        return newLeaderboard.leaderBoardId;
    }

    function castVote(
        uint256 _projectId,
        uint256 _leaderboardId,
        address _member,
        uint256 _nftTokenId
    ) public whenNotPaused {
        require(
            leaderboardIndex[_projectId][_leaderboardId].epoch != 0,
            "This leaderboard does not exist."
        );
        require(_member != msgSender(), "Cannot vote for self");

        address nftOwner = IERC721(projectIdToProject[_projectId].nftContract)
            .ownerOf(_nftTokenId);
        require(
            nftOwner == msgSender(),
            "You do not own the NFT based on the token ID provided."
        );

        LeaderboardInstance storage leaderboardInstance = epochToLeaderboard[
            _projectId
        ][_leaderboardId][
            leaderboardIndex[_projectId][_leaderboardId].epochCount
        ];

        if (leaderboardInstance.blockEnd <= block.number) {
            leaderboardIndex[_projectId][_leaderboardId]
                .epochCount = leaderboardIndex[_projectId][_leaderboardId]
                .epochCount
                .add(1);
            leaderboardInstance = epochToLeaderboard[_projectId][
                _leaderboardId
            ][leaderboardIndex[_projectId][_leaderboardId].epochCount];
        }

        require(
            leaderboardInstance.voterToHasVoted[msgSender()] == false,
            "You have already voted on this leaderboard."
        );

        leaderboardInstance.voterToHasVoted[msgSender()] = true;
        leaderboardInstance.voters.push(msgSender());

        MemberRow storage member = leaderboardInstance.rows[_member];

        if (member.numberOfVotes == 0) {
            leaderboardInstance.members.push(_member);
        }

        member.addressToIndex[msgSender()] = member.voters.length;
        member.voters.push(msgSender());
        member.numberOfVotes = member.numberOfVotes.add(1);

        bytes32 voteHashId = keccak256(
            abi.encodePacked(
                _projectId,
                _leaderboardId,
                leaderboardIndex[_projectId][_leaderboardId].epochCount,
                msgSender()
            )
        );

        emit VoteCast(
            voteHashId,
            _projectId,
            _leaderboardId,
            _member,
            _nftTokenId,
            msgSender()
        );
    }

    function changeVote(
        uint256 _projectId,
        uint256 _leaderboardId,
        address _member,
        address _newMember
    ) public whenNotPaused {
        LeaderboardInstance storage leaderboardInstance = epochToLeaderboard[
            _projectId
        ][_leaderboardId][
            leaderboardIndex[_projectId][_leaderboardId].epochCount
        ];

        if (leaderboardInstance.blockEnd <= block.number) {
            leaderboardIndex[_projectId][_leaderboardId]
                .epochCount = leaderboardIndex[_projectId][_leaderboardId]
                .epochCount
                .add(1);
            leaderboardInstance = epochToLeaderboard[_projectId][
                _leaderboardId
            ][leaderboardIndex[_projectId][_leaderboardId].epochCount];
        }

        require(
            leaderboardInstance.voterToHasVoted[msgSender()] == true,
            "You have not voted on this leaderboard."
        );
        require(
            _member != _newMember,
            "Cannot change vote to the same member."
        );

        MemberRow storage member = leaderboardInstance.rows[_member];
        delete member.voters[member.addressToIndex[msgSender()]];
        delete member.addressToIndex[msgSender()];
        member.numberOfVotes = member.numberOfVotes.sub(1);

        MemberRow storage newMember = leaderboardInstance.rows[_newMember];
        newMember.voters.push(msgSender());
        newMember.numberOfVotes = member.numberOfVotes.add(1);

        if (newMember.numberOfVotes == 0) {
            leaderboardInstance.members.push(_newMember);
        }

        bytes32 changeVoteHashId = keccak256(
            abi.encodePacked(
                _projectId,
                _leaderboardId,
                leaderboardIndex[_projectId][_leaderboardId].epochCount,
                msgSender()
            )
        );

        emit VoteChanged(
            changeVoteHashId,
            _projectId,
            _leaderboardId,
            _member,
            _newMember
        );
    }
}
