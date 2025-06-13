import React from 'react'
import { useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { useEffect } from 'react'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import * as XLSX from 'xlsx'

const Dashboard = () => {

  const { aToken, getDashData, cancelAppointmnet, dashData, doctors, appointments, getAllDoctors, getAllAppointments } = useContext(AdminContext)

  const { slotDateFormat } = useContext(AppContext)

  useEffect(() => {
    if (aToken) {
      getDashData()
      getAllDoctors()
      getAllAppointments()
    }
  }, [aToken])
  
  const exportToExcel = () => {
    // Tạo workbook mới
    const workbook = XLSX.utils.book_new()
    
    // Chuẩn bị dữ liệu bác sĩ
    const doctorsData = doctors.map((doctor, index) => ({
      'STT': index + 1,
      'Tên bác sĩ': doctor.name,
      'Email': doctor.email,
      'Chuyên khoa': doctor.speciality,
      'Bằng cấp': doctor.degree,
      'Kinh nghiệm': doctor.experience,
      'Chi phí': doctor.fees,
      'Trạng thái': doctor.available ? 'Hoạt động' : 'Không hoạt động'
    }))
    
    // Chuẩn bị dữ liệu lịch hẹn
    const appointmentsData = appointments.map((appt, index) => ({
      'STT': index + 1,
      'Bệnh nhân': appt.userData?.name || 'N/A',
      'Bác sĩ': appt.docData?.name || 'N/A',
      'Ngày': appt.slotDate ? slotDateFormat(appt.slotDate) : 'N/A',
      'Giờ': appt.slotTime || 'N/A',
      'Chi phí': appt.amount || '0',
      'Trạng thái': appt.cancelled ? 'Đã huỷ' : (appt.isCompleted ? 'Đã xác nhận' : 'Chờ xác nhận')
    }))
    
    // Tạo danh sách bệnh nhân duy nhất từ lịch hẹn
    const uniquePatients = new Map()
    appointments.forEach(appt => {
      if (appt.userData && appt.userData._id) {
        uniquePatients.set(appt.userData._id, appt.userData)
      }
    })
    
    const patientsData = Array.from(uniquePatients.values()).map((patient, index) => ({
      'STT': index + 1,
      'Tên bệnh nhân': patient.name || 'N/A',
      'Email': patient.email || 'N/A'
    }))
    
    // Tạo worksheets cho từng loại dữ liệu
    const doctorsSheet = XLSX.utils.json_to_sheet(doctorsData)
    const appointmentsSheet = XLSX.utils.json_to_sheet(appointmentsData)
    const patientsSheet = XLSX.utils.json_to_sheet(patientsData)
    
    // Thêm worksheets vào workbook
    XLSX.utils.book_append_sheet(workbook, doctorsSheet, 'Danh sách bác sĩ')
    XLSX.utils.book_append_sheet(workbook, appointmentsSheet, 'Danh sách lịch hẹn')
    XLSX.utils.book_append_sheet(workbook, patientsSheet, 'Danh sách bệnh nhân')
    
    // Xuất file Excel
    const date = new Date()
    const fileName = `Thống kê dữ liệu_${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}.xlsx`
    XLSX.writeFile(workbook, fileName)
  }

  return dashData && (
    <div className='m-5'>

      <div className='flex flex-wrap gap-3'>
        {/* Các card hiện có */}
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.doctor_icon} alt='' />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.doctors}</p>
            <p className='text-gray-400'>Bác sĩ</p>
          </div>
        </div>

        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.appointment_icon} alt='' />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.appointments}</p>
            <p className='text-gray-400'>Lịch hẹn</p>
          </div>
        </div>

        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.patients_icon} alt='' />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.patients}</p>
            <p className='text-gray-400'>Bệnh nhân</p>
          </div>
        </div>
      </div>

      <div className='bg-white'>
        <div className='flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border'>
          <img src={assets.list_icon} alt='' />
          <p className='font-semibold'>Lịch hẹn gần đây</p>
        </div>

        <div className='pt-4 border border-t-0'>
          {
            dashData.latestAppointments.map((item, index) => (
              <div className='flex items-center px-6 py-3 gap-3 hover:bg-gray-100' key={index}>
                <img className='rounded-full w-10' src={item.docData.image} alt='' />
                <div className='flex-1 text-sm'>
                  <p className='text-gray-800 font-medium'>{item.docData.name}</p>
                  <p className='text-gray-600'>{slotDateFormat(item.slotDate)}</p>
                </div>
                {
                  item.cancelled
                    ? <p className='text-red-400 text-xs font-medium'>Đã huỷ</p>
                    : item.isCompleted
                      ? <p className='text-green-500 text-xs font-medium'>Được chấp nhận</p>
                      : <img onClick={() => cancelAppointmnet(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt='' />
                }
              </div>
            ))
          }
        </div>
      </div>

      {/* Nút xuất dữ liệu */}
      <div className='flex justify-center mt-8 mb-5'>
        <button 
          onClick={exportToExcel} 
          className='bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 flex items-center gap-2 transition-all'
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Xuất dữ liệu
        </button>
      </div>
    </div>
  )
}

export default Dashboard
