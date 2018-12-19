pragma solidity >=0.4.22 <0.6.0;

contract Peer2PeerProject{
    struct WorkEvidenceClass{
        string evidence;
        uint hireeSubmitDate;
        
        string hirerComment;
        bool hirerAccepted;
    }
    enum STATUS { NEW, PROCUREMENT, EXECUTION, EVALUATION,ACCEPTED, PAYMENT, CLOSE }
    
    STATUS myStatus;
    
    address public hirer;
    address public hiree;
    uint public projectid;
    string public task_description;
    
    uint public reward;
    
    uint public minCreditScore;
    string public duration;
    string public hirerEncryptedCashOrder;
    
    string public hireeEncryptedCashOrder;
    
    uint public creationDate;
    uint public executionDate;
    
    
    
    
    WorkEvidenceClass public workEvidence;
    
    constructor ( string memory _task_des, uint _reward,uint _minCredit, string memory _duration) public{
        
        hirer=msg.sender;
        
        task_description=_task_des;
        
        reward=_reward;
        
        minCreditScore=_minCredit;
        duration=_duration;
        myStatus = STATUS.NEW;
        projectid=uint( keccak256(abi.encode(block.difficulty,now,hirer,task_description,reward,minCreditScore,duration)));//keccak256 eqv
        creationDate=now;
    }
    
    function deployCashOrder ( string memory _ecashorder) public restrictedhirer{
        hirerEncryptedCashOrder=_ecashorder;
        myStatus = STATUS.PROCUREMENT;
    }
    
    function hireeTakeJob() public{
        require(msg.sender != hirer,"hirer cannot take the job");
        require(myStatus==STATUS.PROCUREMENT, "Contract at PROCUREMENT state before hiree taking job");
        hiree = msg.sender;
        myStatus = STATUS.EXECUTION;
        executionDate = now;
    }
    modifier restrictedhirer(){
        require(msg.sender==hirer,"Only hirer can access");
        _;
    }
    modifier restrictedhiree(){
        require(msg.sender==hiree,"Only hiree can access");
        _;
    }
    
    function hireeSubmitWork (string memory myWorkEvidence) public restrictedhiree{
        require(myStatus==STATUS.EXECUTION,"hiree only submit work when contract is at EXECUTION stage");
        workEvidence.evidence=myWorkEvidence;
        workEvidence.hireeSubmitDate=now;
        myStatus = STATUS.EVALUATION;
    }
    
    function hirerAcceptWork (string memory comment, bool accept) public restrictedhirer{
        require(myStatus==STATUS.EVALUATION, "hirer only accept work when contract is at EVALUATION stage");
        workEvidence.hirerComment=comment;
        workEvidence.hirerAccepted=accept;
        if(accept){
            myStatus = STATUS.ACCEPTED;
        }
    }
    
    function hirerMakePayment(string memory _ecashorder ) public restrictedhirer{
        require(myStatus==STATUS.ACCEPTED, "hirer only make payment after work accepted");
        hireeEncryptedCashOrder=_ecashorder;
        myStatus = STATUS.PAYMENT;
    }
    function hireeConfirmPayment() public restrictedhiree{
        require(myStatus==STATUS.PAYMENT, "hiree only confirm payment after hirer making payment");
        myStatus=STATUS.CLOSE;
    }
    
}