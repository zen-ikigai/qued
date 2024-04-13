const TaskCard = ({ task }) => {
  const formatDate = date => {
    if (!date) return ''
    const d = new Date(date)
    // Format the date and time in local timezone
    const year = d.getFullYear()
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]
    const month = months[d.getMonth()] // Get the three-letter month from the array
    const day = d.getDate().toString().padStart(2, '0') // Convert day to 2-digits
    const hours = d.getHours().toString().padStart(2, '0') // Convert hours to 2-digits
    const minutes = d.getMinutes().toString().padStart(2, '0') // Convert minutes to 2-digits

    return `${day} ${month} ${year} | ${hours}:${minutes}`
  }

  return (
    <div className=' border-b border-black p-4 text-black '>
      <div>
        <h3 className='text-xl font-bold'>{task.title}</h3>
        <p className='text-lg mt-2 border-b border-gray-400 pb-3'>
          {task.description}
        </p>
      </div>
      <div>
        <p className='text-sm text-gray-600 mt-3'>
          <b>Due By: </b>
          {formatDate(task.dueDate)}
        </p>
        <p className='text-sm text-gray-600 mt-2'>
          <b>Created on: </b>
          {formatDate(task.createdAt)}
        </p>
        <p className='text-sm text-gray-600 mt-2'>
          <b>Reminder: </b>
          {task.reminder ? 'Set' : 'Not Set'}
        </p>
      </div>
    </div>
  )
}

export default TaskCard
