const checkUserSetup = async () => {
  try {
    const userid = localStorage.getItem('userId');
    if (!userid) {
      return false;
    }

    const response = await fetch(`http://localhost:8000/api/v1/user/${userid}/setup`);

    if (!response.ok) {
      console.error('Setup check failed:', response.status);
      return false;
    }

    const data = await response.json();
    console.log('Setup status response:', data); // Debug log

    // The backend returns true/false or an error object
    return data === true;
  } catch (error) {
    console.error('Error checking user setup:', error);
    return false; // Default to false to show questionnaire
  }
};

export {checkUserSetup};