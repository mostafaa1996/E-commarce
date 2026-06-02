import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getStoreInfo } from "../APIs/contactsService";

const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  order: "",
  message: "",
};

const InitialInfoCards = [
  {
    icon: Mail,
    title: "Email Support",
    name : "email",
    value: "",
    href: "mailto:",
  },
  {
    icon: Phone,
    title: "Phone",
    name : "phone",
    value: "+20 128 220 2531",
    href: "tel:",
  },
  { icon: MapPin, title: "Location", name : "address", value: "" },
  {
    icon: Clock,
    title: "Working at",
    name : "working",
    value: "",
  },
];

export const useContactPage = () => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [openFaq, setOpenFaq] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const {
    data: storeInfo,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["store-info"],
    queryFn: getStoreInfo,
  });

  const setField = (key) => (event) =>
    setForm((currentForm) => ({
      ...currentForm,
      [key]: event.target.value,
    }));

  function onSubmit(event) {
    event.preventDefault();

    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "Full name is required";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Enter a valid email";
    }

    if (!form.subject.trim()) {
      nextErrors.subject = "Subject is required";
    }

    if (!form.message.trim()) {
      nextErrors.message = "Message is required";
    } else if (form.message.length > 1000) {
      nextErrors.message = "Max 1000 characters";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      setSubmitted(true);
      setForm(INITIAL_FORM);
      setTimeout(() => setSubmitted(false), 5000);
    }
  }

  const infoCards = useMemo(
    () =>
      InitialInfoCards.map((card) =>{ 
        if(card.title === "Working at"){
          return{
            ...card,
            value: storeInfo? storeInfo.workingDays + " - " + storeInfo.workingHours : "" ,
          }
        }
        return{
        ...card,
        value: storeInfo? storeInfo[card.name] : "" ,
        href: card.href
          ? `${card.href}${storeInfo? storeInfo[card.name] : ""}`
          : undefined,
      }}),
    [storeInfo],
  );

  return {
    form,
    openFaq,
    submitted,
    errors,
    infoCards,
    INITIAL_FORM,
    storeInfo,
    isLoading,
    error,
    setOpenFaq,
    setField,
    onSubmit,
  };
};
