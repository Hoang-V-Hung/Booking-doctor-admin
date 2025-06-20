import React, { useContext } from 'react'
import { assets } from '../../assets/assets'
import { useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const AddDoctor = () => {


    const [docImg, setDocImg] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [experience, setExperience] = useState('1 năm')
    const [fees, setFees] = useState('')
    const [about, setAbout] = useState('')
    const [speciality, setSpeciality] = useState('Tim mạch')
    const [degree, setDegree] = useState('')
    const [address1, setAddress1] = useState('')
    const [address2, setAddress2] = useState('')

    const { backendUrl, aToken } = useContext(AdminContext)

    const onSubmitHandler = async (event) => {
        event.preventDefault()

        try {

            if (!docImg) {
                return toast.error('Vui lòng chọn ảnh bác sĩ')
            }

            const formData = new FormData()

            formData.append('image', docImg)
            formData.append('name', name)
            formData.append('email', email)
            formData.append('password', password)
            formData.append('experience', experience)
            formData.append('fees', Number(fees))
            formData.append('about', about)
            formData.append('speciality', speciality)
            formData.append('degree', degree)
            formData.append('address', JSON.stringify({ line1: address1, line2: address2 }))

            // console log formdata
            formData.forEach((value, key) => {
                console.log(`${key}: ${value}`);
            })

            const { data } = await axios.post(backendUrl + '/api/admin/add-doctor', formData, { headers: { aToken } })

            if (data.success) {
                toast.success(data.message)
                setDocImg(false)
                setName('')
                setPassword('')
                setEmail('')
                setAddress1('')
                setAddress2('')
                setDegree('')
                setAbout('')
                setFees('')
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error);
        }

    }

    return (
        <form onSubmit={onSubmitHandler} className='w-full max-w-6xl m-5'>

            <p className='mb-3 text-lg font-medium'>Thêm bác sĩ</p>

            <div className='bg-white px-8 py-8 rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll'>
                <div className='flex items-center gap-4 mb-8 text-gray-500'>
                    <label htmlFor='doc-img'>
                        <img className='w-16 bg-gray-100 rounded-full cursor-pointer' src={docImg ? URL.createObjectURL(docImg) : assets.upload_area} alt='' />
                    </label>
                    <input onChange={(e) => setDocImg(e.target.files[0])} type='file' id='doc-img' hidden />
                    <p>Chọn ảnh <br /> bác sĩ</p>
                </div>

                <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>
                    <div className='w-full lg:flex-1 flex flex-col gap-4'>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Tên</p>
                            <input onChange={(e) => setName(e.target.value)} value={name} className='border rounded px-3 py-2' type='text' placeholder='Tên' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Email</p>
                            <input onChange={(e) => setEmail(e.target.value)} value={email} className='border rounded px-3 py-2' type='email' placeholder='Email' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Mật khấu</p>
                            <input onChange={(e) => setPassword(e.target.value)} value={password} className='border rounded px-3 py-2' type='password' placeholder='Mật khấu' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Kinh nghiện</p>
                            <select onChange={(e) => setExperience(e.target.value)} value={experience} className='border rounded px-3 py-2' name='' id=''>
                                <option value="1 Năm">1 Năm</option>
                                <option value="2 Năm">2 Năm</option>
                                <option value="3 Năm">3 Năm</option>
                                <option value="4 Năm">4 Năm</option>
                                <option value="5 Năm">5 Năm</option>
                                <option value="6 Năm">6 Năm</option>
                                <option value="7 Năm">7 Năm</option>
                                <option value="8 Năm">8 Năm</option>
                                <option value="9 Năm">9 Năm</option>
                                <option value="10 Năm">10 Năm</option>
                            </select>
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Chi phí</p>
                            <input onChange={(e) => setFees(e.target.value)} value={fees} className='border rounded px-3 py-2' type='number' placeholder='Chi phí' required />
                        </div>

                    </div>

                    <div className='w-full lg:flex-1 flex flex-col gap-4'>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Chuyên ngành</p>
                            <select onChange={(e) => setSpeciality(e.target.value)} value={speciality} className='border rounded px-3 py-2' name='' id=''>
                                <option value='Tim mạch'>Tim mạch</option>
                                <option value='Sản khoa'>Sản khoa</option>
                                <option value='Ung bướu'>Ung bướu</option>
                                <option value='Răng hàm mặt'>Răng hàm mặt</option>
                                <option value='Chẩn đoán hình ảnh'>Chẩn đoán hình ảnh</option>
                                <option value='Xét nghiệm'>Xét nghiệm</option>
                            </select>
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Bằng cấp</p>
                            <input onChange={(e) => setDegree(e.target.value)} value={degree} className='border rounded px-3 py-2' type='text' placeholder='Bằng cấp' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Địa chỉ</p>
                            <input onChange={(e) => setAddress1(e.target.value)} value={address1} className='border rounded px-3 py-2' type='text' placeholder='Địa chỉ 1' required />
                            <input onChange={(e) => setAddress2(e.target.value)} value={address2} className='border rounded px-3 py-2' type='text' placeholder='Địa chỉ 2' required />
                        </div>

                    </div>
                </div>

                <div>
                    <p className='mt-4 mb-2'>Thông tin</p>
                    <textarea onChange={(e) => setAbout(e.target.value)} value={about} className='w-full px-4 pt-2 border rounded' placeholder='Thông tin' rows={5} required />
                </div>

                <button type='submit' className='bg-primary px-10 py-3 mt-4 text-white rounded-full'>Thêm bác sĩ</button>

            </div>

        </form>
    )
}

export default AddDoctor
