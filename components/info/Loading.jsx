/**
 * Displays a fullscreen loading indicator.
 *
 * @function Loading
 * @returns {React.Element} A full-screen modal with a loading spinner animation.
 */
const Loading = () => {
  return (
    <div className='loading-backdrop'>
      <div className='loading-spinner'></div>
    </div>
  )
}

export default Loading
