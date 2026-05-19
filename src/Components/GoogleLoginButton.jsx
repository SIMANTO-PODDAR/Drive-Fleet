import { authClient } from '@/lib/auth-client';
import toast from 'react-hot-toast';
import { FcGoogle } from 'react-icons/fc';

const GoogleLoginButton = ({ BtnFor }) => {

    const GoogleLogin = async () => {
        const LoadingToast = toast.loading('Processing your request..');

        const { data, error } = await authClient.signIn.social({
            provider: "google",
        });

        if (data) {
            toast.success(`${BtnFor} successfully.`, {
                id: LoadingToast
            });
        };

        if (error) {
            toast.error(error.message, {
                id: LoadingToast
            });
        };
    };

    return (

        <div className='flex justify-center'>
            <button onClick={GoogleLogin} className="btn text-[#0033FF] w-full rounded-2xl hover:text-white hover:bg-linear-to-r from-[#0D0D33] to-[#0033FF]">
                <FcGoogle className='bg-white m-1 scale-150 rounded-full' />
                <span className=' font-bold '>
                    {BtnFor} with Google
                </span>
            </button>
        </div>
    );
};

export default GoogleLoginButton;