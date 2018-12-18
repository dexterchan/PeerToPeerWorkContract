pragma solidity >=0.4.22 <0.6.0;

contract Peer2PeerProject{
    address public hirer;
    
    address public hiree;
    
    uint public projectid;
    
    string public task_description;
    
    string public reward;
    
    uint public minCreditScore;
    string public duration;
    string public encryptedCashOrder;
    
    
    constructor (address _hirer,  string memory _task_description, string memory _reward,uint _minCreditScore, string memory _duration) public{
        hirer=_hirer;
        
        task_description=_task_description;
        
        reward=_reward;
        
        minCreditScore=_minCreditScore;
        duration=_duration;
        
        projectid=uint( keccak256(abi.encode(block.difficulty,now,hirer,task_description,reward,minCreditScore,duration)));//keccak256 eqv
        
    }
    
    function deployCashOrder ( string memory _ecashorder) public{
        encryptedCashOrder=_ecashorder;
    }
    
}