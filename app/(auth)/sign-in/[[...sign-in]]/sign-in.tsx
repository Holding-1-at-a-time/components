import { SignIn } from "@clerk/nextjs";

const signin = () => {
    return (
        <div className="flex-center glassmorphism-auth w-full h-screen">
            <SignIn />
        </div>
    );
};

export default signin;