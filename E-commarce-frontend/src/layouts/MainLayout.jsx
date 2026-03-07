import { Outlet } from "react-router-dom";
import TopFixedLayer from "@/Sections/TopLayer/TopFixedLayer";
import BottomLayer from "@/Sections/BottomLayer/BottomLayer";
import { useMatches } from "react-router-dom";

export default function MainLayout() {
  const matches = useMatches();
  const title = matches[matches.length - 1]?.handle?.title;
  return (
    <>
      <TopFixedLayer Title={title} />
      <Outlet />
      <BottomLayer />
    </>
  );
}
