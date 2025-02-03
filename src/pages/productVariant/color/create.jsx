import { Toastify } from "../../../components/toastify";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { NetworkServices } from "../../../network/index";
import { PrimaryButton } from "../../../components/button";
import { useCallback, useEffect, useRef, useState } from "react";
import { networkErrorHandeller } from "../../../utils/helper";
import {
  
  TextInput,
} from "../../../components/input";
 
export const ColorCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [selectedunitIds, setSelectedunitIds] = useState([]);
 
  const {
    control,
    handleSubmit,

    formState: { errors },
  } = useForm();
  /* submit reosurce */
  const onSubmit = async (data) => {
    try {
      setButtonLoading(true);
      const payload = {
        ...data,
      };  
      const response = await NetworkServices.Color.store(payload);
      if (response && (response.status === 201 || response?.status === 200)) {
        navigate('/dashboard/Color')
        setButtonLoading(false);
        return Toastify.Success("Color Created.");
      }
    } catch (error) {
      setButtonLoading(false);
      networkErrorHandeller(error);
    }
  };

  return (
    <>
      <section className="flex justify-between shadow-md p-4 px-6 rounded-md bg-white mb-3">
        <h2 className=" font-semibold text-xl">Color Create</h2>
        <Link to="/dashboard/category">
          <span className="border border-green-500 rounded-full material-symbols-outlined p-1">
            list
          </span>
        </Link>
      </section>

      <section className="shadow-md my-5 p-4 px-6">
        <form className="px-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6 lg:mb-2">
            <TextInput
              label="Color Name"
              name="name"
              type="text"
              placeholder="Enter Color name"
              control={control}
              error={errors.name && errors.name.message}
              rules={{ required: "Color Name is required" }}
            />
          </div>

          {/* submit button */}
          <div className="my-4 flex justify-center">
            <PrimaryButton
              loading={buttonLoading}
              name="Color create"
            ></PrimaryButton>
          </div>
        </form>
      </section>
    </>
  );
};
