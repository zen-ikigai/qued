/**
 * A component that displays a confirmation dialog for deleting an item.
 * Provides buttons for confirming or cancelling the delete action.
 *
 * @function Delete
 * @param {Object} props - The component props.
 * @param {string} props.title - The title of the delete confirmation dialog.
 * @param {string} props.message - The message or description displayed in the dialog.
 * @param {Function} props.onClose - Handler called when the cancel button is clicked.
 * @param {Function} props.handleDelete - Handler called when the delete button is clicked.
 * @returns {React.Element} A styled modal with delete and cancel options.
 */
const Delete = ({ title, message, onClose, handleDelete }) => {
  return (
    <div className='fixed inset-0 flex items-center justify-center z-10'>
      <div className='bg-gray-900 bg-opacity-50 absolute inset-0'></div>
      <div className='bg-white p-6 shadow-lg relative'>
        <h2 className='text-black font-semibold'>{title}</h2>
        <p className='text-red-600 mt-5'>{message}</p>
        <div className='mt-4 flex justify-end'>
          <button
            className='mr-2 bg-red-600 text-white px-4 py-2 rounded-md'
            onClick={handleDelete}
          >
            Delete
          </button>
          <button
            className='bg-gray-300 text-gray-700 px-4 py-2 rounded-md'
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default Delete
