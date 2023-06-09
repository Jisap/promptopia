'use client'

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { signIn, signOut, useSession, getProviders } from 'next-auth/react';

const Nav = () => {

  const { data: session } = useSession();

  const[providers, setProviders] = useState(null);
  const[toggleDropdown, setToggleDropdown] = useState(false); 

  useEffect(() => {                         // Obtenemos los providers de autenticación
    (async () => {
      const res = await getProviders();     // getProviders llama al handler y obtiene los providers allí definidos
      setProviders(res);
    })();                                   // Se invoca inmediatamente cuando se monta el componente sin esperar a que se llame en el boton
  }, []);                                   // El callback así no es una promesa sino una función.
  
  
  return (
    <nav className='flex-between w-full mb-16 pt-3'> 
      <Link href='/' className='flex gap-2 flex-center'> 
        <Image                                                  // Logo
          src="/assets/images/logo.svg"
          alt="promptopia"
          width={30}
          height={30}
          className='object-contain'
        />
        <p className='logo_text'>Promptopia</p>
      </Link>

      

      {/* Desktop Navigation */}
      <div className='hidden sm:flex'>
        { session?.user ? (

          <div className='flex gap-3 md:gap-5'>
            <Link 
              href='/create-prompt'
              className='black_btn'
            >
              Create Post
            </Link>
            <button 
              type='button' 
              onClick={signOut} 
              className='outline_btn'
            >
              Sign Out
            </button>
            <Link
              href='/profile'
            >
              <Image 
                src={session?.user.image}
                alt='profile'
                width={37}
                height={37}
                className='rounded-full'
              />
            </Link>
          </div>

        ) : (

          <>
            {providers && 
              Object.values(providers).map((provider)=> (
                <button
                  type='button'                       // signIn es un método de NextAuth-react que comunica con google y autentica nuestros datos.
                  key={provider.name}                 // Google compara los datos del provider del handler contra los suyos y generá un token de acceso
                  onClick={() => signIn(provider.id)} // next-auth utilizará ese token de acceso para obtener la información del perfil del usuario autenticado.
                  className='black_btn'               // Esa información es el profile usado en el handler
                >
                  Sign In
                </button>
              ))
            }
          </>
          
        )}
      </div>

      {/* Mobile Nav */}
      <div className='sm:hidden flex relative'>
        { session?.user ? (
          <div className='flex'>
            <Image 
                src={session?.user.image}
                alt='profile'
                width={37}
                height={37}
                className='rounded-full'
                onClick={()=> setToggleDropdown((prev) => !prev )}
              />

              {toggleDropdown && (
                <div className='dropdown'>
                  <Link
                    href='/profile'
                    className='dropdown_link'
                    onClick={() => setToggleDropdown(false)}
                  >
                    My Profile
                  </Link>
                  <Link
                    href='/create-prompt'
                    className='dropdown_link'
                    onClick={() => setToggleDropdown(false)}
                  >
                    Create Prompt
                  </Link>
                  <button
                    type='button'
                    onClick={() => {
                      setToggleDropdown(false);
                      signOut();
                    }}
                    className='mt-5 w-full black_btn'
                  >
                  Sign Out
                </button>
                </div>
              )}
          </div>
        ) : (
          <>
            {providers && 
              Object.values(providers).map((provider)=> (
                <button
                  type='button'
                  key={provider.name}
                  onClick={() => signIn(provider.id)}
                  className='black_btn'
                >
                  Sign In
                </button>
              ))
            }
          </> 
        )}
      </div>

    </nav>
  )
}

export default Nav