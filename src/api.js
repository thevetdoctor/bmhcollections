import axios from 'axios';

export const submitInfo = async (payload, update = false) => {
	const baseUrl = 'https://us-central1-build-myhouse.cloudfunctions.net/bmhAPi';
  let query;

  if(update) {
		let storedImages = JSON.parse(localStorage.getItem('projectImages'));
    let projectTitle = storedImages.map(image => image.name).join(':');
    let projectImage = storedImages.map(image => image.url.replace('bmh_architects/', '')).join(':');

    const { email, profileImage, resumeUrl, charge } = payload;
  query = `
    mutation {
        updateArchitectProfile(
            email: "${email}",
            profileImage: "${profileImage}",
            projectTitle: "${projectTitle}",
            projectImage: "${projectImage}",
            resumeUrl: "${resumeUrl}",
            charge: "${charge}"
        ) {
            id
            firstName
            lastName
            email
            mobile,
            profileImage,
            projectTitle,
            projectImage,
            resumeUrl,
            charge
        }
    }`;

  } else {

    const { firstName, lastName, mobile, email } = payload;
    
    query = `
    mutation {
      createArchitectProfile(
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
}
      
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

export const uploadImage = async (image) => {
  const response = {
    data: null,
    error: ''
  }

  const data = new FormData();
  const url = "https://api.cloudinary.com/v1_1/thevetdoctor/auto/upload";
  
  data.append("file", image);
  data.append("upload_preset", "ugypxmkm");

  try {
		const res = await fetch(url, {
			method: "POST",
			body: data
		})

    const uploadedImageData = await res.json();
    response.data = uploadedImageData;

  } catch (error) {
    response.error = "Upload failed!";
  }

  return response;
}