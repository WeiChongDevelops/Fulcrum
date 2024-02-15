import FulcrumButton from "../Other/FulcrumButton.tsx";
import "../../css/App.css";
import {FormEvent, useState} from "react";
import {handleUserRegistration} from "../../util.ts";

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    async function handleSubmit(e: FormEvent<HTMLFormElement>){
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        await handleUserRegistration(email, password);
        setEmail("");
        setPassword("");
        setConfirmPassword("");
    }

    return (
        <div className={"auth-page-container register-page flex flex-row justify-around items-center w-[100vw] h-[100vh]"}>
            <div className={"flex flex-col justify-around items-start h-[75vh] pl-[10rem] pb-52"}>
                <div className={"flex-1"}>
                    <img src="/src/assets/fulcrum-logos/fulcrum-long-white.webp" className={"select-none w-80 h-auto"} alt="Fulcrum logo"/>
                </div>
                <div className={"flex flex-col justify-center items-start h-[100vh] w-[35vw] text-left"}>
                    <b className={"text-[4rem]"}>Register for an account.</b>
                    <p className={"text-xl ml-2 mt-8"}>Every dollar gets a job!</p>
                </div>
            </div>
            <div className={"flex flex-col justify-around items-center h-[75vh] mr-24"}>
                <p className={"text-8xl flex-1"}></p>
                <form className={"login-form flex flex-col justify-center items-center bg-white text-black px-12 pt-14 mt-20 pb-8 w-[37vw] rounded-2xl"}
                      onSubmit={handleSubmit}>
                    <div className={"flex flex-col justify-center items-start w-full"}>
                        <label htmlFor={"email"}>Email</label>
                        <input type="email" className={"w-full py-2 px-4 rounded-md border border-gray-400 mt-2"}
                               placeholder={"name@example.com"}
                               value={email}
                               onChange={e => setEmail(e.target.value)}
                               required/>
                    </div>
                    <div className={"flex flex-col justify-center items-start w-full mt-10"}>
                        <label htmlFor={"password"}>Password</label>
                        <input type="password" className={"w-full py-2 px-4 rounded-md border border-gray-400 mt-2"}
                               placeholder={"Your password"}
                               value={password}
                               onChange={e => setPassword(e.target.value)}
                               required/>
                    </div>
                    <div className={"flex flex-col justify-center items-start w-full my-10"}>
                        <label htmlFor={"password"}>Confirm Password</label>
                        <input type="password" className={"w-full py-2 px-4 rounded-md border border-gray-400 mt-2"}
                               placeholder={"Confirm password"}
                               value={confirmPassword}
                               onChange={e => setConfirmPassword(e.target.value)}
                               required/>
                    </div>
                    <div className={"flex flex-row justify-center items-center w-full"}>
                        <div className={"mr-8"}>
                            <span>Already have any account? </span>
                            <a href="/login" className={"underline text-[#17423F] font-semibold"}>Login Here</a>
                        </div>
                        <FulcrumButton displayText={"Register"} backgroundColour={"green"}/>
                    </div>
                </form>
                <p className={"text-8xl flex-1"}></p>
            </div>
        </div>
    );
}