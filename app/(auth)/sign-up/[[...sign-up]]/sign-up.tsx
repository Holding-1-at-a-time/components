import { SignUp } from "@clerk/nextjs";

const signup = () => {
    return (
        <div className="flex-center glassmorphism-auth-w-full h-screen">
            <SignUp />
        </div>
    );
};

export default signup;