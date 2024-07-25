import { SignUp } from '@clerk/nextjs';

const page = () => {
    return (
        <div className="flex-center glassmorphism-auth-w-full h-screen">
            <SignUp />
        </div>
    );
};

export default page;