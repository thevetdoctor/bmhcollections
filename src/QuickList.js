/* eslint-disable no-unused-vars*/
import 'react-toastify/dist/ReactToastify.css';
import React, { useState } from 'react';
import { FaShareAlt, FaMoon, FaCamera } from 'react-icons/fa';
import { IoArrowBack } from 'react-icons/io5';
import { Modal } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { submitQuicklist } from './quicklistApi';
import logo from './bmh-blue-1.png';

export default function ArchitectForm ({ onCompleted }) {

	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [mobile, setMobile] = useState('');
	const [email, setEmail] = useState('');
	const [completed, setCompleted] = useState(null);
	const [error, setError] = useState('');
	const [submitted, setSubmitted] = useState(false);
	const [isSubmitting, setSubmitting] = useState(false);

	const setUp = async (e) => {
		e.preventDefault();

		const fields = [firstName, lastName, mobile, email];

		const hasInvalidField = fields.some(field => !field.length);

		if (hasInvalidField) {
			toast.error('Please enter all fields');
			return;
		}

		if(!email.match(/\S+@\S+\.\S+/)) {
			toast.error('Please provide a valid email address');
			return;
		}

		setSubmitting(true);
	
		const payload = { firstName, lastName, mobile, email };

		const response = await submitQuicklist(payload);
		setSubmitting(false);

		if(response.error){
			toast.error(response.message);
			return;
		}

		toast.success(response.message);
		onCompleted();
	};

	const handleChange = (e) => {
		const target = e.target;
		if (target.name === 'firstname') {
			setFirstName(target.value);
		} else if (target.name === 'lastname') {
			setLastName(target.value);
		} else if (target.name === 'mobile') {
			setMobile(target.value);
		} else if (target.name === 'email') {
			setEmail(target.value);
		}
	};

	return (
		<div>
			<div style={{ fontSize: "0.5em" }} className="bg-white">
				<div style={{fontSize: "1.9em"}}>
					<ToastContainer />
				</div>
				<div className='flex justify-between m-2'>
					<div><img src={logo} style={{ width: '5em', marginTop: '1.1em' }} alt='alt' /></div>
					<div className='flex mt-1 mr-3'>
						<span style={{ borderRadius: '50%' }} className='hover:bg-gray-200 cursor-pointer flex align-center shadow-lg p-5 border'>
							<span className=''><FaShareAlt size={15} /></span>
						</span>
					</div>
				</div>

				<div className="text-lg text-center px-4 font-semibold mt-4">
					<p><br />Discounts and Special Offers!</p> 
					<p><br />Be the first to know!</p> 
				</div>

				<form style={{ fontSize: "1.2em" }} className="text-md flex flex-col p-2 mb-1 md:w-1/2 mx-auto" id="contactForm">
					<input type="text" id="ProfilePic" style={{ display: "none" }} />
					<div className="text-md flex flex-col p-2">
						<label className="text-md flex justify-between py-2 py-3 mb-0"><span>Firstname </span><Required /></label>
						<Input name="firstname" firstName={firstName} handleChange={handleChange} />
					</div>
					<div className="text-md flex flex-col p-2">
						<label className="text-md flex justify-between py-2 mb-1"><span>Lastname</span>
							<Required /></label>
						<Input name="lastname" lastName={lastName} handleChange={handleChange} />
					</div>
					<div className="text-md flex flex-col p-2">
						<label className="text-md flex justify-between py-2 mb-1">Mobile<Required /></label>
						<Input name="mobile" mobile={mobile} handleChange={handleChange} />
					</div>
					<div className="text-md flex flex-col p-2">
						<label className="text-md flex justify-between py-2 mb-1">Email
							<Required /></label>
						<Input name="email" email={email} handleChange={handleChange} />
					</div>
					<br />
					<br /><br />
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

const Input = ({ name, value, submitted, handleChange }) => (
	<input type="text" name={name} value={value} onChange={handleChange} style={{ fontSize: '1.5em' }} className={`focus-none focus:border focus:border-gray-500 outline-none rounded-lg border p-3 -mt-2 ${(submitted && value === '') && 'border-red-500'}`} />
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
					Your submission was successful..Please check your email for the next steps!
				</div>
			</Modal.Body>
		</Modal>
	</div>
)