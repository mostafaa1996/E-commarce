import AddressCard from "@/components/genericComponents/AddressCard";
import DashBoardTableHeader from "@/components/genericComponents/DashBoardTableHeader";
import DashBoardTable from "@/components/genericComponents/DashBoardTable";
import Icon from "@/system/icons/Icon";
import useProfileRoutingStates from "@/zustand_ProfileRoutesStates/ProfileRoutesStates";
import { useNavigate } from "react-router-dom";
export default function AddressSection({ addresses }) {
  const navigate = useNavigate();
  const { setCurrentRouteState } = useProfileRoutingStates();
  return (
    <DashBoardTable className={`w-full`}>
      <DashBoardTableHeader
        ButtonAction={() => {
          setCurrentRouteState({
            currentRoute: "addresses",
            previousAction: "Add address",
          });
          navigate("/profile/addresses");
        }}
        HeaderText="Addresses"
        HeaderIcon={
          <Icon name="location" size={24} strokeWidth={1.5} variant="primary" />
        }
        ButtonContent={{ position: "left", text: "Add address", icon: "+" }}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6">
        {addresses &&
          addresses.length > 0 &&
          addresses.map((address) => (
            <AddressCard
              key={address._id}
              type={address.label}
              name={address.name}
              street={address.street}
              city={address.city}
              country={address.country}
              isDefault={address.isDefault}
            />
          ))}
      </div>
    </DashBoardTable>
  );
}
