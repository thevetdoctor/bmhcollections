import React, { useState } from 'react';
import logo from './bmh-blue-1.png';
import {FaShareAlt, FaMoon, FaCamera} from 'react-icons/fa';
import {IoArrowBack} from 'react-icons/io5';
import { Modal } from 'react-bootstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ArchitectForm() {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [floorPlanTime, setFloorPlanTime] = useState('');
    const [singleResidentialTime, setSingleResidentialTime] = useState('');
    const [projectUrl, setProjectUrl] = useState('');
    const [projectWorkTime, setProjectWorkTime] = useState('');
    const [charge, setCharge] = useState('');
    const [contactMessage, setContactMessage] = useState('');
    const [completed, setCompleted] = useState(null);
    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [profileImage, setProfileImage] = useState('');

    const baseUrl = 'https://us-central1-build-myhouse.cloudfunctions.net/bmhAPi';

    const setUp = async() => {
        setSubmitted(true)
        const payload = {firstName, lastName, mobile, email, profileImage, contactMessage, floorPlanTime, singleResidentialTime, projectUrl, projectWorkTime, charge}
        if((firstName && lastName && mobile && email && profileImage && contactMessage && floorPlanTime && singleResidentialTime && projectUrl && projectWorkTime && charge)) {
            setCompleted(false);
            console.log('Incomplete details')
            console.log(payload);
            return;
        }
        setCompleted(true);

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
            
            const res = await axios({
                method: 'POST',
                url: `${baseUrl}/graphql?query=${query}`,
                headers: {
                    'Content-Type': 'application/json'
            }
            })
            .catch(error => {
                if(error.isAxiosError) {
                    setError(error.response?.data?.error);
                }
            });
            if(res && res.data) {
               console.log(res.data.errors)
               if(res.data.errors[0].message.search('exist') >= 0) {
                   toast("Already submitted!");
               } else {
                   toast("Submitted successfully!");
                }
                setFirstName('');
                setLastName('');
                setMobile('');
                setEmail('');
                setFloorPlanTime('');
                setSingleResidentialTime('');
                setProjectUrl('');
                setProjectWorkTime('');
                setCharge('');
                setContactMessage('');
                document.location.reload();
               setCompleted(true);
            } else {
                console.log(error);
                toast('Please check your network');
            }
        };

        const handleImage = async(e) => {
            
        const serviceImage = e.target.files[0];
        const data = new FormData();
        const url = "https://api.cloudinary.com/v1_1/thevetdoctor/image/upload";
        data.append("file", serviceImage);
        data.append("upload_preset", "zunt8yrw");
        const res = await fetch(url, {
              method: "POST",
              body: data
            })
            .catch(error => {
                console.log(error.message);
                if(error.message.search('Failed to fetch') >= 0) {
                    toast("Image upload failed!");
                }
            });
            // console.log(res)
            if(res) {
                console.log(res)
            } else {
                console.log('error');
            }
            const imgLink = await res.json();
            // console.log(profileImage, imgLink.secure_url);
            setProfileImage(imgLink.secure_url)
        }
        
        const handleChange = (e) => {
            const target = e.target;
            console.log(target, target.value)
            if(target.name === 'firstname') {
                setFirstName(target.value);
            } else if(target.name === 'lastname') {
                setLastName(target.value);
            } else if(target.name === 'mobile') {
                setMobile(target.value);
            } else if(target.name === 'email') {
                setEmail(target.value);
            } else if(target.name === 'floorplantime') {
                setFloorPlanTime(target.value);
            } else if(target.name === 'singleresidentialtime') {
                setSingleResidentialTime(target.value);
        } else if(target.name === 'projecturl') {
            setProjectUrl(target.value);
        } else if(target.name === 'projectworktime') {
            setProjectWorkTime(target.value);
        } else if(target.name === 'charge') {
            setCharge(target.value);
        } else if(target.name === 'contactmessage') {
            setContactMessage(target.value);
        }
    };
    
    return (
        <div>
      <div style={{fontSize: "0.5em"}} className="bg-white">
          {/* <DisplayModal /> */}
          <ToastContainer />

          {/* <div>
          Your submission was successful..A member of BMH would get back to you soon

          </div> */}
          <div className='flex justify-between m-4'>
                <div><img src={logo} style={{width: '5em', marginTop: '1.1em'}} alt='alt' /></div>
                <div className='flex mt-3 mr-3'>
                    <span style={{borderRadius: '50%'}} className='hover:bg-gray-200 cursor-pointer flex align-center shadow-lg p-3 border'>
                      <span className=''><FaShareAlt size={15} /></span>
                    </span>
                    <span style={{borderRadius: '50%'}} className='hover:bg-gray-200 cursor-pointer ml-2 shadow-lg p-3 border'>
                        <span className='mt-2'><FaMoon size={13} /></span>
                    </span>
                  <span style={{borderRadius: '50%'}} className='hover:bg-gray-200 cursor-pointer ml-2 shadow-lg p-3 border'>
                      <span className='mt-2'><IoArrowBack size={18} /></span>
                    </span>
                </div>
          </div>
            <form action="" method="post" style={{fontSize: "1.2em"}} className="text-md flex flex-col p-2 mb-1" id="contactForm">
                    <input type="text" id="ProfilePic" style={{display: "none"}} />
                    <div className="text-md flex flex-col p-2">
                        <label className="text-md flex justify-between p-2 py-3 mb-0"><span>Kindly state your Firstname (so we might have it displayed on the app)</span><Required /></label>
                        <Input name="firstname" firstName={firstName} handleChange={handleChange} />
                    </div>
                    <div className="text-md flex flex-col p-2">
                        <label className="text-md flex justify-between p-2 mb-1"><span>Kindly state your Lastname</span>
                        <Required /></label>
                        <Input name="lastname" lastName={lastName} handleChange={handleChange} />
                    </div>
                    <div className="text-md flex flex-col p-2">
                        <label className="text-md flex justify-between p-2 mb-1">Kindly provide your Mobile (so we might
                            easily contact you)<Required /></label>
                        <Input name="mobile" mobile={mobile} handleChange={handleChange} />
                    </div>
                    <div className="text-md flex flex-col p-2">
                        <label className="text-md flex justify-between p-2 mb-1">Kindly provide your Email
                        <Required /></label>
                        <Input name="email" email={email} handleChange={handleChange} />
                    </div>
                    <div className="text-md flex flex-col p-2">
                        <label className="text-md flex justify-between p-2 mb-1">Kindly attach an image of yourself
                        <Required /></label>
                        <label style={{width: '6em', fontSize: '1.1em'}} className={`font-bold cursor-pointer flex border border-2 ml-2 rounded-lg ${profileImage ? 'bg-white text-black' : 'bg-black text-white'}`}><span className='p-2 pr-3'>{profileImage ? 'Uploaded' : 'Upload'} </span> <span className='ml-2'></span>
                        
                        <input type="file" style={{fontSize: '1.4em'}} className="text-md hidden outline-none rounded" placeholder={profileImage ? profileImage : 'No file chosen'} value="" onChange={(e) => handleImage(e)} accept="image/*;capture" /></label>
                    </div>
                    <div className="text-md flex flex-col p-2">
                        <label style={{fontSize: '1.4em'}} className="">How would you describe yourself (kindly highlight your work strengths and weakness and how you want customers to view you)</label>
                        <textarea name="contactmessage" style={{fontSize: '0.9em', height: '10em'}} className="rounded outline-none p-3 focus:border focus:border-gray-500" value={contactMessage} onChange={handleChange}
                        ></textarea>
                    </div>
                    <div className="text-md flex flex-col p-2">
                        <label className="text-md flex justify-betweenp-2 mb-1">Hypothetically speaking, how long would it take to finish a floor plan ( this gives us and the client an idea of how long to expect deliverables) (Architect,interior designer)<Required /></label>
                        <Input name="floorplantime" floorPlanTime={floorPlanTime} handleChange={handleChange} />
                    </div>
                    <div className="text-md flex flex-col p-2">
                        <label className="text-md flex justify-between p-2 mb-1">How much time do you think it will take to
                            accomplish a single residential property ( this helps us to know what the client
                            expects as far as speed is concerned?<Required /></label>
                        <Input name="singleresidentialtime" singleResidentialTime={singleResidentialTime} handleChange={handleChange} />
                    </div>
                    <div className="text-md flex flex-col p-2">
                        <label className="text-md flex flex-col p-2 mb-1">Kindly attach a link to images of at most
                            10 best Jobs ( preferably un-watermarked, kindly note that each job, should have
                            different views, to give the client a detailed perspective of each job)</label>

                        <label className="text-md flex justify-between p-2">Instructions for image upload : Attach each
                            render/job in one folder, and do the same for other jobs, label each folder
                            according to the job e.g render for ikoyi palace, then place each folder into a
                            singular link ( which means it could get up to 10 folders in one link ) and attach
                            to the form<Required /></label>
                        <Input name="projecturl" projectUrl={projectUrl} handleChange={handleChange} />
                    </div>
                    <div className="text-md flex flex-col p-2">
                        <label className="text-md flex justify-between p-2 mb-1">How much time will you need to work on a
                            project to see results? ( this helps us know how to place deadlines, and how to
                            follow up on the job ).<Required /></label>
                        <Input name="projectworktime" projectWorkTime={projectWorkTime} handleChange={handleChange} />
                    </div>
                    <div className="text-md flex flex-col p-2">
                        <label className="text-md flex justify-between p-2 mb-1">How much do you charge per render i.e
                            (25,000 to 30,000).</label>
                        <Input name="charge" charge={charge} handleChange={handleChange} submitted={submitted} />
                    </div>
                    <br />
                    <div className="">
                        <div style={{fontSize: '1.5em'}} className='text-center text-md text-red-600 mb-2'>{(!completed && submitted) && "Please fill in all fields !"}</div>
                        <div style={{fontSize: '1.5em'}} className="text-white bg-black text-center mx-3 rounded p-2 hover:bg-gray-500 cursor-pointer mb-9 rounded-lg shadow-md contactSubmitButton" onClick={setUp}>Submit</div>
                    </div>
            </form>
        </div>
    </div>
  )
}

const Required = () => (
    <span style={{fontSize: '0.6em'}} className='text-xs text-gray-400 mb-1'>(required)</span>
    )
    
    const Input = ({name, value, submitted, handleChange}) => (
        <input type="text" name={name} value={value} onChange={handleChange} style={{fontSize: '1.5em'}} className={`focus-none focus:border focus:border-gray-500 outline-none rounded-lg border p-3 -mt-2 ${(submitted && value === '') && 'border-red-500'}`} />
        )
        
        
const DisplayModal = () => (
        <div>
        <Modal
            show='true'
            // onHide={() => handleShow()}
            dialogClassName="modal-90w"
            style={{top: '10%', bottom: '0', height: '10em'}}
            className=""
            size="lg">
            <Modal.Header style={{fontWeight: 'bold'}}>
                Successful
            </Modal.Header>
            <Modal.Body style={{textAlign: 'justify', width: '50%'}} className='pt-0 p-2'>
                
              <div className='card-text'>
              Your submission was successful..A member of BMH would get back to you soon
              </div>
            </Modal.Body>
        </Modal>
        </div>
    )
    


                // const query = `{
                //     architectprofiles{
                //         firstName, 
                //         lastName,
                //         email,
                //         mobile,
                //         description,
                //         profileImage,
                //         projectUrl,
                //         floorPlanTime,
                //         singleResidentialTime,
                //         projectWorkTime,
                //         charge
                //     }
                // }`;