export const httpGetSingleUser = async (userId) => {
    try {
        const response = await fetch(`/api/user/${userId}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
};

export const httpGetUsers = async (queryParams = {}) => {
    try {
      // Construct query string from queryParams object
      const queryString = new URLSearchParams(queryParams).toString();
      
      // Make an HTTP GET request to fetch users data with the constructed query string
      const response = await fetch(`/api/user/?${queryString}`);
  
      // Check if the response status is OK (200)
      if (!response.ok) {
        // If response status is not OK, throw an error with the status text
        throw new Error(`Error: ${response.statusText}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error fetching users data:', error);
      throw error;
    }
  };

  export const httpDeleteUser = async (userId) => {
    try {
      // Make an HTTP DELETE request to delete the user account
      const response = await fetch(`/api/user/delete/${userId}`, {
        method: 'DELETE',
      });
  
      // Check if the response status is OK (200)
      if (!response.ok) {
        // If response status is not OK, throw an error with the status text
        throw new Error(`Error: ${response.statusText}`);
      }
  
      // Parse the response body as text
      const message = await response.text();
      return message;
    } catch (error) {
      console.error('Error deleting user account:', error);
      throw error;
    }
  };

  export const httpUpdateUser = async (requestedUserId, userData) => {
    try {
      const response = await fetch(`/api/user/update/${requestedUserId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
  
      // Check if the response status is OK (200)
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
  
      const updatedUserData = await response.json();
      return updatedUserData;
    } catch (error) {
      console.error('Error updating user data:', error);
      throw error;
    }
  };
  
  
  