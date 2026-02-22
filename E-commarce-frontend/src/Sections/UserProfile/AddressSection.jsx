import AddressCard from "../../../components/genericComponents/AddressCard";
import DashBoardTableHeader from "../../../components/genericComponents/DashBoardTableHeader";
import DashBoardTable from "../../../components/genericComponents/DashBoardTable";
import Icon from "../../system/icons/Icon";
export default function AddressSection({ addresses }) {
  return (
    <DashBoardTable className={`max-w-5xl`}>
      <DashBoardTableHeader
        ButtonAction={() => console.log("View all")}
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
              type={"Home"}
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
