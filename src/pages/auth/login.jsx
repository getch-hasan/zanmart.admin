import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import { NetworkServices } from '../../network/index'
import { PrimaryButton } from "../../components/button"
import { getToken, networkErrorHandeller, setToken } from '../../utils/helper'
import { Toastify } from "../../components/toastify";
import { PasswordInput, TextInput } from "../../components/input";
import logo from "../../assets/image/logo.png";
const inputStyle = "mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"

export const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)

    const {
        control,
        handleSubmit,
        register,
        formState: { errors },
    } = useForm()

    const onSubmit = async (data) => {
        try {

            const payload = {
                ...data,
                user_type: "admin"
            }
          
            setLoading(true)
            const response = await NetworkServices.Authentication.login(payload)
         
            if (response.status === 200) {
                setToken(response.data.data.token);
                navigate("/dashboard");
                setLoading(false)
                Toastify.Success("Login successfully done")
            }
        } catch (error) {
            setLoading(false)
            networkErrorHandeller(error)
        }
    }

    useEffect(() => {
        if (getToken()) {
            navigate("/dashboard");
        }
    }, [navigate]);

    return (
        <section className="flex items-center justify-center h-screen">
            <div className="shadow border border-green-100 rounded-lg" style={{ width: "350px" }}>
               <div className="flex justify-center">
                <div className="w-16 h-16 border  rounded-full  mt-3 border-green-100 overflow-hidden p-3 bg-blue-50">
                <img height={58} width={60} className="mx-auto   " src={logo} alt="" />
                </div>
              
               </div>
                <form className="px-4" onSubmit={handleSubmit(onSubmit)}>

                    {/* email */}
                    <div className="my-4">
                        <TextInput
                            label="email"
                            name="email"
                            type="email"
                            placeholder="Email"
                            control={control}
                            error={errors.email && errors.email.message}
                            rules={{ required: "email is required" }}
                        />
                    </div>
                    {/* password */}
                    <div className="my-4">
                        <PasswordInput
                            label="Password"
                            name="password"
                            placeholder="Password"
                            control={control}
                            error={errors.password && errors.password.message}
                            rules={{ required: "Password is required" }}
                        />
                    </div>
                    {/* <Link to={'/registration'}>Create new accounts</Link> */}
                    {/* submit button */}
                    <div className="my-4 flex justify-center">
                        <PrimaryButton loading={loading} name="Sign In"></PrimaryButton>
                    </div>

                </form>
            </div>
        </section>
    )
}