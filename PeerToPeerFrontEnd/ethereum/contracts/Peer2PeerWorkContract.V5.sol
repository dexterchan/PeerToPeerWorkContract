pragma solidity >=0.4.22 <0.6.0;

contract Peer2PeerProjectDashBoard{
    struct Member{
        address member_address;
        string name;
        int credit;
    }
    
    Peer2PeerProject[] public deployedProjects;
    Member[] public memberList;
    address public myManager;
    mapping (address=>uint) public memberMap;
    
    constructor() public{
        myManager=msg.sender;
    }
    function createProject(string memory _task_des, uint _reward,int _minCredit, string memory _duration) public returns(Peer2PeerProject){
        Peer2PeerProject  newProject=new Peer2PeerProject(this,msg.sender,_task_des, _reward, _minCredit,   _duration);
        deployedProjects.push(newProject);
        return newProject;
    }
    
    function getDeployedProjects() public view returns (Peer2PeerProject[] memory){
        return deployedProjects;
    }
    
    function addMember(address  _myaddress, string memory _name, int _credit) public restrictedmgr{
        require(memberMap[_myaddress]==0," has been registered once");
        Member memory m = Member(
           {
               member_address:_myaddress,
               name:_name,
               credit:_credit
           } 
        );
        
        memberList.push(m);
        uint inx = memberList.length;
        memberMap[_myaddress]=inx;
    }
    modifier restrictedmgr(){
        require(msg.sender==myManager,"Only manager can access");
        _;
    }
    
    function getMember (address m ) internal view returns (uint){
        uint inx = memberMap[m];
        require(inx>0,"Not found the member");
        return inx-1;
    }
    
    function getMemberName(address m) public view returns (string memory){
        uint inx = getMember(m);
        Member memory m = memberList[inx];
        
        return m.name;
    }
    
    function getMemberCredit(address m) public view returns (int ){
        uint inx =getMember(m);
        Member memory m = memberList[inx];
        
        return m.credit;
    }
    
    function updateMemberCredit(address m, int creditChange) public restrictedmgr returns (int ) {
        uint inx = getMember(m);
        Member storage m = memberList[inx];
        
        return m.credit+=creditChange;
    }
   
}

contract Peer2PeerProject{
    struct Evidence {
            string evidenceDes;
            uint hireeSubmitDate;
            
            string hirerComment;
            bool hirerAccepted;
            bool hirerRejected;
    }
    struct WorkEvidenceClass{
        Evidence[] evidences;
        //uint evidenceCount;
        bool accepted;
    }
    enum STATUS { NEW, PROCUREMENT, EXECUTION, EVALUATION,ACCEPTED, PAYMENT, CLOSE }
    
    STATUS public myStatus;
    
    address public hirer;
    address public hiree;
    uint public projectid;
    string public task_description;
    
    uint public reward;
    
    int public minCreditScore;
    string public duration;
    string public hirerEncryptedCashOrder;
    
    string public hireeEncryptedCashOrder;
    
    uint public creationDate;
    uint public executionDate;
    
    Peer2PeerProjectDashBoard dashBoard;
    
    
    WorkEvidenceClass public workEvidence;
    
    constructor (Peer2PeerProjectDashBoard _dashBoard, address _hirer, string memory _task_des, uint _reward,int _minCredit, string memory _duration) public{
        dashBoard=_dashBoard;
        hirer=_hirer;
        
        task_description=_task_des;
        
        reward=_reward;
        
        minCreditScore=_minCredit;
        duration=_duration;
        myStatus = STATUS.NEW;
        projectid=uint( keccak256(abi.encode(block.difficulty,now,hirer,task_description,reward,minCreditScore,duration)));//keccak256 eqv
        creationDate=now;
        workEvidence.accepted=false;
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
        require(workEvidence.evidences.length>num && num>=0,"Evidence out of range");
        _;
    }
    
    function hireeSubmitWork (string memory myWorkEvidence) public restrictedhiree{
        require(myStatus==STATUS.EXECUTION || myStatus==STATUS.EVALUATION,"hiree only submit work when contract is at EXECUTION/EVALUATION stage");
        require(!workEvidence.accepted,"only submit work when work not yet accepted");
        myStatus = STATUS.EVALUATION;
        
        Evidence memory newEvidence =  Evidence({
               evidenceDes:myWorkEvidence,
               hireeSubmitDate:now,
               hirerComment:"",
               hirerAccepted:false,
               hirerRejected:false
            });
            
        workEvidence.evidences.push(newEvidence);
        
    }
    
    function hirerAcceptWork (string memory comment, bool accept,bool reject) public restrictedhirer{
        require(myStatus==STATUS.EVALUATION, "hirer only accept work when contract is at EVALUATION stage");
        require(workEvidence.evidences.length>=1,"Please wait at least one evidence before accepting work");
        require(!workEvidence.accepted,"only accept work when work not yet accepted");
        workEvidence.evidences[workEvidence.evidences.length-1].hirerComment=comment;
        workEvidence.evidences[workEvidence.evidences.length-1].hirerAccepted=accept;
        workEvidence.evidences[workEvidence.evidences.length-1].hirerRejected=reject;
        
        if(accept && !reject){
            myStatus = STATUS.ACCEPTED;
            workEvidence.accepted=accept;
        }
        
    }
    function getEvidenceCount() public view returns(uint){
        return workEvidence.evidences.length;
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
    function getEvidenceHirerRejected(uint num) checkEvidenceRange ( num)  public view returns (  bool ){
        return workEvidence.evidences[num].hirerRejected;
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
    function getMemberName(address a) public view returns (string memory){
       //uint  m = dashBoard.getMemberMap(a);
        return dashBoard.getMemberName(a);
    }
}