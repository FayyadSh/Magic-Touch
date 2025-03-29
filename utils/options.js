export const authOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
    {
      id: "descope",
      name: "Descope",
      type: "oauth",
      wellKnown: `https://api.descope.com/`+process.env.NEXT_PUBLIC_DESCOPE_API_KEY+`/.well-known/openid-configuration`,
      authorization: { params: { scope: "openid email profile" } },
      idToken: true,
      clientId: process.env.NEXT_PUBLIC_DESCOPE_API_KEY,
      clientSecret: process.env.NEXT_PUBLIC_DESCOPE_ACCESS_KEY,
      checks: ["pkce", "state"],
      profile(profile) {
          return {
              id: profile.sub,
              name: profile.name,
              email: profile.email,
              image: profile.picture,
          }
      },
    }]
}  