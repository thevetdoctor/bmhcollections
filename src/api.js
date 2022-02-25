import axios from 'axios';

export const submitInfo = async (payload) => {
	const baseUrl = 'https://us-central1-build-myhouse.cloudfunctions.net/bmhAPi';

  const { firstName, lastName, mobile, email, profileImage, contactMessage, floorPlanTime, singleResidentialTime, projectUrl, projectWorkTime, charge } = payload;

  const query = `
    mutation {
        createArchitectProfile(
            firstname: "${firstName}",
            lastname: "${lastName}",
            mobile: "${mobile}",
            email: "${email}",
            description: "${contactMessage}",
            profileImage: "${profileImage}",
            projectUrl: "${projectUrl}",
            floorPlanTime: "${floorPlanTime}",
            singleResidentialTime: "${singleResidentialTime}",
            projectWorkTime: "${projectWorkTime}",
            charge: "${charge}"
        ) {
            id
            firstName
            lastName
            email
            mobile
            description
            profileImage
            projectUrl
            floorPlanTime
            singleResidentialTime
            projectWorkTime
            charge
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

      if (data?.errors && (data?.errors[0]?.message.search('exist')) >= 0) {
				response.message = "Already submitted!";
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
  const url = "https://api.cloudinary.com/v1_1/thevetdoctor/image/upload";
  
  data.append("file", image);
  data.append("upload_preset", "zunt8yrw");

  try {
		const res = await fetch(url, {
			method: "POST",
			body: data
		})

    const uploadedImageData = await res.json();
    response.data = uploadedImageData;

  } catch (error) {
    response.error = "Image upload failed!";
  }

  return response;
}