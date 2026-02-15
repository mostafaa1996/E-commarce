import AddressCard from "../../../components/genericComponents/AddressCard";
import DashBoardTableHeader from "../../../components/genericComponents/DashBoardTableHeader";
import DashBoardTable from "../../../components/genericComponents/DashBoardTable";
export default function AddressSection({ addresses }) {
  return (
    <DashBoardTable className={`max-w-5xl`}>
      <DashBoardTableHeader
        ButtonAction={() => console.log("View all")}
        HeaderText="Addresses"
        HeaderIcon="📍"
        ButtonContent={{ position: "left", text: "Add address", icon: "+" }}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6">
        {addresses.map((address) => (
          <AddressCard key={address.id} {...address} />
        ))}
      </div>
    </DashBoardTable>
  );
}
