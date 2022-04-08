/* eslint-disable no-unused-vars*/
import 'react-toastify/dist/ReactToastify.css';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaShareAlt, FaCamera } from 'react-icons/fa';
import {InfinitySpin, Rings} from "react-loader-spinner";
import { AiFillDelete } from 'react-icons/ai';
import { ImFilePdf } from 'react-icons/im';
import { TiTick } from 'react-icons/ti';
import { Modal } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { submitInfo, uploadImage } from './api';
import logo from './bmh-blue-1.png';
import { DUMMY_DATA } from './helpers';

export default function ArchitectDataForm ({ onCompleted }) {

	const imgs = localStorage.getItem('projectImages') ? JSON.parse(localStorage.getItem('projectImages')) : [];
	const [firstName, setFirstName] = useState('');
	const [email, setEmail] = useState('');
	const [charge, setCharge] = useState('');
	const [projectTitle, setProjectTitle] = useState('');
	const [resumeUrl, setResumeUrl] = useState('');
	const [profileImage, setProfileImage] = useState('');
	const [projectImage, setProjectImage] = useState('');
	const [projectImageLoading, setProjectImageLoading] = useState(false);
	const [projectImages, setProjectImages] = useState(imgs || []);
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

		if(!profileImage.length || !resumeUrl.length){
			toast.error('Please upload all required images/files');
			return;
		}

		const fields = [ email, profileImage, resumeUrl, charge];

		const hasInvalidField = fields.some(field => !field.length);

		if (hasInvalidField) {
			toast.error('Please enter all fields');
			return;
		}
		if (projectImages.length < 1) {
			toast.error('Please upload a few images of your projects');
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
		if (e.target.name === 'projectImage' && projectTitle.length < 1) {
			toast.error('Please enter a title for your project/image');
			return;
		}
		if(e.target.name === 'projectImage') {
			setProjectImageLoading(true);
		}
		const serviceImage = e.target.files[0];
		const response = await uploadImage(serviceImage);

		if(e.target.name === 'projectImage') {
			setProjectImageLoading(false);
		}

		if(response.error){
			toast.error(response.error);
			return;
		}
		if (e.target.name === 'resumeUrl') {
			setResumeUrl(response?.data?.secure_url || '');
		} else if (e.target.name === 'profileImage') {
			setProfileImage(response?.data?.secure_url || '');
		} else if (e.target.name === 'projectImage') {
			// TODO: Replace public_id with secure_url when missing codebase is recovered
			let publicId = response?.data?.public_id;
			if(localStorage.getItem('projectImages')) {
				let storedImages = JSON.parse(localStorage.getItem('projectImages'));
				localStorage.setItem('projectImages', JSON.stringify([...storedImages, {name: projectTitle, url: publicId}]));
				setProjectImages([...storedImages, {name: projectTitle, url: publicId}]);
			} else {
				localStorage.setItem('projectImages', JSON.stringify([{name: projectTitle, url: publicId}]));
				setProjectImages([{name: projectTitle, url: publicId}]);
			}
			setProjectTitle('');
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

	const removeImage = (imgId) => {
		let storedImages = JSON.parse(localStorage.getItem('projectImages'));
		storedImages.splice(imgId, 1);
		localStorage.setItem('projectImages', JSON.stringify(storedImages));
		setProjectImages(storedImages);
	}

	useEffect(() => {
		setProjectTitle('');
	}, [projectImages]);

	return (
		<div>
			<div style={{ fontSize: "0.5em" }} className="bg-white">
				<div style={{fontSize: "1.9em"}}>
					<ToastContainer />
				</div>
				<div className='flex justify-between m-4'>
					<div><img src={logo} style={{ width: '5em', marginTop: '1.1em' }} alt='alt' /></div>
					<div className='flex mt-1 mr-3'>
						<span style={{ borderRadius: '50%' }} className='hover:bg-gray-200 cursor-pointer flex align-center shadow-lg p-5 border'>
							<span className=''><FaShareAlt size={15} /></span>
						</span>
					</div>
				</div>
				<div className="text-lg text-center px-4 font-semibold mt-8">Welcome back {firstName}! </div>

				<form style={{ fontSize: "1.2em" }} className="text-md flex flex-col p-2 mb-1 md:w-1/2 mx-auto" id="contactForm">
			
					<div className="text-md flex flex-col p-2 border mb-2">
						<label className="text-md flex justify-between py-2 mb-1">
							<span className='flex justify-center mt-1 p-1'>
							Kindly upload your resume
							<span className={'p-1 ml-2 rounded cursor-pointer text-white bg-blue-900'}>{resumeUrl ? <TiTick /> : <ImFilePdf />}</span> 
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
					<div className="text-md flex flex-col p-2 border mb-2">
						<label className="text-md flex justify-between py-2 mb-1">
							<span className='flex justify-center mt-1 p-1'>
							Kindly attach an image of yourself
							<span className={`p-1 ml-2 rounded cursor-pointer text-white bg-blue-900`}>{profileImage ? <TiTick /> : <FaCamera />}</span> 
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
						{(projectImages.length > 0) && projectImages.map((img, idx) => (
							<div key={idx}>
								<div className='flex' style={{fontSize: "1.2em"}}>
									<span className='border p-2 w-full rounded m-1'>{idx + 1}: {img.name?.substring(0, 20)}</span>
									<span onClick={() => removeImage(idx)} className='text-red-500 mr-4 cursor-pointer bg-gray-200 m-1 p-2 font-semibold rounded border hover:bg-white'><AiFillDelete /></span>
								</div>
							</div>
						)) }
						{(projectImages.length < 30) ?
						(<>
							<div style={{fontSize: '1.3em'}} className='mt-6 mb-3'>Upload images for your projects (max. 30)</div>
							<Input name="projectTitle" values={projectTitle} placeholder="Enter Project/Image Title" handleChange={handleChange} submitted={submitted} />
							<label className="text-md flex justify-between mb-1">
								<span className='flex justify-center mt-1 p-2 '>
								<span className={`p-1 ml-2 -mt-3 rounded cursor-pointer text-white bg-blue-900`}>{projectImageLoading ? <Rings 
														// type='ThreeDots'
														color='#fff'
														height={20} 
														width={20} 
													/> : <FaCamera />}</span> 
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
							</label></>):
						(
							<div style={{fontSize: '1.3em'}} className='mt-2 mb-3'>You have reached the limit, please proceed to submit !</div>
						)}
					</div>

					<div className="text-md flex flex-col p-2">
						<label className="text-md flex justify-between p-2 mb-1">How much do you charge per render i.e
							(25,000 to 30,000).</label>
						<Input name="charge" values={charge} handleChange={handleChange} submitted={submitted} />
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

const Input = ({ name, values, submitted, handleChange, placeholder }) => (
	<input 
		type="text" 
		name={name} 
		value={values} 
		onChange={handleChange} 
		style={{ fontSize: '1.1em' }}
		placeholder={placeholder}
		className={`focus-none focus:border focus:border-gray-500 outline-none rounded-lg border p-2 -mt-2 ${(submitted && values === '') && 'border-red-500'}`} />
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