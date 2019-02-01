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
    mapping (address=>uint) public postProcessedMap;
    
    constructor() public{
        myManager=msg.sender;
    }
    function createProject(string memory _task_des, uint _reward,int _minCredit, string memory _duration) public returns(Peer2PeerProject){
        require( memberMap[msg.sender]>0,"Only member can create project");
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
    
    function getMember (address m ) public view returns (uint){
        uint inx = memberMap[m];
        require(inx>0,"Not found the member");
        return inx-1;
    }
    
    function getMemberName(address m) public view returns (string memory){
        uint inx = getMember(m);
        if(inx==0){
            return " ";
        }
        Member memory m = memberList[inx];
        
        return m.name;
    }
    
    function getMemberCredit(address m) public view returns (int ){
        uint inx =getMember(m);
        if(inx==0){
            return 0;
        }
        Member memory m = memberList[inx];
        
        return m.credit;
    }
    
    function updateMemberCredit(address m, int creditChange) public restrictedmgr returns (int ) {
        uint inx = getMember(m);
        Member storage m = memberList[inx];
        
        return m.credit+=creditChange;
        
    }
    /*
    dangerous code, will crash the EVM at p.getReward()
    function testPostProcess() public restrictedmgr{
        //Test post process to grant credit back to hier/hiree
        Peer2PeerProject p=Peer2PeerProject(deployedProjects[0]);
        
        int r = int(p.getReward());
        address h = p.getHirer();
        uint inx = getMember(h);
        Member storage m = memberList[inx];
        
        m.credit+=r;
        
        postProcessedMap[address(p)]=now;
    }*/
   
}

contract Peer2PeerProject{
    struct WorkLog {
            string logDes;
            uint hireeSubmitDate;
            
            string hirerComment;
            bool hirerAccepted;
            bool hirerRejected;
    }
    
    
    bool public workAccepted;
    
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
    
    WorkLog[] public workLogs;
    
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
        workAccepted=false;
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
    modifier checkWorkLogRange(uint num){
        require(workLogs.length>num && num>=0,"Work log out of range");
        _;
    }
    
    function hireeSubmitWork (string memory myWorkEvidence) public restrictedhiree{
        require(myStatus==STATUS.EXECUTION || myStatus==STATUS.EVALUATION,"hiree only submit work when contract is at EXECUTION/EVALUATION stage");
        require(!workAccepted,"only submit work when work not yet accepted");
        myStatus = STATUS.EVALUATION;
        
        WorkLog memory newEvidence =  WorkLog({
               logDes:myWorkEvidence,
               hireeSubmitDate:now,
               hirerComment:"",
               hirerAccepted:false,
               hirerRejected:false
            });
            
        
        workLogs.push(newEvidence);
        
    }
    
    function hirerAcceptWork (string memory comment, bool accept,bool reject) public restrictedhirer{
        require(myStatus==STATUS.EVALUATION, "hirer only accept work when contract is at EVALUATION stage");
        require(workLogs.length>=1,"Please wait at least one evidence before accepting work");
        require(!workAccepted,"only accept work when work not yet accepted");
        workLogs[workLogs.length-1].hirerComment=comment;
        workLogs[workLogs.length-1].hirerAccepted=accept;
        workLogs[workLogs.length-1].hirerRejected=reject;
        
        if(accept && !reject){
            myStatus = STATUS.ACCEPTED;
            workAccepted=accept;
        }
        
    }
    function getWorkLogCount() public view returns(uint){
        return workLogs.length;
    }
    function getLogDescription(uint num) checkWorkLogRange ( num) public view returns ( string memory) {
        return workLogs[num].logDes;
    }
    function getWorkLogSubmitDate(uint num) checkWorkLogRange ( num)  public view returns ( uint ){
        return workLogs[num].hireeSubmitDate;
    }
    function getWorkLogHirerComment(uint num) checkWorkLogRange ( num)  public view returns ( string memory ){
        return workLogs[num].hirerComment;
    }
    function getWorkLogHirerAccepted(uint num) checkWorkLogRange ( num)  public view returns (  bool ){
        return workLogs[num].hirerAccepted;
    }
    function getWorkLogHirerRejected(uint num) checkWorkLogRange ( num)  public view returns (  bool ){
        return workLogs[num].hirerRejected;
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
    function getMember(address a) public view returns (uint){
       //uint  m = dashBoard.getMemberMap(a);
        return dashBoard.getMember(a);
    }
    
    function getReward()public view returns (uint){
        return reward;
    }
    function getHirer()public view returns(address){
        return hirer;
    }
    function getWorkContractSummary() public view returns (
        uint,
        address,string memory,
        address,string memory,
        string memory,
        uint ,
        string memory,
        uint,
        uint
    )
    {
        string memory hirerName= dashBoard.getMemberName(hirer);
        string memory hireeName = dashBoard.getMemberName(hiree);
        return(
            projectid,
            hirer,hirerName,
            hiree,hireeName,
            task_description,
            reward,
            duration,
            creationDate,
            executionDate
        );
    }
}