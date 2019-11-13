pragma solidity >=0.4.21 <0.6.0;

contract Bet {
    mapping(address => mapping(address => uint256)) public bettingsFor;
    mapping(address => uint256) public playerBettingsForCount;
    mapping(address => address[]) public bettersFor;

    mapping(address => mapping(address => uint256)) public bettingsAgainst;
    mapping(address => uint256) public playerBettingsAgainstCount;
    mapping(address => address[]) public bettersAgainst;

    function betFor(address _player, uint256 _value) public returns (bool success) {  // required
        bettingsFor[_player][msg.sender] = _value;
        playerBettingsForCount[_player]++;
        bettersFor[_player].push(msg.sender);
        return true;
    }

    function betAgainst(address _player, uint256 _value) public returns (bool success) {  // required
        bettingsAgainst[_player][msg.sender] = _value;
        playerBettingsAgainstCount[_player]++;
        bettersAgainst[_player].push(msg.sender);
        return true;
    }

    function getBettersFor(address _winner) public view returns (address[] memory) {
        return bettersFor[_winner];
    }
    function getBettersAgainst(address _winner) public view returns (address[] memory) {
        return bettersAgainst[_winner];
    }
}
