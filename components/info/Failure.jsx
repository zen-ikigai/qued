/**
 * Displays a modal for failure notifications with an "OK" button to close the modal.
 *
 * @function Failure
 * @param {Object} props - The component props.
 * @param {string} props.title - The title of the failure notification.
 * @param {string} props.message - Descriptive text about the failure.
 * @param {Function} props.onClose - Handler to call when the "OK" button is clicked.
 * @returns {React.Element} A styled modal that informs the user of a failure.
 */
const Failure = ({ title, message, onClose }) => {
  return (
    <div className='fixed inset-0 flex items-center justify-center z-50'>
      <div className='bg-gray-900 bg-opacity-50 absolute inset-0'></div>
      <div className='bg-green-100 p-6 rounded-lg shadow-lg relative'>
        <h2 className='text-black font-semibold'>{title}</h2>
        <p className='text-red-600'>{message}</p>
        <button
          className='mt-4 bg-black text-white px-4 py-2 rounded-md'
          onClick={onClose}
        >
          OK
        </button>
      </div>
    </div>
  )
}

export default Failure
