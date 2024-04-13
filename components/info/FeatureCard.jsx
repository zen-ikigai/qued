import { HiArrowUpRight } from 'react-icons/hi2'
import { handleSignIn } from '../auth/Login'

/**
 * Displays a feature card with a title, description, and a "Try Now" button.
 * Cards use a cycling color scheme based on their index.
 *
 * @function FeatureCard
 * @param {Object} props - The component props.
 * @param {Object} props.feature - The feature object containing the title and description.
 * @param {number} props.index - The index of the feature in the feature list to determine background color.
 * @returns {React.Element} A stylized feature card with hover effect and interactive elements.
 */
const FeatureCard = ({ feature, index }) => {
  const colors = [
    'bg-blue-100',
    'bg-red-100',
    'bg-purple-100',
    'bg-green-100',
    'bg-pink-100',
    'bg-yellow-100',
  ]

  const { title, description } = feature
  const bgColor = colors[index % colors.length] // Cycle through colors based on index

  return (
    <div
      className={`feature-card ${bgColor} shadow-lg border rounded border-black p-6 transform rotate-0 hover:rotate-2 transition-transform duration-300`}
    >
      <h3 className='text-lg font-semibold mb-2'>{title}</h3>
      <p className='text-gray-600'>{description}</p>
      <button className='black_btn_mono mt-5 try-now' onClick={handleSignIn}>
        Try Now <HiArrowUpRight className='ml-2' />
      </button>
    </div>
  )
}

export default FeatureCard
