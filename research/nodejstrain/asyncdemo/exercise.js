/*
getCustomer(1, (customer) => {
  console.log('Customer: ', customer);
  if (customer.isGold) {
    getTopMovies((movies) => {
      console.log('Top movies: ', movies);
      sendEmail(customer.email, movies, () => {
        console.log('Email sent...')
      });
    });
  }
});
*/

async function notifyMovieUsecase(){
  const cust=await getCustomer(1);
  console.log('Customer: ', cust);
  if (cust.isGold) {
    const topMovies = await getTopMovies();
    console.log('Top movies: ', topMovies);
    const status = await sendEmail(cust.email,topMovies);
    console.log('Email sent... status:',status);
  }
}
notifyMovieUsecase();


function getCustomer(id) {
  return new Promise((resolve, reject)=>{
    setTimeout(() => {
      resolve({ 
        id: 1, 
        name: 'Mosh Hamedani', 
        isGold: true, 
        email: 'email' 
      });
    }, 4000);  
  });
  
}

function getTopMovies() {
  return new Promise((resolve, reject)=>{
    setTimeout(() => {
      resolve(['movie1', 'movie2']);
    }, 4000);
    }
  );
}

function sendEmail(email, movies) {
  return new Promise((resolve, reject)=>{
    setTimeout(() => {
      resolve("email sent");
    }, 4000);
  }
  );
}