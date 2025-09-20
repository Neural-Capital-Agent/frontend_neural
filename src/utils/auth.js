const userid = localStorage.getItem('userId');
const checkUserSetup = async () => {
  const response = await fetch(`http://localhost:8000/api/v1/user/${userid}/setup`);
  const data = await response.json();
  return data === true;
};

export {checkUserSetup};