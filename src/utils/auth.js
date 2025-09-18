const userid = localStorage.getItem('userid');
fetch(`http://localhost:8000/api/user/${userid}/profile`)
  .then(response => response.json())
  .then(data => {
    // Handle the user profile data
  })
  .catch(error => {
    console.error('Error fetching user profile:', error);
  });