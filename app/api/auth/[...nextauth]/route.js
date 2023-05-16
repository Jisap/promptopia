import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import User from '@models/user';
import { connectToDB } from '@utils/database';


const handler = NextAuth({ // handler se pasa como argumento a NextAuth y contiene toda la lógica de autenticación
    
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret:process.env.GOOGLE_CLIENT_SECRET,
        })
    ],

    callbacks:{
      
      async session({ session }) {                                              // El token de acceso generado por google genera la session
      
        const sessionUser = await User.findOne({ email: session.user.email });  // Buscamos el usuario autenticado en nuestra bd
        session.user.id = sessionUser._id.toString();                           // Asignamos la id de la bd a la session
  
        return session;                                                         //  Esto permite que el ID del usuario esté disponible en la sesión,
      },
      async signIn({ profile }){ // Autenticado el user recibimos un profile con sus datos
        
          try {
            await connectToDB();  
            //Check if a user already exists
            const userExists = await User.findOne({ email: profile.email });
            //if not, create a new user
            if (!userExists) {
                await User.create({
                  email: profile.email,
                  username: profile.name.replace(" ", "").toLowerCase(),
                  image: profile.picture,
                });
            }
  
            return true
  
          } catch (error) {
             console.log("Error checking if user exists: ", error.message);
            return false;  
          }
      }
    },
});

export { handler as GET, handler as POST };