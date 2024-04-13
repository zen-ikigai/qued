'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { signIn, signOut, useSession, getProviders } from 'next-auth/react'
import {
  HiHome,
  HiArrowRight,
  HiLogout,
  HiArrowSmUp,
  HiOutlineHome,
} from 'react-icons/hi'
import { usePathname } from 'next/navigation'

/**
 * Navigation component providing links and actions for user interaction.
 * Includes both desktop and mobile versions.
 *
 * @returns {React.Element} The rendered navigation component.
 */

const Nav = () => {
  const { data: session } = useSession()

  const pathname = usePathname()
  const [providers, setProviders] = useState(null)

  useEffect(() => {
    const setUpProviders = async () => {
      const response = await getProviders()
      setProviders(response)
    }
    setUpProviders()
  }, [])

  const handleSignin = async providerId => {
    await signIn(providerId, { callbackUrl: '/dashboard' })
  }
  const handleSignout = async () => {
    await signOut({ callbackUrl: '/' })
  }
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <nav className='flex-between w-full mb-16 pt-3 mt-2 font-mono '>
      {session?.user ? (
        <Link href='/dashboard' className='flex gap-2 items-center'>
          <Image
            src='/assets/logo.svg'
            alt='Qued logo'
            width={55}
            height={55}
            className='object-contain rounded'
          />
          <p className='logo_text '>Qued</p>
        </Link>
      ) : (
        <Link href='/' className='flex gap-2 items-center'>
          <Image
            src='/assets/logo.svg'
            alt='Qued logo'
            width={55}
            height={55}
            className='object-contain rounded'
          />
          <p className='logo_text'>Qued</p>
        </Link>
      )}

      {/* Desktop Navigation */}
      <div className='sm:flex hidden'>
        {session?.user ? (
          <>
            <div className='flex gap-3 md:gap-5'>
              <Link id='dashboard' href='/dashboard' className='nav-item'>
                <HiOutlineHome className='nav-icon text-black' />
              </Link>
              <Link id='profile' href='/profile' className='nav-item'>
                <Image
                  src={`data:image/png;base64,${session?.user?.image}`}
                  width={27}
                  height={27}
                  alt='profile'
                />
              </Link>

              <button
                type='button'
                onClick={handleSignout}
                className='nav-item'
              >
                <HiLogout className='nav-icon text-black' />
              </button>
            </div>
          </>
        ) : (
          <>
            <div className='flex gap-3 md:gap-5'>
              {providers &&
                Object.values(providers).map(provider => (
                  <button
                    type='button'
                    key={provider.name}
                    onClick={() => handleSignin(provider.id)}
                    className='black_btn_mono'
                  >
                    Get Started <HiArrowRight className='ml-2' />
                  </button>
                ))}
            </div>
          </>
        )}
      </div>

      {/* Mobile Navigation */}
      <div className='sm:hidden flex flex-end  w-full gap-5 z-10'>
        {session?.user ? (
          <>
            <button
              type='button'
              onClick={() => {
                handleSignout()
              }}
            >
              <HiLogout className='nav-icon text-black' />
            </button>
          </>
        ) : (
          <div className='flex gap-3 md:gap-5'>
            {providers &&
              Object.values(providers).map(provider => (
                <button
                  type='button'
                  key={provider.name}
                  onClick={() => handleSignin(provider.id)}
                  className='black_btn_mono'
                >
                  Join Now <HiArrowRight className='ml-2' />
                </button>
              ))}
          </div>
        )}

        <div className='fixed bottom-0 left-0 w-full bg-black border-t border-gray-200'>
          {/* Mobile Navigation Icons */}
          {session?.user ? (
            <div className='flex justify-evenly py-3'>
              <Link href='/dashboard'>
                <HiHome
                  size={24}
                  className={`hover:text-white flex items-center ${pathname == '/dashboard' ? 'text-white' : 'text-gray-500'}`}
                />
              </Link>

              <Link
                href='/profile'
                className={`hover:text-white flex items-center ${pathname == '/profile' ? 'text-white' : 'text-gray-500'}`}
              >
                <Image
                  src={`data:image/png;base64,${session?.user?.image}`}
                  width={24}
                  height={24}
                  className='rounded-full'
                  alt='profile'
                />
              </Link>
              <button
                type='button'
                onClick={handleScrollToTop}
                className='text-gray-500 hover:text-white flex items-center'
              >
                <HiArrowSmUp size={24} />
              </button>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Nav
