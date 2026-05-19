import { Button } from "@heroui/react";
import Link from "next/link";

const LoginPage = () => {
    return (
        <div>
            LoginPage
            <Link href={'/registration'}><Button>RegistrationPage</Button></Link>
        </div>
    );
};

export default LoginPage;