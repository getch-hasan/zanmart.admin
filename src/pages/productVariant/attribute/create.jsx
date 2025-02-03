import { Toastify } from "../../../components/toastify";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { NetworkServices } from "../../../network/index";
import { PrimaryButton } from "../../../components/button";
import { useCallback, useEffect, useRef, useState } from "react";
import { networkErrorHandeller } from "../../../utils/helper";
import { TextInput } from "../../../components/input";
import { SkeletonForm } from "../../../components/loading/skeleton-table";

const AttributeCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [unitId, setUnitId] = useState(null);
  const [unitData, setUnitData] = useState([]);
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
        unit_id: unitId,
      };
      const response = await NetworkServices.Attribute.store(payload);
      if (response && (response.status === 201 || response?.status === 200)) {
        navigate("/dashboard/attribute");
        setButtonLoading(false);
        return Toastify.Success("attribute Created.");
      }
    } catch (error) {
      setButtonLoading(false);
      networkErrorHandeller(error);
    }
  };
  // find unit litre
  const fetchDataForUnit = useCallback(async (category) => {
    try {
      setLoading(true);
      const response = await NetworkServices.Unit.index();
    
      if (response?.status === 200 || response?.status === 201) {
        setUnitData(response?.data?.data?.data);
        setLoading(false);
      }
    } catch (error) {
      if (error) {
        networkErrorHandeller(error);
      }
    }
  }, []);
  useEffect(() => {
    fetchDataForUnit();
  }, []);
  return (
    <>
    {
        loading ? <SkeletonForm/> :<>
           <section className="flex justify-between shadow-md p-4 px-6 rounded-md bg-white mb-3">
        <h2 className=" font-semibold text-xl">attribute Create</h2>
        <Link to="/dashboard/attribute">
          <span className="border border-green-500 rounded-full material-symbols-outlined p-1">
            list
          </span>
        </Link>
      </section>

      <section className="shadow-md my-5 p-4 px-6">
        <form className="px-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-6 lg:mb-2">
        <p>Unit IDs</p>
          <div className="grid grid-cols-2 md:grid-cols-4 ">
            {unitData.map((unit) => (
              <div key={unit?.unit_id}>
                <label className="space-x-2">
                  <div className="flex gap-2 items-center">
                    <input
                      type="checkbox"
                      checked={unit?.unit_id === unitId}
                      onChange={() => setUnitId(unit?.unit_id)} // Handle checkbox selection
                      className="cursor-pointer"
                    />
                    <span>{unit?.name}</span>
                  </div>
                </label>
              </div>
            ))}
          </div>
          </div>
          <div className="mb-6 lg:mb-2">
            <TextInput
              label="Attribute Name"
              name="name"
              type="text"
              placeholder="Enter attribute name"
              control={control}
              error={errors.name && errors.name.message}
              rules={{ required: "attribute Name is required" }}
            />
          </div>

          {/* submit button */}
          <div className="my-4 flex justify-center">
            <PrimaryButton
              loading={buttonLoading}
              name="attribute create"
            ></PrimaryButton>
          </div>
        </form>
      </section>
        </>
    }
   
   
    </>
  );
};

export default AttributeCreate;
