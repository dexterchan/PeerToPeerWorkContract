
console.log('Before');
//Promise-based approach
const p = getUserPromise(1)
        .then(user=>getRepositoriesPromise(user.id))
        .then((repo)=>getCommitsPromise(repo[0]))
        .then((commitmsg)=>console.log(commitmsg))
        .catch((err)=>console.log("Error",err));
console.log('After');

async function displayCommits(){
  //async and await approach
  try{
    const user=await getUserPromise(1);
    const repos=await getRepositoriesPromise(user.gitHubUsername);
    const commits = await getCommitsPromise(repos[0]);
    console.log(commits);
  }catch(err){
    console.log("Error",err);
  }
}
displayCommits();
console.log('After async');



function  getUserPromise(id) {
    return new Promise((resolve, reject)=>{
        //async work
        setTimeout(() => {
            console.log('Reading a user from a database...');
            resolve({ id: id, gitHubUsername: 'dex' });
          }, 2000);
    });
}

function  getRepositoriesPromise(username) {
    return new Promise((resolve,reject)=>{
        setTimeout(() => {
            console.log('Calling GitHub Get Repo API...');
            //resolve(['repo1', 'repo2', 'repo3']);
            reject(new Error("failed repo"));
          }, 2000);
    });
}

function getCommitsPromise(repo) {
    return new Promise((resolve,reject)=>{
        setTimeout(() => {
            console.log('Calling GitHub Commit API...');
            resolve(['commit']);
          }, 2000);
    });
  
}

/*
console.log('Before');
getUser(1, (user) => {
  getRepositories(user.gitHubUsername, (repos) => {
    getCommits(repos[0], (commits) => {
      console.log(commits);
    })
  })
});
console.log('After');
*/

function getUser(id, callback) {
    setTimeout(() => {
      console.log('Reading a user from a database...');
      callback({ id: id, gitHubUsername: 'mosh' });
    }, 2000);
  }

  function getRepositories(username, callback) {
    setTimeout(() => {
      console.log('Calling GitHub repo API...');
      callback(['repo1', 'repo2', 'repo3']);
    }, 2000);
  }
  
  function getCommits(repo, callback) {
    setTimeout(() => {
      console.log('Calling GitHub commit API...');
      callback(['commit']);
    }, 2000);
  }
