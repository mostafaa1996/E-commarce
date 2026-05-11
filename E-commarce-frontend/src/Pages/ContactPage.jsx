import { useState } from "react";
import Footer from "@/components/Landing/Footer";
import Header from "@/components/Landing/Header";
import ContactFaqSection from "@/components/Landing/ContactFaqSection";
import ContactFormSection from "@/components/Landing/ContactFormSection";
import ContactHeroSection from "@/components/Landing/ContactHeroSection";
import ContactInfoCardsSection from "@/components/Landing/ContactInfoCardsSection";

const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  order: "",
  message: "",
};

export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState(INITIAL_FORM);

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

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <ContactHeroSection />
      <ContactInfoCardsSection />
      <ContactFormSection
        submitted={submitted}
        errors={errors}
        form={form}
        setField={setField}
        onSubmit={onSubmit}
      />
      <ContactFaqSection openFaq={openFaq} setOpenFaq={setOpenFaq} />
      <Footer />
    </div>
  );
}
