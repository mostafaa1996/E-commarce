import Navbar from "./Navbar";
import TapInfo from "./tap_Info";
import TitleOfPages from "./TitleOfPages";
export default function TopFixedLayer({ Title }) {
  return (
    <>
      <TapInfo />
      <Navbar />
      <TitleOfPages Title={Title} />
    </>
  );
}
