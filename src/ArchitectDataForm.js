/* eslint-disable no-unused-vars*/
import 'react-toastify/dist/ReactToastify.css';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaShareAlt, FaMoon, FaCamera } from 'react-icons/fa';
import { IoArrowBack } from 'react-icons/io5';
import { Modal } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { submitInfo, uploadImage } from './api';
import logo from './bmh-blue-1.png';

export default function ArchitectDataForm ({ onCompleted }) {

	const [firstName, setFirstName] = useState('');
	const [email, setEmail] = useState('');
	const [charge, setCharge] = useState('');
	const [projectTitle, setProjectTitle] = useState('');
	const [resumeUrl, setResumeUrl] = useState('https://res.cloudinary.com/thevetdoctor/image/upload/v1649205554/bmh_architects/buqjtjdzmhtoo3nzmxum.pdf');
	const [profileImage, setProfileImage] = useState('https://res.cloudinary.com/thevetdoctor/image/upload/v1649205562/bmh_architects/x2t69oqb6u3awebtftbn.png');
	const [projectImage, setProjectImage] = useState('https://res.cloudinary.com/thevetdoctor/image/upload/v1649205566/bmh_architects/ixxqh9s8w26cfrgxc9bv.png');
	const [isSubmitting, setSubmitting] = useState(false);
	const [completed, setCompleted] = useState(null);
	const [error, setError] = useState('');
	const [submitted, setSubmitted] = useState(false);

	let { dyno } = useParams();

	useEffect(() => {
		let data = dyno.split('&');
		let name = data[1]?.split('=')[1];
		setFirstName(`${name[0].toUpperCase()}${name.substring(1)}`);
		setEmail(data[0]?.split('=')[1]);
	}, [dyno]);

	const setUp = async (e) => {
		e.preventDefault();

		if(!profileImage.length || !projectImage.length || !resumeUrl.length){
			toast.error('Please upload all required images/files');
			return;
		}

		const fields = [ email, profileImage, projectImage, projectTitle, resumeUrl, charge];

		const hasInvalidField = fields.some(field => !field.length);

		console.log(fields);
		if (hasInvalidField) {
			toast.error('Please enter all fields');
			return;
		}

		setSubmitting(true);
	
		const payload = { email, profileImage, projectImage, projectTitle, resumeUrl, charge };

		const response = await submitInfo(payload, true);
		setSubmitting(false);

		if(response.error){
			toast.error(error);
			return;
		}

		toast.success(response.message);
		onCompleted();
	};

	const handleImage = async (e) => {
		const serviceImage = e.target.files[0];
		const response = await uploadImage(serviceImage);

		if(response.error){
			toast.error(response.error);
			return;
		}
		if (e.target.name === 'projectImage') {
			setProjectImage(response?.data?.secure_url || '');
		} else if (e.target.name === 'resumeUrl') {
			setResumeUrl(response?.data?.secure_url || '');
		} else if (e.target.name === 'profileImage') {
			setProfileImage(response?.data?.secure_url || '');
		}
	}

	const handleChange = (e) => {
		const target = e.target;
	 	if (target.name === 'projectTitle') {
			setProjectTitle(target.value);
		} else if (target.name === 'charge') {
			setCharge(target.value);
		}
	};



	return (
		<div>
			<div style={{ fontSize: "0.5em" }} className="bg-white">
				<ToastContainer />
				<div className='flex justify-between m-4'>
					<div><img src={logo} style={{ width: '5em', marginTop: '1.1em' }} alt='alt' /></div>
					<div className='flex mt-3 mr-3'>
						<span style={{ borderRadius: '50%' }} className='hover:bg-gray-200 cursor-pointer flex align-center shadow-lg p-3 border'>
							<span className=''><FaShareAlt size={15} /></span>
						</span>
						<span style={{ borderRadius: '50%' }} className='hover:bg-gray-200 cursor-pointer ml-2 shadow-lg p-3 border'>
							<span className='mt-2'><FaMoon size={13} /></span>
						</span>
						<span style={{ borderRadius: '50%' }} className='hover:bg-gray-200 cursor-pointer ml-2 shadow-lg p-3 border'>
							<span className='mt-2'><IoArrowBack size={18} /></span>
						</span>
					</div>
				</div>
				<div className="text-lg text-center px-4 font-semibold mt-8">Welcome back {firstName}! </div>

				<form style={{ fontSize: "1.2em" }} className="text-md flex flex-col p-2 mb-1 md:w-1/2 mx-auto" id="contactForm">
			
					<div className="text-md flex flex-col p-2">
						<label className="text-md flex justify-between py-2 mb-1">
							<span>
							Kindly upload your resume
							<span className={`flex justify-center mt-1 p-1 rounded cursor-pointer ${resumeUrl ? 'bg-gray-200 text-black' : 'bg-black text-white'}`}>{resumeUrl ? 'Uploaded' : 'Upload'}</span> 
							<input 
								type="file"
								name="resumeUrl"
								style={{ fontSize: '1em' }} 
								className="rounded hidden" 
								placeholder={resumeUrl ? resumeUrl : 'No file chosen'} 
								value="" onChange={(e) => handleImage(e)} 
								accept="*/*;capture" 
								/>
							</span>
							<Required />
						</label>
					</div>
					<div className="text-md flex flex-col p-2">
						<label className="text-md flex justify-between py-2 mb-1">
							<span>
							Kindly attach an image of yourself
							<span className={`flex justify-center mt-1 p-1 rounded cursor-pointer ${profileImage ? 'bg-gray-200 text-black' : 'bg-black text-white'}`}>{profileImage ? 'Uploaded' : 'Upload'}</span> 
							<input 
								type="file"
								name="profileImage"
								style={{ fontSize: '1em' }} 
								className="rounded hidden" 
								placeholder={profileImage ? profileImage : 'No file chosen'} 
								value="" onChange={(e) => handleImage(e)} 
								accept="image/*;capture" 
								/>
							</span>
							<Required />
						</label>
					</div>
					
					<div className="text-lgflex flex-col p-2">
						<div style={{fontSize: '1.3em'}} className='mb-3'>Upload images for your projects (max. 30)</div>
						<Input name="projectTitle" projectTitle={projectTitle} placeholder="Enter Project Title" handleChange={handleChange} submitted={submitted} />
						<label className="text-md flex justify-between py-2 mb-1">
							<span>
							<span className={`flex justify-center mt-1 p-3 rounded cursor-pointer ${projectImage ? 'bg-gray-200 text-black' : 'bg-black text-white'}`}>{projectImage ? 'Uploaded' : 'Upload Images'}</span> 
							<input 
								type="file"
								name="projectImage"
								style={{ fontSize: '1em' }} 
								className="rounded hidden" 
								placeholder={projectImage ? projectImage : 'No file chosen'} 
								value="" onChange={(e) => handleImage(e)} 
								accept="image/*;capture" 
								/>
							</span>
							<Required />
						</label>
					</div>

					<div className="text-md flex flex-col p-2">
						<label className="text-md flex justify-between p-2 mb-1">How much do you charge per render i.e
							(25,000 to 30,000).</label>
						<Input name="charge" charge={charge} handleChange={handleChange} submitted={submitted} />
					</div>
					<br />
					<div className="flex">
						<button
							className="text-white text-base w-full bg-black text-center mx-3 rounded p-2 hover:bg-gray-800 disabled:bg-gray-500 cursor-pointer mb-9 rounded-lg shadow-md contactSubmitButton"
							onClick={setUp}
							disabled={isSubmitting}
						>{ isSubmitting ? 'Submitting' : 'Submit' }</button>
					</div>
				</form>
			</div>
		</div>
	)
}

const Required = () => (
	<span style={{ fontSize: '0.6em' }} className='text-xs text-gray-400 mb-1'>(required)</span>
)

const Input = ({ name, value, submitted, handleChange, placeholder }) => (
	<input 
		type="text" 
		name={name} 
		value={value} 
		onChange={handleChange} 
		style={{ fontSize: '1.5em' }}
		placeholder={placeholder}
		className={`focus-none focus:border focus:border-gray-500 outline-none rounded-lg border p-3 -mt-2 ${(submitted && value === '') && 'border-red-500'}`} />
)

const DisplayModal = () => (
	<div>
		<Modal
			show='true'
			// onHide={() => handleShow()}
			dialogClassName="modal-90w"
			style={{ top: '10%', bottom: '0', height: '10em' }}
			className=""
			size="lg">
			<Modal.Header style={{ fontWeight: 'bold' }}>
				Successful
			</Modal.Header>
			<Modal.Body style={{ textAlign: 'justify', width: '50%' }} className='pt-0 p-2'>

				<div className='card-text'>
					Your submission was successful..A member of BMH would get back to you soon
				</div>
			</Modal.Body>
		</Modal>
	</div>
)