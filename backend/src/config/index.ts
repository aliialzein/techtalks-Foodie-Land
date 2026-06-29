const config={
    jwtSecret: process.env.JWT_SECRET as string,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN ||"7d",
    databaseUrl: process.env.DATABASE_URL as string,
    port:parseInt(process.env.PORT||"3000"),
}

export default config;