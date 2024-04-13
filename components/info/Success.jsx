/**
 * Displays a modal for successful operations, including a title and message.
 *
 * @function Success
 * @param {Object} props - The component props.
 * @param {string} props.title - The title of the success message.
 * @param {string} props.message - The content of the success message.
 * @param {Function} props.onClose - The function to call when the "OK" button is clicked.
 * @returns {React.Element} A modal with a success message and an "OK" button to dismiss the modal.
 */
const Success = ({ title, message, onClose }) => {
  return (
    <div className='fixed inset-0 flex items-center justify-center z-50'>
      <div className='bg-gray-900 bg-opacity-50 absolute inset-0'></div>
      <div className='bg-green-100 p-6 rounded-lg shadow-lg relative'>
        <h2 className='text-green-700 font-semibold'>{title}</h2>
        <p className='text-green-600'>{message}</p>
        <button
          className='mt-4 bg-green-500 text-white px-4 py-2 rounded-md'
          onClick={onClose}
        >
          OK
        </button>
      </div>
    </div>
  )
}

export default Success
