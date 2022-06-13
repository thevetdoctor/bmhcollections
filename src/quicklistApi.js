import axios from 'axios';

export const submitQuicklist = async (payload) => {
	const baseUrl = 'https://us-central1-build-myhouse.cloudfunctions.net/bmhAPi';
  // const baseUrl = 'http://localhost:5001/build-myhouse/us-central1/bmhAPi';
  let query;

    const { firstName, lastName, mobile, email } = payload;
    
    query = `
    mutation {
      addContact(
        firstName: "${firstName}",
        lastName: "${lastName}",
        mobile: "${mobile}",
        email: "${email}"
        ) {
          id
          firstName
          lastName
          email
          mobile
        }
      }`;

      
    const headers = {
      'Content-Type': 'application/json'
    }

    const response = {
      message: '',
      error: ''
    };

    try {

      const { data } = await axios.post(`${baseUrl}/graphql?query=${query}`, {}, headers);

      if (data?.errors) {
        response.error = true;
          if(data?.errors[0]?.message.search('exist') >= 0 || data?.errors[0]?.message.search('Not found') >= 0) {
            response.message = "Already submitted!";
          } else {
            response.message = `${data?.errors[0]?.message}`;
          } 
			} else {
        response.message = "Submitted successfully!";
			}
      
    } catch (error) {
      response.error = error.isAxiosError ? error.response?.data?.error : error.message
    }


    return response;
}