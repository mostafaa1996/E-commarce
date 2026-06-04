import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getStoreInfo, createSupportTicket } from "../APIs/contactsService";
import { useToast } from "./use-toast";

const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  messageType: "",
  order: "",
  message: "",
};

const InitialInfoCards = [
  {
    icon: Mail,
    title: "Email Support",
    name: "email",
    value: "",
    href: "mailto:",
  },
  {
    icon: Phone,
    title: "Phone",
    name: "phone",
    value: "+20 128 220 2531",
    href: "tel:",
  },
  { icon: MapPin, title: "Location", name: "address", value: "" },
  {
    icon: Clock,
    title: "Working at",
    name: "working",
    value: "",
  },
];

export const useContactPage = () => {
  const { toast } = useToast();
  const [form, setForm] = useState(INITIAL_FORM);
  const [openFaq, setOpenFaq] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const { data, isLoading, error } = useQuery({
    queryKey: ["store-info"],
    queryFn: getStoreInfo,
  });

  const ContactMutate = useMutation({
    mutationFn: createSupportTicket,
    onSuccess: (data) => {
      setForm(INITIAL_FORM);
      setErrors({});
      setSubmitted(true);
      toast({
        title: "Success",
        description: data.message || "Your message was sent successfully.",
      });
      setTimeout(() => setSubmitted(false), 5000);
    },
    onError: (error) => {
      if (error.data?.errors) {
        const errors = {
          name: error.data.errors.find((e) => e.path === "name")?.msg || "",
          email: error.data.errors.find((e) => e.path === "email")?.msg || "",
          subject: error.data.errors.find((e) => e.path === "subject")?.msg || "",
          messageType: error.data.errors.find((e) => e.path === "messageType")?.msg || "",
          message: error.data.errors.find((e) => e.path === "message")?.msg || "",
        }; 
        setErrors(errors);
      }
      toast({
        title: "Request failed",
        description: error.message || "Please check the form and try again.",
        variant: "destructive",
      });
    },
  });

  const storeInfo = data?.store || null;

  const setField = (key) => (event) =>
    setForm((currentForm) => ({
      ...currentForm,
      [key]: event.target.value,
    }));

  function onSubmit(event) {
    event.preventDefault();
    ContactMutate.mutate(form);
  }

  const infoCards = useMemo(
    () =>
      InitialInfoCards.map((card) => {
        if (card.title === "Working at") {
          return {
            ...card,
            value: storeInfo
              ? storeInfo.workingDays + " - " + storeInfo.workingHours
              : "",
          };
        }
        return {
          ...card,
          value: storeInfo ? storeInfo[card.name] : "",
          href: card.href
            ? `${card.href}${storeInfo ? storeInfo[card.name] : ""}`
            : undefined,
        };
      }),
    [storeInfo],
  );

  const messageTypeOptions = useMemo(() => data?.issuesCategory || [], [data]);

  return {
    form,
    openFaq,
    submitted,
    errors,
    infoCards,
    messageTypeOptions: messageTypeOptions || [],
    INITIAL_FORM,
    storeInfo,
    isLoading,
    error,
    isSubmitting: ContactMutate.isPending,
    setOpenFaq,
    setField,
    onSubmit,
  };
};
