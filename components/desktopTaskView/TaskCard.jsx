/**
 * A component that renders a card for displaying task details. It shows the task's title, description, due date, creation date, and reminder status.
 * The date is formatted to a more readable format using the `formatDate` function.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Object} props.task - Task object containing details about the task.
 * @param {string} props.task.title - Title of the task.
 * @param {string} props.task.description - Description of the task.
 * @param {Date} props.task.dueDate - Due date of the task.
 * @param {Date} props.task.createdAt - Creation date of the task.
 * @param {boolean} props.task.reminder - Indicates whether a reminder is set for the task.
 * @returns {ReactElement} Rendered component.
 */
const TaskCard = ({ task }) => {
  /**
   * Formats a date into a string with the format "DD MMM YYYY | HH:MM", e.g., "12 Jan 2024 | 15:30".
   * Uses the user's local timezone.
   *
   * @function formatDate
   * @param {Date|string} date - The date to format.
   * @returns {string} The formatted date string.
   */
  const formatDate = date => {
    if (!date) return ''
    const d = new Date(date)
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
    <div className='border-b border-black p-4 text-black'>
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
