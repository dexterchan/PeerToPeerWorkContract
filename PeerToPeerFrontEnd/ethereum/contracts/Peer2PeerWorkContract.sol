pragma solidity >=0.4.22 <0.6.0;

contract Peer2PeerProject{
    struct Evidence {
            string evidenceDes;
            uint hireeSubmitDate;
            
            string hirerComment;
            bool hirerAccepted;
    }
    struct WorkEvidenceClass{
        Evidence[] evidences;
        uint evidenceCount;
    }
    enum STATUS { NEW, PROCUREMENT, EXECUTION, EVALUATION,ACCEPTED, PAYMENT, CLOSE }
    
    STATUS public myStatus;
    
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
        workEvidence.evidenceCount=0;
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
    modifier checkEvidenceRange(uint num){
        require(workEvidence.evidenceCount>num && num>=0,"Evidence out of range");
        _;
    }
    
    function hireeSubmitWork (string memory myWorkEvidence) public restrictedhiree{
        require(myStatus==STATUS.EXECUTION || myStatus==STATUS.EVALUATION,"hiree only submit work when contract is at EXECUTION/EVALUATION stage");
        
        myStatus = STATUS.EVALUATION;
        
        Evidence memory newEvidence =  Evidence({
               evidenceDes:myWorkEvidence,
               hireeSubmitDate:now,
               hirerComment:"",
               hirerAccepted:false
            });
            
        workEvidence.evidences.push(newEvidence);
        workEvidence.evidenceCount++;
    }
    
    function hirerAcceptWork (string memory comment, bool accept) public restrictedhirer{
        require(myStatus==STATUS.EVALUATION, "hirer only accept work when contract is at EVALUATION stage");
        require(workEvidence.evidenceCount>=1,"Please wait at least one evidence before accepting work");
        workEvidence.evidences[workEvidence.evidenceCount-1].hirerComment=comment;
        workEvidence.evidences[workEvidence.evidenceCount-1].hirerAccepted=accept;
        if(accept){
            myStatus = STATUS.ACCEPTED;
        }
    }
    function getEvidenceDescription(uint num) checkEvidenceRange ( num) public view returns ( string memory) {
        return workEvidence.evidences[num].evidenceDes;
    }
    function getEvidenceSubmitDate(uint num) checkEvidenceRange ( num)  public view returns ( uint ){
        return workEvidence.evidences[num].hireeSubmitDate;
    }
    function getEvidenceHirerComment(uint num) checkEvidenceRange ( num)  public view returns ( string memory ){
        return workEvidence.evidences[num].hirerComment;
    }
    function getEvidenceHirerAccepted(uint num) checkEvidenceRange ( num)  public view returns (  bool ){
        return workEvidence.evidences[num].hirerAccepted;
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